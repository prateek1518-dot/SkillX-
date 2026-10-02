import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "./Profile.css";

export default function Profile() {
  const { user, addSkill, removeSkill } = useAuth();

  const [newOffered, setNewOffered] = useState("");
  const [newWanted, setNewWanted] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  if (!user) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
        <p className="eyebrow">Loading profile...</p>
      </div>
    );
  }

  const offered = user.skillsOffered || [];
  const wanted = user.skillsWanted || [];

  const initials = (user.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleAdd(e, type, value, setValue) {
    e.preventDefault();
    const v = value.trim();
    if (!v) return;

    const list = type === "offered" ? offered : wanted;
    if (list.includes(v)) {
      setMsg(`"${v}" is already on your list.`);
      setTimeout(() => setMsg(""), 3000);
      return;
    }

    setLoading(true);
    try {
      await addSkill(type, v);
      setValue("");
      setMsg(`Added "${v}" successfully!`);
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      setMsg(err.message || "Could not add skill.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(type, skill) {
    setLoading(true);
    try {
      await removeSkill(type, skill);
      setMsg(`Removed "${skill}".`);
      setTimeout(() => setMsg(""), 2500);
    } catch (err) {
      setMsg(err.message || "Could not remove skill.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section profile">
      <div className="container profile-grid">
        <div className="card profile-summary">
          <div className="profile-avatar">{initials}</div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="profile-rating">
            ★ {user.rating ? user.rating.toFixed(1) : "5.0"} rating
          </p>
          {msg && (
            <p
              className="eyebrow"
              style={{
                marginTop: "16px",
                fontSize: "0.75rem",
                color: "var(--primary)",
              }}
            >
              {msg}
            </p>
          )}
        </div>

        <div className="profile-skills">
          <div className="card">
            <h2 className="profile-section-title">Skills you offer</h2>
            <div className="profile-tag-row">
              {offered.map((s) => (
                <span key={s} className="tag profile-editable-tag">
                  {s}
                  <button
                    type="button"
                    aria-label={`Remove ${s}`}
                    onClick={() => handleRemove("offered", s)}
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
              {offered.length === 0 && (
                <p style={{ fontSize: "0.86rem", color: "var(--ink-faint)" }}>
                  You haven't listed any skills to teach yet.
                </p>
              )}
            </div>
            <form
              className="profile-add-form"
              onSubmit={(e) =>
                handleAdd(e, "offered", newOffered, setNewOffered)
              }
            >
              <input
                type="text"
                placeholder="Add a skill you can teach"
                value={newOffered}
                onChange={(e) => setNewOffered(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-ghost btn-sm"
                disabled={loading || !newOffered.trim()}
              >
                Add
              </button>
            </form>
          </div>

          <div className="card">
            <h2 className="profile-section-title">Skills you want</h2>
            <div className="profile-tag-row">
              {wanted.map((s) => (
                <span key={s} className="tag tag-wants profile-editable-tag">
                  {s}
                  <button
                    type="button"
                    aria-label={`Remove ${s}`}
                    onClick={() => handleRemove("wanted", s)}
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
              {wanted.length === 0 && (
                <p style={{ fontSize: "0.86rem", color: "var(--ink-faint)" }}>
                  You haven't listed any skills you want to learn yet.
                </p>
              )}
            </div>
            <form
              className="profile-add-form"
              onSubmit={(e) =>
                handleAdd(e, "wanted", newWanted, setNewWanted)
              }
            >
              <input
                type="text"
                placeholder="Add a skill you want to learn"
                value={newWanted}
                onChange={(e) => setNewWanted(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="btn btn-ghost btn-sm"
                disabled={loading || !newWanted.trim()}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
