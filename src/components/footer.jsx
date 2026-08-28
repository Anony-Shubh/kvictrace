import { CircleHelp } from "lucide-react";

function Footer() {
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
          © 2026 KVIC TRACE 1.0 <span>DIT 2026</span> KVIC TRACE 1.0 · Secure
          Tracking Portal | 1.0
        </div>
      </div>
    </footer>
  );
}

export default Footer;
