import { useState } from 'react'
import LocationStep from './LocationStep'
import DetailsStep from './DetailsStep'
import type { LocationData } from '../../types/location'


function CoverageForm() {
    const [step, setStep] = useState(1)
    const [location, setLocation] = useState<LocationData | null>(null)

    const handleLocationConfirm = (locationData: LocationData) => {
        setLocation(locationData)
        setStep(2)
    }

    return (
        <main>
            {step === 1 && (
                <LocationStep onConfirm={handleLocationConfirm} />
            )}

            {step === 2 && location && (
                <DetailsStep location={location} />
            )}
        </main>
    )
}

export default CoverageForm