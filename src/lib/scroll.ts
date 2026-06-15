type LenisHandle = {
  scrollTo: (target: number, options?: { immediate?: boolean; force?: boolean }) => void
  stop: () => void
  start: () => void
}

export const scrollState: { velocity: number; lenis: LenisHandle | null } = {
  velocity: 0,
  lenis: null,
}
