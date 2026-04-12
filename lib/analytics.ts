type EventProperties = Record<string, string | number | boolean>

const handlers: Array<(eventName: string, properties?: EventProperties) => void> = []

export function trackEvent(eventName: string, properties?: EventProperties) {
  handlers.forEach((handler) => handler(eventName, properties))
}

export function registerHandler(handler: (eventName: string, properties?: EventProperties) => void) {
  handlers.push(handler)
}
