declare module 'canvas-confetti' {
  export type ConfettiOrigin = { x?: number; y?: number }
  export type ConfettiOptions = {
    particleCount?: number
    spread?: number
    origin?: ConfettiOrigin
    colors?: string[]
  }

  const confetti: (opts?: ConfettiOptions) => void
  export default confetti
}



