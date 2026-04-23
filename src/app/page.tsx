import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import HeroSection from '@/components/Hero/HeroSection'
import LogoCarousel from '@/components/LogoCarousel/LogoCarousel'
import Pillars from '@/components/Pillars/Pillars'
import Services from '@/components/Services/Services'
import Projects from '@/components/Projects/Project'

export default function Home() {
  return (
    <main>
      <Header />
      <div className="pin-stack">
        <HeroSection />
        <section className="what-we-do red-section">
          <div className="wrapper">
            <div className="top">
              <div className="left">
                <h3 className="subhead">
                  WHAT WE DO
                </h3>
                <h4 className="h2">
                  Across every platform—digital, radio, on-ground, print and social we bring brand <span><img src="/nike.svg" alt="" /></span> ideas to life, creating moments that spark connection and inspire action.
                </h4>
              </div>

              <div className="right">
                <div className="video-popup-wrapper">
                  <img src="./carousel/test-image.png" alt="" className="thumbnail" />
                  <button type="button" className="custom-button">
                    <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                      <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                      <circle className="ring ring--inner" cx="12" cy="12" r="3" />
                    </svg>
                    <span>WATCH SHOWREEL</span>
                  </button>
                </div>

              </div>

            </div>

            <div className="bottom">
              <Pillars />
            </div>
          </div>
        </section>

        <section className="services">
          <div className="wrapper">
            <Services />
          </div>
        </section>
      </div>
      <Projects />
      {/* <LogoCarousel /> */}
      <Footer />
    </main>
  )
}
