"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

import { Doctors } from "@/constants"
import { formatDateTime } from "@/lib/utils"
import { Appointment } from "@/types/appwrite.types"

import { AppointmentModal } from "../AppointmentModal"
import { StatusBadge } from "../ui/StatusBadge"

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>
    },
  },
  {
    accessorKey: "patient",
    header: "Paciente",
    cell: ({ row }) => {
      const appointment = row.original
      return <p className="text-14-medium ">{appointment.patient.name}</p>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      )
    },
  },
  {
    accessorKey: "schedule",
    header: "Consultas",
    cell: ({ row }) => {
      const appointment = row.original
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      )
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Médico",
    cell: ({ row }) => {
      const appointment = row.original

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      )

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Ações</div>,
    cell: ({ row }) => {
      const appointment = row.original

      return (
        <div className="flex gap-1">
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="agendar"
            title="Agendar consulta"
            description="Por favor, preencha os campos abaixo para agendar uma consulta."
          />
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancelar"
            title="Cancelar consulta"
            description="Você tem certeza que deseja cancelar a consulta?"
          />
        </div>
      )
    },
  },
]