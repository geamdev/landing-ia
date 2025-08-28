'use client';

import { Phone } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useCampaignsTranslations } from '@/hooks/i18n/use-campaigns-translations';
import { TestCallFormValues } from './types';

interface TestCallInteractiveAreaProps {
  isCalling: boolean;
  onClick: () => void;
}

export function TestCallInteractiveArea({
  isCalling,
  onClick,
}: TestCallInteractiveAreaProps) {
  const { t } = useCampaignsTranslations();
  const { getValues } = useFormContext<TestCallFormValues>();

  return (
    <div className='flex flex-1 items-center justify-center'>
      <div
        className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-6 sm:p-10 transition-all duration-300 ${
          isCalling
            ? 'pointer-events-none border-blue-400/30 opacity-50'
            : 'border-blue-400/40 hover:border-blue-300 hover:shadow-2xl'
        }`}
        onClick={!isCalling ? onClick : undefined}
      >
        {isCalling ? (
          <div className='flex flex-col items-center justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center justify-center'>
                <div
                  className='h-28 w-28 sm:h-36 sm:w-36 animate-ping rounded-full border-2 border-blue-300 dark:border-blue-600'
                  style={{ animationDuration: '1.5s' }}
                ></div>
                <div
                  className='h-24 w-24 sm:h-32 sm:w-32 animate-ping rounded-full border-2 border-blue-400 delay-150 dark:border-blue-700'
                  style={{ animationDuration: '1.5s' }}
                ></div>
              </div>
              <div className='relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-blue-500 shadow-xl dark:bg-blue-800'>
                <Phone className='h-10 w-10 sm:h-12 sm:w-12 text-white' />
              </div>
            </div>
            <h2 className='mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-white'>
              {t('modals.testCall.interactive.calling')}
            </h2>
            <p className='text-base sm:text-lg font-light text-blue-200'>
              {getValues('contact_name') ||
                t('modals.testCall.interactive.unknown')}
            </p>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center transition-all duration-300'>
            <div className='relative'>
              <div className='flex h-20 w-20 sm:h-24 sm:w-24 transform items-center justify-center rounded-full bg-blue-500 shadow-lg transition-transform duration-300 group-hover:scale-110 dark:bg-blue-800'>
                <Phone className='h-10 w-10 sm:h-12 sm:w-12 text-white' />
              </div>
              <div className='absolute inset-0 rounded-full border border-blue-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:border-blue-600'></div>
            </div>
            <h2 className='mt-4 sm:mt-6 text-lg sm:text-xl font-semibold text-white'>
              {t('modals.testCall.interactive.readyToCall')}
            </h2>
            <p className='mt-2 text-sm font-medium text-blue-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
              {t('modals.testCall.interactive.clickToStart')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
