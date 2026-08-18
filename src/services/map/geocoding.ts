interface GeocodedLocation {
    address: string
    department: string
    province: string
    district: string
}

const apiKey = import.meta.env.VITE_GEOAPIFY

export async function reverseGeocode(
    latitude: number,
    longitude: number
): Promise<GeocodedLocation> {
    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&lang=es&apiKey=${apiKey}`
    )

    if (!response.ok) {
        throw new Error('No se pudo obtener la dirección')
    }

    const data = await response.json()

    const properties = data.features?.[0].properties

    console.log(data)

    const address = [
        properties.street,
        properties.housenumber,
    ]
        .filter(Boolean)
        .join(' ')

    const department = properties.state ?? ''
    const province = properties.region ?? properties.county ?? ''
    const district = properties.city ?? ''

    return {
        address,
        department,
        province,
        district,
    }
}