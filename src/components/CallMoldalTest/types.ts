import { z } from 'zod';
import { isValidPhoneNumber } from 'libphonenumber-js';

// Esquema base sin traducciones
export const testCallFormSchema = z.object({
  contact_name: z.string().min(1, 'Por favor escriba el nombre del contacto.'),
  phone_number: z
    .string()
    .min(1, 'El número es requerido')
    .refine(
      (value) => isValidPhoneNumber(value),
      'El número de teléfono no es válido'
    ),
});

export type TestCallFormValues = z.infer<typeof testCallFormSchema>;
