"use client"
 
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod"
import {Form, FormControl} from "@/components/ui/form"
import {Label  } from "@/components/ui/label";
import CustomForm from "../ui/CustomForm"
import SubmitButton from "../ui/SubmitButton";
import { UserFormValidation } from '@/lib/validation';
import { createUser } from '@/lib/actions/patient.actions';
import { FormFieldType } from './PatientForm';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SelectItem } from "@/components/ui/select";
import {GenderOptions} from "@/constants"
import "react-datepicker/dist/react-datepicker.css";
import "react-phone-number-input/style.css";

const RegisterForm = ({user}: {user:User}) => {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header text-dark-700">Bem vindo!</h1>
            <p className="text-dark-600">Preencha suas informações:</p>
        </section>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Informações Pessoais</h2>
            </div>          
        </section>

        <CustomForm
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="name"
            label="Nome Completo"
            placeholder="Bruno Silva"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
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
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomForm
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                label="Data de Nascimento"
            />
            
            <CustomForm
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                label="Gênero"
                renderSkeleton={(field) => (
                    <FormControl>
                      <RadioGroup className="flex h-11 gap-6 xl:justify-between" onValueChange={field.onChange}defaultValue={field.value}>
                    {GenderOptions.map((option, i) => (
                        <div key={option + i} className="radio-group">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option} className="cursor-pointer">
                              {option}
                            </Label>
                        </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                )}
            />
        </div>
        <div className="flex flex-col gap--6 xl:flex-row">
            <CustomForm
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="address"
                    label="Endereço"
                    placeholder="Avenida Getulio Vargas 713, Joinville"
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
        </div>
        <div className="flex flex-col gap--6 xl:flex-row">

        </div>
        <div className="flex flex-col gap--6 xl:flex-row">

        </div>
        <div className="flex flex-col gap--6 xl:flex-row">

        </div>
        <div className="flex flex-col gap--6 xl:flex-row">

        </div>
        <SubmitButton isLoading={isLoading}>Entre</SubmitButton>
        
      </form>
    </Form>
  )
}

export default RegisterForm