import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    skillOffered: "",
    skillWanted: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        skillOffered: form.skillOffered,
        skillWanted: form.skillWanted,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="auth-section">
      <div className="ticket auth-card" style={{ "--notch-bg": "var(--canvas)" }}>
        <div className="auth-head">
          <span className="eyebrow">Join for free</span>
          <h1>Create your account</h1>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Aditi Rao"
              value={form.name}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@student.edu"
              value={form.email}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              disabled={submitting}
              required
            />
          </div>

          <div className="row" style={{ gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="skillOffered">A skill you can teach</label>
              <input
                id="skillOffered"
                name="skillOffered"
                type="text"
                placeholder="e.g. React"
                value={form.skillOffered}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label htmlFor="skillWanted">A skill you want</label>
              <input
                id="skillWanted"
                name="skillWanted"
                type="text"
                placeholder="e.g. Java"
                value={form.skillWanted}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-foot">
          Already on SkillX? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  );
}
