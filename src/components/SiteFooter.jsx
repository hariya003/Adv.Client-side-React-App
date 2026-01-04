import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const SiteFooter = ({ onNavigate }) => {
  const year = new Date().getFullYear();

  function go(e, id) {
    e.preventDefault();
    if (onNavigate) onNavigate(id);
    else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="footer-section footer-branding">
          <div className="footer-title">Property Point</div>
          <p className="footer-sub">
            Browse properties, filter by price/beds/date, view details with gallery + tabs
            and manage favourites with drag & drop.
          </p>
        </div>

        <div className="footer-section footer-nav">
          <h4>Explore</h4>
          <ul>
            <li>
              <a href="#browse" onClick={(e) => go(e, "browse")}>Browse</a>
            </li>
            <li>
              <a href="#saved" onClick={(e) => go(e, "saved")}>Saved</a>
            </li>
            <li>
              <a href="#about" onClick={(e) => go(e, "about")}>About</a>
            </li>
          </ul>
        </div>

        <div className="footer-section footer-contact">
          <h4>Get in touch</h4>
          <p>Email: contact@propertypoint.com</p>
          <p>Phone: +44 1234 567 890</p>

          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>

      <div className="site-footer__bottom">
        <p>© {year} Property Point. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default SiteFooter;