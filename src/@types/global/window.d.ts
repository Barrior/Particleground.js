interface Window {
  mozRequestAnimationFrame?: AnimationFrameProvider['requestAnimationFrame']
  WebKitMutationObserver?: MutationObserver
  JParticles: { [key: string]: any }
}
