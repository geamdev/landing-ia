'use client';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCampaignsTranslations } from '@/hooks/i18n/use-campaigns-translations';
import type { Control } from 'react-hook-form';

interface CampaignSelectFieldProps {
  control: Control<any>;
  name: string;
  campaigns: { id: number; name: string }[];
  loading: boolean;
}

export function CampaignSelectField({
  control,
  name,
  campaigns,
  loading,
}: CampaignSelectFieldProps) {
  const { t } = useCampaignsTranslations();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className='font-medium'>
            {t('modals.testCall.form.campaign')}
          </FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className='w-full'>
                <SelectValue
                  placeholder={t('modals.testCall.form.campaignPlaceholder')}
                />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value='' disabled>
                    {t('modals.testCall.form.loadingCampaigns')}
                  </SelectItem>
                ) : campaigns.length === 0 ? (
                  <SelectItem value='' disabled>
                    {t('modals.testCall.form.noCampaigns')}
                  </SelectItem>
                ) : (
                  campaigns.map((campaign) => (
                    <SelectItem
                      key={campaign.id}
                      value={campaign.id.toString()}
                    >
                      {campaign.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
