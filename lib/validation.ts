import { z } from "zod"

export const UserFormValidation = z.object({
    name: z.string()
        .min(2, "O nome precisa ter pelo menos 2 caracteres.")
        .max(50, "O nome precisa no máximo 50 caracteres."),
    email: z.string().email("E-mail inválido."), 
    phone: z.string().refine((phone) => /^\+?[1-9]\d{1,14}$/.test(phone), 'Número de telefone inválido')
})