export default function Footer() {
  return (
    <footer className="custom-footer">
      <div className="footer-top">
        <div className="footer-column-left">
          <div className="footer-location">
            <p>
              Lot 2, Jalan Astaka U8/88 Section U8, Bukit Jelutong 40150 Shah
              Alam, Selangor Darul Ehsan, Malaysia
            </p>
          </div>
          <div className="footer-contact-no">
            <p>+603 7967 1388</p>
            <p>+603 7845 4644</p>
          </div>
        </div>

        <div className="footer-column-middle">
          <div className="footer-directory">
            <p><a href="/about">ABOUT</a></p>
            <p><a href="/works">WORKS</a></p>
            <p><a href="/services">SERVICES</a></p>
            <p><a href="/awards">AWARDS</a></p>
            <p><a href="/contact">CONTACT</a></p>
          </div>
        </div>

        <div className="footer-column-right">
          <div className="footer-socmed-excerpt">
            <p>GET THE LATEST UPDATES</p>
          </div>
          <div className="footer-socmed">
            <a href="#" aria-label="Facebook"><img src="/footer/facebook.svg" alt="Facebook" /></a>
            <a href="#" aria-label="Instagram"><img src="/footer/instagram.svg" alt="Instagram" /></a>
            <a href="#" aria-label="LinkedIn"><img src="/footer/linkedin.svg" alt="LinkedIn" /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-top">
          <img src="/footer/smg-brand-studio.png" alt="SMG BRAND STUDIO" />
          <p>Copyrights &reg; of Star Media Group 2026</p>
        </div>
        <div className="footer-bottom-bottom">
          <p>SMGBRANDSTUDIO@THESTAR.COM.MY</p>
        </div>
      </div>
    </footer>
  )
}
