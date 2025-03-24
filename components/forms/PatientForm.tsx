"use client"
 
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import CustomForm from "../ui/CustomForm"
import SubmitButton from "../ui/SubmitButton";
import { UserFormValidation } from '@/lib/validation';
import { createUser } from '@/lib/actions/patient.actions';


export enum FormFieldType {
    INPUT = 'input',
    PHONE_INPUT = "PHONE_INPUT",
    CHECKBOX = "CHECKBOX",
    DATE_PICKER = "DATE_PICKER",
    SELECT = "SELECT",
    SKELETON = "SKELETON",
    TEXTAREA = "TEXTAREA"

}
 
export const PatientForm = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  })
 
async function onSubmit({name, email, phone}: z.infer<typeof UserFormValidation>) {
    setIsLoading(true)

    try {
      const userData = {name, email, phone}
      const user = await createUser(userData)

      if(user) router.push(`/patients/${user.$id}/register`)
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
            <h1 className="header text-dark-700">Login</h1>
            <p className="text-dark-600">Faça seu login e agende sua consulta</p>
        </section>

        <CustomForm
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Nome completo"
            placeholder="Bruno Silva"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <CustomForm
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="E-mail"
            placeholder="brunosilva@exemplo.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
        />

        <CustomForm
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Celular"
            placeholder="(xx)xxxxx-xxxx"
        />

        <SubmitButton isLoading={isLoading}>Entre</SubmitButton>
        
      </form>
    </Form>
  )
}

export default PatientForm