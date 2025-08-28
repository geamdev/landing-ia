'use client';

import type { UseFormReturn } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import PhoneInput from 'react-phone-number-input';
import './phone-input.css';
import { useCampaignsTranslations } from '@/hooks/i18n/use-campaigns-translations';
import type { TestCallFormValues } from './types';
import { User } from 'lucide-react';

interface TestCallFormProps {
  form: UseFormReturn<TestCallFormValues>;
}

export function TestCallForm({ form }: TestCallFormProps) {
  const { t } = useCampaignsTranslations();

  return (
    <Form {...form}>
      <form className='space-y-6'>
        {/* Nombre del contacto */}
        <FormField
          control={form.control}
          name='contact_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='font-medium text-white flex items-center gap-2 mb-3'>
                <div className='flex h-6 w-6 items-center justify-center rounded-md bg-blue-500/20'>
                  <User className='h-3 w-3 text-blue-400' />
                </div>
                {t('modals.testCall.form.contactName')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <Input
                    type='text'
                    placeholder={t(
                      'modals.testCall.form.contactNamePlaceholder'
                    )}
                    className='pl-10 bg-gray-700/50 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200'
                    {...field}
                  />
                  <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
                </div>
              </FormControl>
              <FormMessage className='text-red-400' />
            </FormItem>
          )}
        />

        {/* Número telefónico */}
        <FormField
          control={form.control}
          name='phone_number'
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel className='font-medium text-white flex items-center gap-2 mb-3'>
                {t('modals.testCall.form.phoneNumber')}
              </FormLabel>
              <FormControl>
                <div className='relative'>
                  <PhoneInput
                    placeholder={t(
                      'modals.testCall.form.phoneNumberPlaceholder'
                    )}
                    className='w-full text-sm'
                    defaultCountry='EC'
                    international
                    withCountryCallingCode
                    value={value}
                    onChange={(phone) => onChange(phone || '')}
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className='text-red-400' />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
