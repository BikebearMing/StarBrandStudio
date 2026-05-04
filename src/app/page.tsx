import Awards from '@/components/Awards/Awards'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import HeroSection from '@/components/Hero/HeroSection'
import LogoCarousel from '@/components/LogoCarousel/LogoCarousel'
import Pillars from '@/components/Pillars/Pillars'
import Services from '@/components/Services/Services'
import Projects from '@/components/Projects/Project'
import VideoPopup from '@/components/VideoPopup/VideoPopup'
import ImpactCTA from '@/components/ImpactCTA/ImpactCTA'

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
                  Across every platform—digital, radio, on-ground, print and social we bring brand <span><img src="/SMG_Logo-Loop-Animation.gif" alt="" /></span> ideas to life, creating moments that spark connection and inspire action.
                </h4>
              </div>

              <div className="right">
                <VideoPopup />
              </div>

            </div>
          </div>
        </section>

        <section className="pillars-section">
          <div className="wrapper">
            <Pillars />
          </div>
        </section>

        <LogoCarousel />
        <Awards />
        <Projects />

        <section className="services">
          <div className="wrapper">
            <Services />
          </div>
        </section>
      </div>
      <ImpactCTA />
      <Footer />
    </main>
  )
}
