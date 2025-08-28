'use client';

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Phone, Sparkles } from 'lucide-react';

import { TestCallInteractiveArea } from './CallMoldalTest';

import { DIALER_HTTP_CLIENT } from '@/lib/http';

import { useCampaignsTranslations } from '@/hooks/i18n/use-campaigns-translations';
import { TestCallForm } from './CallMoldalTest';
import { testCallFormSchema } from './CallMoldalTest/types';

interface TestCallModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TestCallModal({ open, onOpenChange }: TestCallModalProps) {
  const { t } = useCampaignsTranslations();
  const [showDialog, setShowDialog] = useState(false);
  const [isCalling, setIsCalling] = useState(false);

  // Usar el estado controlado externamente si se proporciona
  const isOpen = open !== undefined ? open : showDialog;
  const setIsOpen = onOpenChange || setShowDialog;

  // fixed campaign id for test calls
  const CAMPAIGN_ID = 99;

  type TestCallFormValues = z.infer<typeof testCallFormSchema> & {
    campana_id?: number;
  };

  const formMethods = useForm<TestCallFormValues>({
    resolver: zodResolver(testCallFormSchema),
    mode: 'onChange',
    defaultValues: {
      contact_name: '',
      phone_number: '',
    },
  });

  // Resetear formulario cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      formMethods.reset();
      setIsCalling(false);
    }
  }, [isOpen, formMethods]);

  const { isValid } = formMethods.formState;

  const canCall = isValid && !isCalling;

  const { mutate } = useMutation({
    mutationFn: async (data: TestCallFormValues) => {
      const body = {
        name: data.contact_name,
        phone_number: data.phone_number.replace(/^\+/, ''),
        campana_id: CAMPAIGN_ID,
      };
      return await DIALER_HTTP_CLIENT.post('/calls/test', body);
    },
    onMutate: () => {
      setIsCalling(true);
    },
    onSuccess: () => {
      toast.success(t('modals.testCall.success'));
      setTimeout(() => {
        setShowDialog(false);
        setIsCalling(false);
        // Resetear el formulario después de cerrar
        formMethods.reset();
      }, 7000);
    },
    onError: () => {
      setIsCalling(false);
      toast.error(t('modals.testCall.error'));
    },
  });

  function onSubmit(values: TestCallFormValues) {
    const formattedValues = {
      ...values,
      phone_number: values.phone_number.replace(/^\+/, ''),
      campana_id: CAMPAIGN_ID, // ID de campaña fijo
    };
    mutate(formattedValues);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className='p-0 sm:max-w-[1000px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-blue-500/30 shadow-2xl shadow-blue-900/50 overflow-hidden'>
        {/* Header mejorado con gradiente */}
        <div className='relative bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 p-6 sm:p-8 border-b border-blue-500/30'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5' />
          <div className='relative flex items-center gap-4'>
            <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'>
              <Phone className='h-6 w-6 text-white' />
            </div>
            <div className='flex-1'>
              <DialogTitle className='text-2xl font-bold text-white flex items-center gap-2'>
                {t('modals.testCall.title')}
                <Sparkles className='h-5 w-5 text-yellow-400 animate-pulse' />
              </DialogTitle>
              <DialogDescription className='text-blue-200 mt-2 text-base'>
                {t('modals.testCall.description')}
              </DialogDescription>
            </div>
          </div>
        </div>

        <FormProvider {...formMethods}>
          <div className='flex flex-col lg:flex-row'>
            {/* Columna Izquierda: Formulario */}
            <div
              className={`flex-1 p-6 sm:p-8 border-r border-blue-500/20 bg-gray-800/50 ${
                isCalling ? 'pointer-events-none opacity-50' : ''
              }`}
            >
              <div className='space-y-6'>
                <div className='mb-6'>
                  <h3 className='text-lg font-semibold text-white mb-2 flex items-center gap-2'>
                    <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                    Información del Contacto
                  </h3>
                  <p className='text-gray-400 text-sm'>
                    Completa los datos para realizar la llamada de prueba
                  </p>
                </div>
                <TestCallForm form={formMethods} />
              </div>
            </div>

            {/* Columna Derecha: Área interactiva */}
            <div className='flex-1 p-6 sm:p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30'>
              <TestCallInteractiveArea
                isCalling={isCalling}
                onClick={
                  canCall ? formMethods.handleSubmit(onSubmit) : () => {}
                }
              />
            </div>
          </div>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
