import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sessionService from "../api/sessionService.js";
import "./Sessions.css";

export default function Sessions() {
  const [sessionList, setSessionList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        const data = await sessionService.getSessions();
        setSessionList(data);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSessions();
  }, []);

  async function toggleStatus(session) {
    const nextStatus = session.status === "completed" ? "upcoming" : "completed";
    const sessId = session.id || session._id;
    setUpdatingId(sessId);

    try {
      const updated = await sessionService.updateSession(sessId, {
        status: nextStatus,
      });

      setSessionList((prev) =>
        prev.map((s) => ((s.id === sessId || s._id === sessId) ? updated : s))
      );
    } catch (err) {
      alert(err.message || "Failed to update session status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const sorted = [...sessionList].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <section className="section sessions">
      <div className="container">
        <span className="eyebrow">Sessions</span>
        <h1 className="sessions-title">Learning session tracker</h1>
        <p className="sessions-sub">
          Every session from an active exchange shows up here. Mark them off
          as you go — completing all sessions on both sides is what triggers
          a certificate.
        </p>

        {loading ? (
          <p className="eyebrow" style={{ padding: "40px 0" }}>
            Loading your learning sessions...
          </p>
        ) : sorted.length === 0 ? (
          <div style={{ padding: "48px 0" }}>
            <p style={{ marginBottom: "16px" }}>
              No sessions scheduled yet. Accept an exchange request to kick off
              your first session!
            </p>
            <Link to="/dashboard" className="btn btn-primary btn-sm">
              Browse exchanges
            </Link>
          </div>
        ) : (
          <div className="timeline">
            {sorted.map((s) => {
              const sessId = s.id || s._id;
              const isUpdating = updatingId === sessId;

              return (
                <div key={sessId} className="timeline-item">
                  <div className="timeline-marker">
                    <span
                      className={`timeline-dot ${
                        s.status === "completed" ? "is-done" : ""
                      }`}
                    />
                    <span className="timeline-line" />
                  </div>

                  <div className="ticket timeline-card">
                    <div className="timeline-card-head">
                      <p className="timeline-skill">{s.skill}</p>
                      <button
                        type="button"
                        onClick={() => toggleStatus(s)}
                        disabled={isUpdating}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                        title="Click to toggle status"
                      >
                        <span
                          className={`status-pill ${
                            s.status === "completed"
                              ? "status-done"
                              : "status-active"
                          }`}
                        >
                          {isUpdating
                            ? "Updating..."
                            : s.status === "completed"
                            ? "Completed ✓"
                            : "Upcoming"}
                        </span>
                      </button>
                    </div>
                    <p className="timeline-with">with {s.withUser}</p>
                    <p className="timeline-note">{s.note}</p>
                    <p className="timeline-date">{s.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
