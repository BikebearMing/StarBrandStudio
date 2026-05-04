import ImageTrail from './ImageTrail'
import ImpactCursor from './ImpactCursor'

// Swap these out for your own assets later — e.g. ['/impact/01.jpg', '/impact/02.jpg', ...]
const TRAIL_IMAGES = [
  'https://picsum.photos/seed/sb-impact-1/600/400',
  'https://picsum.photos/seed/sb-impact-2/600/400',
  'https://picsum.photos/seed/sb-impact-3/600/400',
  'https://picsum.photos/seed/sb-impact-4/600/400',
  'https://picsum.photos/seed/sb-impact-5/600/400',
  'https://picsum.photos/seed/sb-impact-6/600/400',
  'https://picsum.photos/seed/sb-impact-7/600/400',
  'https://picsum.photos/seed/sb-impact-8/600/400',
]

export default function ImpactCTA() {
  return (
    <section className="impact-cta">
      <ImpactCursor />
      <ImageTrail items={TRAIL_IMAGES} variant={1} threshold={80} />
      <div className="impact-cta__inner">
        <div className="impact-cta__top">
          <h2 className="h1-v2 impact-cta__heading">LET&rsquo;S MAKE AN</h2>
          <a href="/contact" className="custom-button">
            <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle className="ring ring--outer" cx="12" cy="12" r="11" />
              <circle className="ring ring--middle" cx="12" cy="12" r="7" />
              <circle className="ring ring--inner" cx="12" cy="12" r="3" />
            </svg>
            <span>LET&rsquo;S TALK</span>
          </a>
        </div>
        <div className="impact-cta__bottom">
          <p className="body">
            TOGETHER, WE&rsquo;LL BUILD SOMETHING<br />WORTH TALKING ABOUT.
          </p>
          <span className="h1-v2 impact-cta__impact">IMPACT</span>
        </div>
      </div>
    </section>
  )
}
