export async function getCoordinates(address: string): Promise<{ lat: number; lng: number } | null> {
  try {
    // Using Nominatim (OpenStreetMap) geocoding service
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
    )

    if (!response.ok) {
      throw new Error("Geocoding request failed")
    }

    const data = await response.json()

    if (data && data.length > 0) {
      return {
        lat: Number.parseFloat(data[0].lat),
        lng: Number.parseFloat(data[0].lon),
      }
    }

    return null
  } catch (error) {
    console.error("[v0] Geocoding error:", error)
    return null
  }
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)

    if (!response.ok) {
      throw new Error("Reverse geocoding request failed")
    }

    const data = await response.json()

    if (data && data.display_name) {
      return data.display_name
    }

    return null
  } catch (error) {
    console.error("[v0] Reverse geocoding error:", error)
    return null
  }
}
