import { Fragment } from 'react'

export type AwardImage = { src: string; alt?: string }

const DEFAULT_AWARDS: AwardImage[] = [
  { src: '/award1.png' },
  { src: '/award2.png' },
  { src: '/award3.png' },
  { src: '/award4.png' },
  { src: '/award5.png' },
]

const DEFAULT_CAPTION = 'AWARD-WINNING IDEAS \nGROUNDED IN GOOD\nSTORYTELLING'

type AwardsProps = {
  title?: string
  buttonLabel?: string
  caption?: string
  recognitions?: string
  items?: AwardImage[]
}

export default function Awards({
  title = 'AWARDS',
  buttonLabel = 'VIEW ALL AWARDS',
  caption = DEFAULT_CAPTION,
  recognitions = '& RECOGNITIONS',
  items,
}: AwardsProps = {}) {
  const AWARDS = items?.length ? items : DEFAULT_AWARDS
  const captionLines = caption.split('\n')

  return (
    <section className="awards">
      <div className="awards__inner">
        <div className="awards__heading">
          <div className="awards__heading-top">
            <h2 className="h1 awards__title">
              <span className="text-highlight">{title}</span>
            </h2>
            <a href="/awards" className="custom-button awards__button">
              <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                <circle className="ring ring--inner" cx="12" cy="12" r="3" />
              </svg>
              <span>{buttonLabel}</span>
            </a>
          </div>
          <div className="awards__heading-bottom">
            <p className="body awards__caption">
              {captionLines.map((line, i) => (
                <Fragment key={i}>
                  {line}
                  {i < captionLines.length - 1 && <br />}
                </Fragment>
              ))}
            </p>
            <h3 className="h1 amplitude amp-mask awards__rec">{recognitions}</h3>
          </div>
        </div>

        <ul className="awards__grid">
          {AWARDS.map((award, i) => (
            <li key={i} className="awards__item">
              <img className="awards__img" src={award.src} alt={award.alt || `Award ${i + 1}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
