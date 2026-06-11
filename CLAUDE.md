# StarBrandStudio — Project Conventions

## Buttons — always use the global `.custom-button`

Every button or button-styled link in the frontend MUST use the global `.custom-button`
component (defined in `src/app/(frontend)/globals.css`). Do not write one-off button styles.

Use this exact markup — the three-ring `.custom-button-icon` SVG plus a `<span>` label:

```tsx
{/* As a link */}
<a href="/contact" className="custom-button">
  <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="ring ring--outer" cx="12" cy="12" r="11" />
    <circle className="ring ring--middle" cx="12" cy="12" r="7" />
    <circle className="ring ring--inner" cx="12" cy="12" r="3" />
  </svg>
  <span>LET&rsquo;S WORK TOGETHER</span>
</a>

{/* As a real button (e.g. form submit) */}
<button className="custom-button" type="submit">
  <svg className="custom-button-icon" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="ring ring--outer" cx="12" cy="12" r="11" />
    <circle className="ring ring--middle" cx="12" cy="12" r="7" />
    <circle className="ring ring--inner" cx="12" cy="12" r="3" />
  </svg>
  <span>SUBMIT</span>
</button>
```

Notes:
- `.custom-button` owns all appearance (red fill, hover wipe-to-white, ring animation).
  Any extra class on the element should only add layout concerns (margin/spacing) or
  state (e.g. `:disabled` opacity) — never re-style the fill, padding, font, or icon.
- Label text goes in the `<span>`; keep it uppercase.
- It works on both `<a>` and `<button>` (has `appearance: none` + `border: unset`).

## Tooling

- **Node 22 is required** for the Payload CLI / `tsx` (Node 24 breaks module resolution).
  Use `nvm use 22` before running `npm run generate:types`, `npm run seed`, builds, etc.
- `package.json` has `"type": "module"` — required for Payload's CLI import resolution.

## CMS

- Content is served from Payload at request time (`src/app/(frontend)/page.tsx`).
  Components accept optional props and fall back to hardcoded `DEFAULT_*` constants, so the
  site never breaks with an empty/unavailable CMS. Preserve that fallback pattern.
- Re-seed with `npm run seed` (idempotent — media matched by filename, page/footer/form upserted).
- The contact form uses the Form Builder plugin (`forms` + `form-submissions` collections).
  Email notifications are intentionally off until SMTP details exist.
