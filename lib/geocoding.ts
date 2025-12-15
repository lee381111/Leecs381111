interface Coordinates {
  lat: number
  lon: number
}

const cityCoordinates: Record<string, Coordinates> = {
  서울: { lat: 37.5665, lon: 126.978 },
  제주: { lat: 33.4996, lon: 126.5312 },
  부산: { lat: 35.1796, lon: 129.0756 },
  인천: { lat: 37.4563, lon: 126.7052 },
  대구: { lat: 35.8714, lon: 128.6014 },
  대전: { lat: 36.3504, lon: 127.3845 },
  광주: { lat: 35.1595, lon: 126.8526 },
  울산: { lat: 35.5384, lon: 129.3114 },
  세종: { lat: 36.4875, lon: 127.2817 },
  // International cities
  파리: { lat: 48.8566, lon: 2.3522 },
  뉴욕: { lat: 40.7128, lon: -74.006 },
  런던: { lat: 51.5074, lon: -0.1278 },
  도쿄: { lat: 35.6762, lon: 139.6503 },
  베이징: { lat: 39.9042, lon: 116.4074 },
  상하이: { lat: 31.2304, lon: 121.4737 },
}

export function getCoordinates(location: string): Coordinates | null {
  // Exact match
  if (cityCoordinates[location]) {
    return cityCoordinates[location]
  }

  // Partial match
  for (const [city, coords] of Object.entries(cityCoordinates)) {
    if (location.includes(city) || city.includes(location)) {
      return coords
    }
  }

  // Default to Seoul
  return { lat: 37.5665, lon: 126.978 }
}
