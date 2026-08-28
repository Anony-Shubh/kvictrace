import msmeLogo from "../assets/msme_goi_logo.png";
import kvicLogo from "../assets/kvic_logo.png";
import khadiIndiaLogo from "../assets/khadi_india_logo.png";

function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="identity-group">
          <img
            className="header-logo logo-msme"
            src={msmeLogo}
            alt="Ministry of Micro, Small and Medium Enterprises, Government of India"
          />
          <img
            className="header-logo logo-kvic"
            src={kvicLogo}
            alt="Khadi and Village Industries Commission"
          />
          <img
            className="header-logo logo-khadi"
            src={khadiIndiaLogo}
            alt="Khadi India"
          />
        </div>
        <div className="portal-title">
          <h1>KHADI TRACE</h1>
        </div>
        <div className="ministry-copy">
          <p>KHADI AND VILLAGE INDUSTRIES COMMISSION</p>
          <strong>Ministry of Micro, Small &amp; Medium Enterprises</strong>
          <span>Government of India.</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
