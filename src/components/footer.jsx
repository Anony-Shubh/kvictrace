import { CircleHelp } from "lucide-react";

function Footer({ totalVisits = 0 }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="support">
          <CircleHelp
            className="support-icon"
            aria-hidden="true"
            size={15}
            strokeWidth={1.8}
          />
          <span>Facing any issues? Contact</span>
          <a href="mailto:apps.support@kvic.gov.in">apps.support@kvic.gov.in</a>
        </div>
        <div className="footer-meta">
          <span className="footer-visits">
            Total visits: <strong>{Number(totalVisits).toLocaleString()}</strong>
          </span>
          <span>
            © {currentYear} KVIC TRACE <span>DIT {currentYear}</span> Tracking
            Portal | Beta Version
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
