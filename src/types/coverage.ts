import type { LocationData } from './location'

export interface CoverageFormData {
    telefono: string
    location: LocationData
    department: string
    province: string
    district: string
    ubigeo: string
    housingType: string
    streetType: string
    streetName: string
    hasNumber: boolean
    addressNumber: string
    floor: string
    apartment: string
    interior: string
    reference: string
}