const PLACEHOLDER_COUNT = 5

export default function Awards() {
  return (
    <section className="awards">
      <div className="awards__inner">
        <div className="awards__heading">
          <div className="awards__heading-top">
            <h2 className="h1 awards__title">
              <span className="text-highlight">AWARDS</span>
            </h2>
            <button type="button" className="custom-button awards__button">
              <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="ring ring--outer" cx="12" cy="12" r="11" />
                <circle className="ring ring--middle" cx="12" cy="12" r="7" />
                <circle className="ring ring--inner" cx="12" cy="12" r="3" />
              </svg>
              <span>VIEW ALL AWARDS</span>
            </button>
          </div>
          <div className="awards__heading-bottom">
            <p className="body awards__caption">
              AWARD-WINNING IDEAS,<br />
              GROUNDED IN THE CRAFT<br />
              OF STORYTELLING.
            </p>
            <h3 className="h1 amplitude awards__rec">&amp; RECOGNITIONS</h3>
          </div>
        </div>

        <ul className="awards__grid">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
            <li key={i} className="awards__item">
              <div className="awards__placeholder" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
