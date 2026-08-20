import { useState } from 'react'
import LocationStep from './LocationStep'
import DetailsStep from './DetailsStep'
import type { LocationData } from '../../types/location'
import type { CoverageFormData } from '../../types/coverage'
import '../../styles/coverage.css'
import { sendCoverageData } from '../../services/whatsapp/whatsapp'



function CoverageForm() {
    const [step, setStep] = useState(1)
    const [location, setLocation] = useState<LocationData | null>(null)
    //const [formData, setFormData] = useState<CoverageFormData | null>(null)

    const handleLocationConfirm = (locationData: LocationData) => {
        setLocation(locationData)
        setStep(2)
    }

    const handleFormSubmit = async (data: CoverageFormData) => {
        try {
            await sendCoverageData(data)

            console.log('Información enviada correctamente')
        } catch (error) {
            console.error('Error al enviar la información:', error)
        }
    }

    return (
        <main className="coverage-page">

            <div className="coverage-container">

                <div className="steps">

                    <div className={`step ${step === 1 ? 'active' : ''}`}>
                        <div className="step-circle">
                            1
                        </div>

                        <span className="step-label">
                            Ubicación
                        </span>
                    </div>

                    <div className="step-line"></div>

                    <div className={`step ${step === 2 ? 'active' : ''}`}>
                        <div className="step-circle">
                            2
                        </div>

                        <span className="step-label">
                            Datos
                        </span>
                    </div>

                </div>

                {step === 1 && (
                    <LocationStep onConfirm={handleLocationConfirm} />
                )}

                {step === 2 && location && (
                    <DetailsStep
                        location={location}
                        onSubmit={handleFormSubmit}
                    />
                )}

            </div>

        </main>
    )
}

export default CoverageForm