"use client"

import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
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
import { createAppointment } from '@/lib/actions/appointment.actions';
import { get } from 'http';

export const AppointmentForm = ({ userId, patientId, type }:
    {
        userId: string
        patientId: string
        type: "create" | "cancel" | "schedule"
    }) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const AppointmentFormValidation = getAppointmentSchema(type)

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: "",
            schedule: new Date(),
            reason: "",
            note: "",
            cancellationReason: "",
        },
    })

    async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
        setIsLoading(true)

        let status
        switch (type) {
            case 'schedule':
                status = 'agendado'
                break
            case 'cancel':
                status = 'cancelado'
                break
            default:
                status = 'aguardando'
                break;
        }

        try {
            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    reason: values.reason!,
                    schedule: new Date(values.schedule),
                    status: status as Status,
                    note: values.note,
                }

                const appointment = await createAppointment(appointmentData)

                if (appointment) {
                    form.reset()
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }

            }
        } catch (error) {
            console.log(error)
        }

        setIsLoading(false)
    }

    let buttonLabel;

    switch (type) {
        case 'cancel':
            buttonLabel = 'Cancelar agendamento';
            break;
        case 'create':
            buttonLabel = 'Criar agendamento';
            break;
        case 'schedule':
            buttonLabel = 'Agendar consulta';
            break;
        default:
            break;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header text-dark-700">Novo agendamento</h1>
                    <p className="text-dark-600">Faça um novo agendamento</p>
                </section>

                {type !== "cancel" && (
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

                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomForm
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="reason"
                                label="Motivo da consulta"
                                placeholder="Descreva o motivo da consulta"
                            />

                            <CustomForm
                                fieldType={FormFieldType.TEXTAREA}
                                control={form.control}
                                name="note"
                                label="Observações"
                                placeholder="Descreva as observações"
                            />
                        </div>

                    </>
                )}

                {type === "cancel" && (
                    <CustomForm
                        fieldType={FormFieldType.TEXTAREA}
                        control={form.control}
                        name="cancellationReason"
                        label="Motivo do cancelamento"
                        placeholder="Descreva o motivo do cancelamento"
                    />
                )}



                <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>

            </form>
        </Form >
    )
}

export default AppointmentForm