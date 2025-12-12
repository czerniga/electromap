export function mapsDeepLink(lat, lng) {
  const ua = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(ua)
  const isAndroid = /android/.test(ua)
  if (isIOS) return `maps://?q=${lat},${lng}`
  if (isAndroid) return `geo:${lat},${lng}?q=${lat},${lng}`
  return `https://www.google.com/maps?q=${lat},${lng}`
}
