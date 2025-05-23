'use server'

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from "next/cache";

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        );

        return parseStringify(newAppointment)
    } catch (error) {
        console.log(error)
    }
}

export const getAppointment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId
        )

        return parseStringify(appointment);
    } catch (error) {
        console.error("Ocorreu um erro ao recuperar o paciente existente.", error);
    }
}

export const getRecentAppointmentsList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')],

        )

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        }

        const counts = (appointments.documents as Appointment[]).reduce(
            (acc, appointment) => {
                switch (appointment.status) {
                    case "agendado":
                        acc.scheduledCount++
                        break
                    case "aguardando":
                        acc.pendingCount++
                        break
                    case "cancelado":
                        acc.cancelledCount++
                        break
                }
                return acc;
            },
            initialCounts
        )

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents,
          };
      
          return parseStringify(data)
    } catch (error) {
        console.error("Ocorreu um erro ao recuperar os agendamentos recentes.", error);
    }
}

export const updateAppointment = async ({ appointmentId, userId, appointment, type}: UpdateAppointmentParams) => {
    try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if(!updatedAppointment) {   
            throw new Error("Agendamento não encontrado.")
        }

        revalidatePath('/admin')
        return parseStringify(updatedAppointment)
    } catch (error) {
        console.error("Ocorreu um erro ao atualizar o agendamento.", error);
    }
}
