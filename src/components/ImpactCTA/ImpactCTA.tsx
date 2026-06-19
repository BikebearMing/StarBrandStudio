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
          <h2 className="h1-v2 amp-mask impact-cta__heading">LET&rsquo;S</h2>
          <p className="body">
            TOGETHER, WE&rsquo;LL BUILD SOMETHING<br />WORTH TALKING ABOUT.
          </p>
        </div>
        <div className="impact-cta__bottom">
          <span className="h1-v2 impact-cta__impact">CONNECT</span>
        </div>
      </div>
    </section>
  )
}
