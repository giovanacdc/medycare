import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";

const RequestSuccess = async ({searchParams, params: { userId },}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || ""
  const appointment = await getAppointment(appointmentId)

  const doctor = Doctors.find(
    (doctor) => doctor.name === appointment.primaryPhysician
  );

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <h1>MedyCare</h1>
 
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/success.gif"
            height={280}
            width={200}
            alt="success"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            O seu <span className="text-purple-600">agendamento</span> foi enviado!
          </h2>
          <p className="text-dark-600">Confirmaremos seu agendamento em breve.</p>
        </section>

        <section className="request-details">
          <p>Detalhes do agendamento: </p>
          <div className="flex items-center gap-3">
            <Image
              src={doctor?.image!}
              alt="doctor"
              width={100}
              height={100}
              className="size-6"
            />
            <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
          </div>
          <div className="flex gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt="calendário"
            />
            <p> {formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        <Button variant="outline" className="shad-primary-btn py-6 w-full max-w-[700px]" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            Novo Agendamento
          </Link>
        </Button>

        <p className="copyright">©2025 MedyCare</p>
        <a className="text-dark-100" href="https://lordicon.com/">Icons by Lordicon.com</a>
      </div>
    </div>
  );
};

export default RequestSuccess;