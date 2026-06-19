type LenisHandle = {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: { immediate?: boolean; force?: boolean; offset?: number; duration?: number },
  ) => void
  stop: () => void
  start: () => void
}

export const scrollState: { velocity: number; lenis: LenisHandle | null } = {
  velocity: 0,
  lenis: null,
}
