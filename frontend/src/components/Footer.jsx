import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="navbar-logo footer-logo">
            Skill<span>X</span>
          </div>
          <p className="footer-tagline">
            Trade what you know for what you want to learn.
          </p>
        </div>

        <div className="footer-cols">
          <div>
            <p className="footer-heading">Product</p>
            <Link to="/dashboard">Browse skills</Link>
            <Link to="/requests">Exchange requests</Link>
            <Link to="/sessions">Sessions</Link>
          </div>
          <div>
            <p className="footer-heading">Account</p>
            <Link to="/login">Log in</Link>
            <Link to="/register">Create account</Link>
            <Link to="/profile">Your profile</Link>
          </div>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>Course project · 25CS022 · built with React</p>
      </div>
    </footer>
  );
}
