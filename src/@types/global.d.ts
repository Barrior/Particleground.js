interface Window {
  mozRequestAnimationFrame?: (...fn: unknown[]) => void
  JParticles: { [effectName: string]: unknown }
}
