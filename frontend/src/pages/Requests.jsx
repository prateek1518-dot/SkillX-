import { useEffect, useState } from "react";
import requestService from "../api/requestService.js";
import "./Requests.css";

const statusLabel = {
  pending: "Pending",
  active: "Active",
  done: "Completed",
  declined: "Declined",
};

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of request being updated

  useEffect(() => {
    async function loadRequests() {
      try {
        const data = await requestService.getRequests();
        setRequests(data);
      } catch (err) {
        console.error("Failed to load requests:", err);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  async function respond(id, next) {
    setActionLoading(id);
    try {
      const updated = await requestService.updateRequestStatus(id, next);
      setRequests((prev) =>
        prev.map((r) => ((r.id === id || r._id === id) ? updated : r))
      );
    } catch (err) {
      alert(err.message || "Failed to update request.");
    } finally {
      setActionLoading(null);
    }
  }

  const visible = requests.filter((r) =>
    filter === "all" ? true : r.direction === filter
  );

  return (
    <section className="section requests">
      <div className="container">
        <span className="eyebrow">Requests</span>
        <h1 className="requests-title">Your exchange requests</h1>

        <div className="requests-filter">
          {["all", "incoming", "outgoing"].map((f) => (
            <button
              key={f}
              className={`requests-filter-btn ${filter === f ? "is-active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="eyebrow" style={{ padding: "40px 0" }}>
            Loading your requests...
          </p>
        ) : (
          <div className="requests-list">
            {visible.map((r) => {
              const reqId = r.id || r._id;
              const isWorking = actionLoading === reqId;

              return (
                <div key={reqId} className="ticket request-row">
                  <div className="request-main">
                    <p className="request-with">
                      {r.direction === "incoming" ? "From " : "To "}
                      <strong>{r.withUser}</strong>
                    </p>
                    <p className="request-trade">
                      Their <span className="tag">{r.theirSkill}</span> for your{" "}
                      <span className="tag tag-wants">{r.yourSkill}</span>
                    </p>
                    <p className="request-date">Sent {r.sentOn}</p>
                  </div>

                  <div className="request-side">
                    <span className={`status-pill status-${r.status}`}>
                      {statusLabel[r.status] || r.status}
                    </span>

                    {r.direction === "incoming" && r.status === "pending" && (
                      <div className="request-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => respond(reqId, "active")}
                          disabled={isWorking}
                        >
                          {isWorking ? "Updating..." : "Accept"}
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => respond(reqId, "declined")}
                          disabled={isWorking}
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {visible.length === 0 && (
              <p className="requests-empty">No {filter} requests yet.</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
