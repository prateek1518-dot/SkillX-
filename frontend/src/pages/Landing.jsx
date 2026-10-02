import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import skillService from "../api/skillService.js";
import SkillTicket from "../components/SkillTicket.jsx";
import "./Landing.css";

const steps = [
  {
    n: "01",
    title: "Post what you know, and what you want",
    body: "Add the skills you can teach and the ones you're trying to pick up. No pricing, no packages — just a straight swap.",
  },
  {
    n: "02",
    title: "Get matched, send a request",
    body: "SkillX surfaces people whose \"wants\" line up with your \"offers\" — and the other way around.",
  },
  {
    n: "03",
    title: "Teach, learn, get certified",
    body: "Track sessions as you go. Once both sides complete the exchange, you rate each other and a certificate is issued.",
  },
];

export default function Landing() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const data = await skillService.getSkills({ limit: 3 });
        setFeatured(data);
      } catch (err) {
        console.error("Failed to fetch featured skills:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  return (
    <div>
      {/* ---------------- hero ---------------- */}
      <section className="hero section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Peer-to-peer skill exchange</span>
            <h1 className="hero-title">
              Learn what you need.
              <br />
              Teach what you know.
            </h1>
            <p className="hero-sub">
              SkillX connects students who'd rather trade knowledge than pay
              for it. Offer a skill, request one back, and walk away with a
              certificate instead of a receipt.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary">
                Get started
              </Link>
              <Link to="/dashboard" className="btn btn-ghost">
                Browse exchanges
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="ticket hero-ticket" style={{ "--notch-bg": "var(--paper)" }}>
              <span className="eyebrow">Exchange ticket · No. SKX-0001</span>
              <div className="hero-ticket-trade">
                <div>
                  <span className="tag">Offers · React</span>
                </div>
                <div className="hero-ticket-swap">⇄</div>
                <div>
                  <span className="tag tag-wants">Wants · Java</span>
                </div>
              </div>
              <hr className="ticket-divider" />
              <p className="hero-ticket-note">
                2 sessions logged · rating pending
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- how it works ---------------- */}
      <section className="section section-canvas">
        <div className="container">
          <h2 className="section-title">How an exchange works</h2>
          <div className="steps-grid">
            {steps.map((s) => (
              <div key={s.n} className="step">
                <span className="step-number">{s.n}</span>
                <h3 className="step-title">{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- featured listings ---------------- */}
      <section className="section">
        <div className="container">
          <div className="section-head-row">
            <h2 className="section-title">Open right now</h2>
            <Link to="/dashboard" className="section-head-link">
              View all →
            </Link>
          </div>

          {loading ? (
            <p className="eyebrow" style={{ padding: "20px 0" }}>Loading open exchanges...</p>
          ) : (
            <div className="listing-grid">
              {featured.map((l) => (
                <SkillTicket key={l.id || l._id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- closing cta ---------------- */}
      <section className="section section-canvas">
        <div className="container cta-row">
          <div>
            <h2 className="section-title">Your next skill is one trade away.</h2>
            <p className="cta-sub">Free to join. No cards, just skills.</p>
          </div>
          <Link to="/register" className="btn btn-accent">
            Create your account
          </Link>
        </div>
      </section>
    </div>
  );
}
