import { useEffect, useState } from 'react'
import type { LocationData } from '../../types/location'
import { getUbigeos } from '../../services/ubigeo/ubigeo'
import type { UbigeoData } from '../../types/ubigeo'
import { normalizeText, normalizeProvince } from '../../utils/normalizeText'
import type { CoverageFormData } from '../../types/coverage'


interface DetailsStepProps {
    location: LocationData
    onSubmit: (formData: CoverageFormData) => void
}

function DetailsStep({ location, onSubmit }: DetailsStepProps) {

    const [ubigeos, setUbigeos] = useState<UbigeoData | null>(null)
    const [department, setDepartment] = useState('')
    const [province, setProvince] = useState('')
    const [district, setDistrict] = useState('')
    const [ubigeo, setUbigeo] = useState('')
    const [housingType, setHousingType] = useState('')
    const [streetType, setStreetType] = useState('')
    const [streetName, setStreetName] = useState('')
    const [hasNumber, setHasNumber] = useState(false)
    const [addressNumber, setAddressNumber] = useState('')
    const [floor, setFloor] = useState('')
    const [apartment, setApartment] = useState('')
    const [interior, setInterior] = useState('')
    const [reference, setReference] = useState('')
    const [telefono, setTelefono] = useState('')

    const [errors, setErrors] = useState({
        department: '',
        province: '',
        district: '',
        housingType: '',
        streetType: '',
        streetName: '',
        addressNumber: '',
    })

    
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

    useEffect(() => {
        setStreetName(location.streetName ?? '')
    }, [location.streetName])


    const departments = ubigeos ? Object.keys(ubigeos) : []
    const provinces = ubigeos && department ? Object.keys(ubigeos[department] ?? {}) : []
    const districts = ubigeos && department && province ? Object.keys(ubigeos[department]?.[province] ?? {}) : []

    const housingTypes = [
        'Casa',
        'Edificio',
        'Condominio',
        'Multifamiliar',
    ]

    const streetTypes = [
        'Avenida',
        'Calle',
        'Jirón',
        'Pasaje',
        'Prolongación',
        'Urbanización',
    ]

    const handleSubmit = () => {
        const newErrors = {
            department: '',
            province: '',
            district: '',
            housingType: '',
            streetType: '',
            streetName: '',
            addressNumber: '',
            telefono: '',
        }

        if (!department) {
            newErrors.department = 'Selecciona un departamento'
        }

        if (!province) {
            newErrors.province = 'Selecciona una provincia'
        }

        if (!district) {
            newErrors.district = 'Selecciona un distrito'
        }

        if (!housingType) {
            newErrors.housingType = 'Selecciona un tipo de vivienda'
        }

        if (!streetType) {
            newErrors.streetType = 'Selecciona un tipo de calle'
        }

        if (!streetName.trim()) {
            newErrors.streetName = 'Ingresa el nombre de la calle'
        }

        if (hasNumber && !addressNumber.trim()) {
            newErrors.addressNumber = 'Ingresa el número de tu dirección'
        }

        if (!telefono.trim()) {
            newErrors.telefono = 'Ingresa tu número de teléfono'
        }

        setErrors(newErrors)

        if (
            newErrors.department ||
            newErrors.province ||
            newErrors.district ||
            newErrors.housingType ||
            newErrors.streetType ||
            newErrors.streetName ||
            newErrors.addressNumber ||
            newErrors.telefono
        ) {
            return
        }

        const formData: CoverageFormData = {
            telefono,
            location,
            department,
            province,
            district,
            ubigeo,
            housingType,
            streetType,
            streetName,
            hasNumber,
            addressNumber,
            floor,
            apartment,
            interior,
            reference,
        }

        onSubmit(formData)
    }

    return (
        <section className="coverage-step">

            <h2 className="coverage-title">
                Completa los datos de tu dirección
            </h2>

            <div className="location-summary">

                <p className="location-summary-title">
                    📍 Dirección seleccionada
                </p>

                <p>
                    <strong>Dirección:</strong> {location.address}
                </p>

                <p>
                    <strong>Departamento:</strong> {location.department}
                </p>

                <p>
                    <strong>Provincia:</strong> {normalizeText(location.province)}
                </p>

                <p>
                    <strong>Distrito:</strong> {location.district}
                </p>

            </div>

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="department"
                >
                    Departamento <span className="required">*</span>
                </label>

                <select
                    className="form-select"
                    id="department"
                    value={department}
                    onChange={(event) => {
                        setDepartment(event.target.value)
                        setProvince('')
                        setDistrict('')

                        setErrors((currentErrors) => ({
                            ...currentErrors,
                            department: '',
                            province: '',
                            district: '',
                        }))
                    }}
                >
                    <option value="">
                        Selecciona un departamento
                    </option>

                    {departments.map((departmentName) => (
                        <option
                            key={departmentName}
                            value={departmentName}
                        >
                            {departmentName}
                        </option>
                    ))}
                </select>

                {errors.department && (
                    <p className="form-error">
                        {errors.department}
                    </p>
                )}

            </div>

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="province"
                >
                    Provincia <span className="required">*</span>
                </label>

                <select
                    className="form-select"
                    id="province"
                    value={province}
                    onChange={(event) => {
                        setProvince(event.target.value)
                        setDistrict('')

                        setErrors((currentErrors) => ({
                            ...currentErrors,
                            province: '',
                            district: '',
                        }))
                    }}
                >
                    <option value="">
                        Selecciona una provincia
                    </option>

                    {provinces.map((provinceName) => (
                        <option
                            key={provinceName}
                            value={provinceName}
                        >
                            {provinceName}
                        </option>
                    ))}
                </select>

                {errors.province && (
                    <p className="form-error">
                        {errors.province}
                    </p>
                )}

            </div>

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="district"
                >
                    Distrito <span className="required">*</span>
                </label>

                <select
                    className="form-select"
                    id="district"
                    value={district}
                    onChange={(event) => {
                        setDistrict(event.target.value)

                        setErrors((currentErrors) => ({
                            ...currentErrors,
                            district: '',
                        }))
                    }}
                >
                    <option value="">
                        Selecciona un distrito
                    </option>

                    {districts.map((districtName) => (
                        <option
                            key={districtName}
                            value={districtName}
                        >
                            {districtName}
                        </option>
                    ))}
                </select>

                {errors.district && (
                    <p className="form-error">
                        {errors.district}
                    </p>
                )}

            </div>

            {ubigeo && (
                <p className="ubigeo">
                    Ubigeo: {ubigeo}
                </p>
            )}

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="housingType"
                >
                    Tipo de vivienda <span className="required">*</span>
                </label>

                <select
                    className="form-select"
                    id="housingType"
                    value={housingType}
                    onChange={(event) => {
                        setHousingType(event.target.value)

                        setErrors((currentErrors) => ({
                            ...currentErrors,
                            housingType: '',
                        }))
                    }}
                >
                    <option value="">
                        Selecciona un tipo de vivienda
                    </option>

                    {housingTypes.map((housingType) => (
                        <option
                            key={housingType}
                            value={housingType}
                        >
                            {housingType}
                        </option>
                    ))}
                </select>

                {errors.housingType && (
                    <p className="form-error">
                        {errors.housingType}
                    </p>
                )}

            </div>

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="streetType"
                >
                    Tipo de vía <span className="required">*</span>
                </label>

                <select
                    className="form-select"
                    id="streetType"
                    value={streetType}
                    onChange={(event) => {
                        setStreetType(event.target.value)

                        setErrors((currentErrors) => ({
                            ...currentErrors,
                            streetType: '',
                        }))
                    }}
                >
                    <option value="">
                        Selecciona un tipo de vía
                    </option>

                    {streetTypes.map((streetType) => (
                        <option
                            key={streetType}
                            value={streetType}
                        >
                            {streetType}
                        </option>
                    ))}
                </select>

                {errors.streetType && (
                    <p className="form-error">
                        {errors.streetType}
                    </p>
                )}

            </div>

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="streetName"
                >
                    Nombre de la vía <span className="required">*</span>
                </label>

                <input
                    className="form-input"
                    type="text"
                    id="streetName"
                    value={streetName}
                    
                    onChange={(event) => {
                        setStreetName(event.target.value)

                        setErrors((currentErrors) => ({
                            ...currentErrors,
                            streetName: '',
                        }))
                    }}
                    placeholder="Ingresa el nombre de la calle"
                />

                {errors.streetName && (
                    <p className="form-error">
                        {errors.streetName}
                    </p>
                )}

            </div>

            <div className="checkbox-field">

                <input
                    type="checkbox"
                    id="hasNumber"
                    checked={hasNumber}
                    onChange={(event) => {
                        const checked = event.target.checked

                        setHasNumber(checked)

                        if (!checked) {
                            setAddressNumber('')

                            setErrors((currentErrors) => ({
                                ...currentErrors,
                                addressNumber: '',
                            }))
                        }
                    }}
                />

                <label htmlFor="hasNumber">
                    Mi dirección tiene número
                </label>

            </div>

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="addressNumber"
                >
                    Número
                </label>

                <input
                    className="form-input"
                    id="addressNumber"
                    type="text"
                    value={addressNumber}
                    onChange={(event) => {
                        const value = event.target.value

                        setAddressNumber(value)

                        if (value.trim()) {
                            setErrors((currentErrors) => ({
                                ...currentErrors,
                                addressNumber: '',
                            }))
                        }
                    }}
                    placeholder="Ingresa el número"
                    disabled={!hasNumber}
                />

                {errors.addressNumber && (
                    <p className="form-error">
                        {errors.addressNumber}
                    </p>
                )}

            </div>

            <div className="form-row">

                <div className="form-field">

                    <label
                        className="form-label"
                        htmlFor="floor"
                    >
                        Piso
                    </label>

                    <input
                        className="form-input"
                        id="floor"
                        type="text"
                        value={floor}
                        onChange={(event) => setFloor(event.target.value)}
                        placeholder="Ej. 2"
                    />

                </div>


                <div className="form-field">

                    <label
                        className="form-label"
                        htmlFor="apartment"
                    >
                        Departamento
                    </label>

                    <input
                        className="form-input"
                        id="apartment"
                        type="text"
                        value={apartment}
                        onChange={(event) => setApartment(event.target.value)}
                        placeholder="Ej. 201"
                    />

                </div>

            </div>

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="interior"
                >
                    Interior
                </label>

                <input
                    className="form-input"
                    id="interior"
                    type="text"
                    value={interior}
                    onChange={(event) => setInterior(event.target.value)}
                    placeholder="Ingresa el interior"
                />

            </div>

            <div className="form-field">

                <label
                    className="form-label"
                    htmlFor="reference"
                >
                    Referencia
                </label>

                <input
                    className="form-input"
                    type="text"
                    id="reference"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Ej. Frente al parque"
                />

            </div>

            <div className="form-field">

                <label className="form-label">
                    Número de teléfono
                    <input
                        className="form-input"
                        type="tel"
                        value={telefono}
                        onChange={(event) => {
                            const value = event.target.value
                            setTelefono(value)

                            if (value.trim()) {
                                setErrors((currentErrors) => ({
                                    ...currentErrors,
                                    telefono: '',
                                }))
                            }
                        }}
                    />
                </label>
            </div>

            <div className="form-field">

                <button
                    className="form-button"
                    type="button"
                    onClick={handleSubmit}
                >
                    Validar cobertura
                </button>

            </div>

        </section >
    )
}

export default DetailsStep