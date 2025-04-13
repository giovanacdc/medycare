"use client"

import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import CustomForm from "../ui/CustomForm"
import SubmitButton from "../ui/SubmitButton";
import { getAppointmentSchema } from '@/lib/validation';
import { createUser } from '@/lib/actions/patient.actions';
import { FormFieldType } from './PatientForm';
import { Doctors } from '@/constants';
import { SelectItem } from '../ui/select';
import { createAppointment, updateAppointment } from '@/lib/actions/appointment.actions';
import { get } from 'http';
import { Appointment } from '@/types/appwrite.types';

export const AppointmentForm = ({ userId, patientId, type = "criar", appointment, setOpen }:
    {
        userId: string
        patientId: string
        type: "criar" | "cancelar" | "agendar"
        appointment?: Appointment
        setOpen?: Dispatch<SetStateAction<boolean>>
    }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const AppointmentFormValidation = getAppointmentSchema(type)

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment.primaryPhysician : '',
            schedule: appointment ? new Date(appointment?.schedule!) : new Date(Date.now()),
            reason: appointment ? appointment.reason : '',
            note: appointment?.note || '',
            cancellationReason: appointment?.cancellationReason || '',
        },
    })

    const onSubmit = async (values: z.infer<typeof AppointmentFormValidation>) => {
        setIsLoading(true)

        let status
        switch (type) {
            case 'agendar':
                status = 'agendado'
                break
            case 'cancelar':
                status = 'cancelado'
                break
            default:
                status = 'aguardando'
                break;
        }

        try {
            if (type === 'criar' && patientId) {
                const appointment = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    reason: values.reason!,
                    schedule: new Date(values.schedule),
                    status: status as Status,
                    note: values.note,
                }

                const newAppointment = await createAppointment(appointment)

                if (newAppointment) {
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`)
                }

            } else {
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                    },
                    type,
                }

                const updatedAppointment = await updateAppointment(appointmentToUpdate);

                if (updatedAppointment) {
                    setOpen && setOpen(false);
                    form.reset();
                }

            }
        } catch (error) {
            console.log(error)
        }

        setIsLoading(false)
    }

    let buttonLabel;

    switch (type) {
        case 'cancelar':
            buttonLabel = 'Cancelar consulta';
            break;
        case 'agendar':
            buttonLabel = 'Agendar consulta';
            break;
        default:
            buttonLabel = 'Criar consulta';
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                {type === 'criar' && <section className="mb-12 space-y-4">
                    <h1 className="header text-dark-700">Nova Consulta</h1>
                    <p className="text-dark-600">Agende uma nova consulta</p>
                </section>}

                {type !== "cancelar" && (
                    <>
                        <CustomForm
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name="primaryPhysician"
                            label="Médico"
                            placeholder="Selecione um médico"
                        >
                            {Doctors.map((doctor, i) => (
                                <SelectItem key={doctor.name + i} value={doctor.name}>
                                    <div className="flex cursor-pointer items-center gap-2">
                                        <Image
                                            src={doctor.image}
                                            width={32}
                                            height={32}
                                            alt="doctor"
                                            className="rounded-full border border-dark-100"
                                        />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomForm>

                        <CustomForm
                            fieldType={FormFieldType.DATE_PICKER}
                            control={form.control}
                            name="schedule"
                            label="Data Prevista do Atendimento"
                            showTimeSelect
                            dateFormat="dd/MM/yyyy - HH:mm aa"
                        />

                        <div className={`flex flex-col gap-6 ${type === "criar" && "xl:flex-row"}`}>
                            <CustomForm
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Motivo da consulta"
                                placeholder="Descreva o motivo da consulta"
                                disabled={type === "agendar"}
                            />

                            <CustomForm
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Observações"
                                placeholder="Descreva as observações"
                                disabled={type === "agendar"}
                            />
                        </div>

                    </>
                )}

                {type === "cancelar" && (
                    <CustomForm
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Motivo do cancelamento"
                        placeholder="Descreva o motivo do cancelamento"
                    />
                )}



                <SubmitButton isLoading={isLoading} className={`${type === 'cancelar' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>

            </form>
        </Form >
    )
}