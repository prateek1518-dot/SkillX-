import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import skillService from "../api/skillService.js";
import requestService from "../api/requestService.js";
import { useAuth } from "../context/AuthContext.jsx";
import SkillTicket from "../components/SkillTicket.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState(null); // { message, isError }
  const [showPostForm, setShowPostForm] = useState(false);
  const [postForm, setPostForm] = useState({
    offers: "",
    wants: "",
    blurb: "",
  });
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    async function loadSkills() {
      try {
        const data = await skillService.getSkills();
        setSkills(data);
      } catch (err) {
        console.error("Failed to load skills:", err);
        showToast("Failed to load skill listings from server.", true);
      } finally {
        setLoading(false);
      }
    }

    loadSkills();
  }, []);

  function showToast(message, isError = false) {
    setToast({ message, isError });
    setTimeout(() => setToast(null), 4000);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return skills;
    return skills.filter(
      (l) =>
        (l.offers && l.offers.toLowerCase().includes(q)) ||
        (l.wants && l.wants.toLowerCase().includes(q)) ||
        (l.user && l.user.toLowerCase().includes(q))
    );
  }, [skills, query]);

  async function handleRequest(listing) {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/dashboard" } } });
      return;
    }

    try {
      await requestService.createRequest({
        skillListingId: listing.id || listing._id,
        toUser: listing.userId,
        toUserName: listing.user,
        theirSkill: listing.offers,
        yourSkill: listing.wants,
      });

      showToast("Exchange request sent! Track its status under Requests.");
    } catch (err) {
      showToast(err.message || "Failed to send exchange request.", true);
    }
  }

  async function handlePostListing(e) {
    e.preventDefault();
    if (!postForm.offers || !postForm.wants || !postForm.blurb) {
      showToast("All fields are required to post an exchange.", true);
      return;
    }

    setPosting(true);
    try {
      const created = await skillService.createSkill(postForm);
      setSkills((prev) => [created, ...prev]);
      setPostForm({ offers: "", wants: "", blurb: "" });
      setShowPostForm(false);
      showToast("Your skill trade listing has been published!");
    } catch (err) {
      showToast(err.message || "Could not publish listing.", true);
    } finally {
      setPosting(false);
    }
  }

  return (
    <section className="section dashboard">
      <div className="container">
        <div className="dashboard-head">
          <div>
            <span className="eyebrow">Browse</span>
            <h1 className="dashboard-title">Find a skill to trade for</h1>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              className="dashboard-search"
              type="text"
              placeholder="Search a skill or a name…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {isAuthenticated && (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowPostForm(!showPostForm)}
              >
                {showPostForm ? "Cancel" : "+ Post exchange"}
              </button>
            )}
          </div>
        </div>

        {toast && (
          <div
            className={`dashboard-toast ${
              toast.isError ? "dashboard-toast-error" : ""
            }`}
          >
            {toast.message}
          </div>
        )}

        {showPostForm && (
          <div className="card dashboard-post-card">
            <h2 className="dashboard-post-title">Post a new skill trade</h2>
            <form onSubmit={handlePostListing}>
              <div className="row" style={{ gap: 16 }}>
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor="offers">What you will teach (Offers)</label>
                  <input
                    id="offers"
                    type="text"
                    placeholder="e.g. React, Docker, Figma"
                    value={postForm.offers}
                    onChange={(e) =>
                      setPostForm({ ...postForm, offers: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label htmlFor="wants">What you want to learn (Wants)</label>
                  <input
                    id="wants"
                    type="text"
                    placeholder="e.g. Python, Golang, UI Design"
                    value={postForm.wants}
                    onChange={(e) =>
                      setPostForm({ ...postForm, wants: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="blurb">Short pitch / availability</label>
                <input
                  id="blurb"
                  type="text"
                  placeholder="e.g. 2 yrs hands-on experience, looking to pair 2 hours/week."
                  value={postForm.blurb}
                  onChange={(e) =>
                    setPostForm({ ...postForm, blurb: e.target.value })
                  }
                  required
                />
              </div>
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowPostForm(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={posting}
                >
                  {posting ? "Publishing..." : "Publish exchange"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p className="eyebrow" style={{ padding: "40px 0" }}>
            Loading skills from database...
          </p>
        ) : filtered.length === 0 ? (
          <p className="dashboard-empty">
            Nothing matches "{query}". Try a different skill.
          </p>
        ) : (
          <div className="listing-grid">
            {filtered.map((l) => (
              <SkillTicket
                key={l.id || l._id}
                listing={l}
                onRequest={handleRequest}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
