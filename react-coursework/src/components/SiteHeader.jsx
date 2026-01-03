import { FaHome, FaBookmark } from "react-icons/fa";

function SiteHeader({ savedCount = 0, onNavigate }) {
  function go(e, id) {
    e.preventDefault();
    if (onNavigate) onNavigate(id);
    else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <div className="brand">
          <span className="brand__icon">
            <FaHome />
          </span>
          <span>Property Point</span>
        </div>

        <nav className="site-nav">
          <a className="nav-link" href="#browse" onClick={(e) => go(e, "browse")}>
            Browse
          </a>
          <a className="nav-link" href="#saved" onClick={(e) => go(e, "saved")}>
            Saved <span className="pill">{savedCount}</span>
          </a>
          <a className="nav-link" href="#about" onClick={(e) => go(e, "about")}>
            About
          </a>
        </nav>
      </div>
    </header>
  );
}

export default SiteHeader;