import Image from "next/image";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/patient.actions"

const Appointment = async ({ params: { userId }}: SearchParamProps) => {
  const patient = await getPatient(userId)  
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <h1>MedyCare</h1>

          <AppointmentForm 
            type="create"
            userId={userId}
            patientId={patient.$id}
          />

        <p className="copyright mt-10 py-12 ">
             © 2025 MedyCare
        </p>
          
        </div>
      </section>
    </div>
  )
}

export default Appointment