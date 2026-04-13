type EventProperties = Record<string, string | number | boolean>

// GA4 이벤트 전송
export function sendGAEvent(
  eventName: string,
  params?: EventProperties
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params)
  }
}

// 기존 trackEvent는 sendGAEvent로 위임
export function trackEvent(
  eventName: string,
  properties?: EventProperties
) {
  sendGAEvent(eventName, properties)
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}
