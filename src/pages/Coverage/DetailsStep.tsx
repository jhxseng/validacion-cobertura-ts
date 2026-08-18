import { useEffect, useState } from 'react'
import type { LocationData } from '../../types/location'
import { getUbigeos } from '../../services/ubigeo/ubigeo'
import type { UbigeoData } from '../../types/ubigeo'
import { normalizeText, normalizeProvince } from '../../utils/normalizeText'

interface DetailsStepProps {
    location: LocationData
}

function DetailsStep({ location }: DetailsStepProps) {

    const [ubigeos, setUbigeos] = useState<UbigeoData | null>(null)
    const [department, setDepartment] = useState('')
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ubigeo, setUbigeo] = useState('')

    useEffect(() => {
        getUbigeos()
            .then((data) => {
                setUbigeos(data)
            })
            .catch((error) => {
                console.error('Error al obtener los ubigeos:', error)
            })
    }, [])

    useEffect(() => {
        if (!ubigeos || !location.department) return

        const departments = Object.keys(ubigeos)

        const matchingDepartment = departments.find(
            (departmentName) =>
                normalizeText(departmentName) ===
                normalizeText(location.department)
        )

        if (matchingDepartment) {
            setDepartment(matchingDepartment)
        }

    }, [ubigeos, location.department])

    useEffect(() => {
        if (!ubigeos || !department || !location.province) return

        const provinces = Object.keys(ubigeos[department] ?? {})

        const matchingProvince = provinces.find(
            (provinceName) =>
                normalizeText(provinceName) ===
                normalizeProvince(location.province)
        )

        if (matchingProvince) {
            setProvince(matchingProvince)
        }
    }, [ubigeos, department, location.province])

    useEffect(() => {
        if (!ubigeos || !department || !province || !location.district) return

        const districts = Object.keys(ubigeos[department]?.[province] ?? {})

        const matchingDistrict = districts.find(
            (districtName) => normalizeText(districtName) === normalizeText(location.district)
        )

        if (matchingDistrict) {
            setDistrict(matchingDistrict)
        }
    }, [ubigeos, department, province, location.district])

    useEffect(() => {
        if (!ubigeos || !department || !province || !district) {
            setUbigeo('')
            return
        }

        const districtData =
            ubigeos[department]?.[province]?.[district]

        setUbigeo(districtData?.ubigeo ?? '')

    }, [ubigeos, department, province, district])

    const departments = ubigeos ? Object.keys(ubigeos) : []
    const provinces = ubigeos && department ? Object.keys(ubigeos[department] ?? {}) : []
    const districts = ubigeos && department && province ? Object.keys(ubigeos[department]?.[province] ?? {}) : []

    return (
        <section>
            <h2>Completa los datos de tu dirección</h2>

            <p>Dirección: {location.address}</p>
            <p>Departamento: {location.department}</p>
            <p>Provincia: {normalizeText(location.province)}</p>
            <p>Distrito: {location.district}</p>

            <label htmlFor="department">Departamento</label>

            <select
                id="department"
                value={department}
                onChange={(event) => {
                    setDepartment(event.target.value)
                    setProvince('')
                }
                }
            >
                <option value="">Selecciona un departamento</option>

                {departments.map((departmentName) => (
                    <option key={departmentName} value={departmentName}>
                        {departmentName}
                    </option>
                ))}
            </select>

            <label htmlFor="province">Provincia</label>

            <select
                id="province"
                value={province}
                onChange={(event) => {
                    setProvince(event.target.value)
                    setDistrict('')
                }}
            >
                <option value="">Selecciona una provincia</option>

                {provinces.map((provinceName) => (
                    <option key={provinceName} value={provinceName}>
                        {provinceName}
                    </option>
                ))}

            </select>

            <label htmlFor="district">Distrito</label>

            <select
                id="district"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
            >
                <option value="">Selecciona un distrito</option>

                {districts.map((districtName) => (
                    <option key={districtName} value={districtName}>
                        {districtName}
                    </option>
                ))}

            </select>

            {ubigeo && (
                <p>Ubigeo: {ubigeo}</p>
            )}
        </section>
    )
}

export default DetailsStep