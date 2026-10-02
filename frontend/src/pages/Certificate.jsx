import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import certificateService from "../api/certificateService.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Certificate.css";

export default function Certificate() {
  const { id } = useParams();
  const { user } = useAuth();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCertificate() {
      try {
        const certId = id || "SKX-2026-000482";
        const data = await certificateService.getCertificate(certId);
        setCert(data);
      } catch (err) {
        console.error("Failed to load certificate:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCertificate();
  }, [id]);

  if (loading) {
    return (
      <section className="section certificate-empty">
        <div className="container">
          <p className="eyebrow">Verifying certificate credentials...</p>
        </div>
      </section>
    );
  }

  if (!cert) {
    return (
      <section className="section certificate-empty">
        <div className="container">
          <p>No certificate found.</p>
          <Link to="/sessions">Back to sessions</Link>
        </div>
      </section>
    );
  }

  const recipientName = cert.userName || (user && user.name) || "SkillX Student";

  return (
    <section className="section certificate">
      <div className="container certificate-container">
        <div className="ticket certificate-card" style={{ "--notch-bg": "var(--canvas)" }}>
          <div className="certificate-eyebrow-row">
            <span className="eyebrow">SkillX · Certificate of exchange</span>
            <span className="certificate-number">{cert.number}</span>
          </div>

          <h1 className="certificate-title">{cert.skill}</h1>
          <p className="certificate-body">
            This certifies that <strong>{recipientName}</strong> completed
            a peer-to-peer skill exchange in <strong>{cert.skill}</strong>{" "}
            with <strong>{cert.withUser}</strong>, through mutual teaching and
            learning sessions on SkillX.
          </p>

          <hr className="ticket-divider" />

          <div className="certificate-foot">
            <div>
              <span className="eyebrow">Issued</span>
              <p>{cert.issuedOn}</p>
            </div>
            <div>
              <span className="eyebrow">Exchange partner</span>
              <p>{cert.withUser}</p>
            </div>
          </div>
        </div>

        <button className="btn btn-ghost" onClick={() => window.print()}>
          Print / save as PDF
        </button>
      </div>
    </section>
  );
}
