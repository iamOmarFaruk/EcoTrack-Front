export function fakeDelay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}


