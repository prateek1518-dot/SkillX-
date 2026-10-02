import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section
      className="section"
      style={{ textAlign: "center", padding: "96px 24px" }}
    >
      <span className="eyebrow">404</span>
      <h1 style={{ fontSize: "2rem", margin: "10px 0 16px" }}>
        This page didn't come with a match.
      </h1>
      <Link to="/" className="btn btn-primary">
        Back to SkillX
      </Link>
    </section>
  );
}
