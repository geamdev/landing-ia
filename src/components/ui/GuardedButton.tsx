// components/GuardedButton.tsx
'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
// import { useMinutesBalance } from '@/hooks/Dialer/use-minutes';
// import { parseMinutesString } from '@/types/minutes';

export interface GuardedButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Callback para acciones (modal, dialog, etc.) */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  /** Minutos mínimos que debe tener el usuario */
  minNeeded?: number;
  /** Mensaje personalizado para el tooltip */
  tooltipMessage?: string;
}

export function GuardedButton({
  onClick,
  minNeeded = 1,
  tooltipMessage = 'Minutos agotados. Por favor, recarga.',
  children,
  disabled,
  ...btnProps
}: GuardedButtonProps) {
  // const { data, isLoading } = useMinutesBalance();
  // const available = parseMinutesString(data?.available_minutes || '0:00s');
  const hasMinutes = 10 >= minNeeded;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (!hasMinutes || disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const isDisabled = disabled || !hasMinutes;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={isDisabled ? 'inline-block cursor-not-allowed' : ''}>
            <Button
              {...btnProps}
              onClick={handleClick}
              disabled={isDisabled}
              className={
                isDisabled
                  ? `${btnProps.className ?? ''} opacity-50`
                  : btnProps.className
              }
            >
              {children}
            </Button>
          </span>
        </TooltipTrigger>
        {!hasMinutes && (
          <TooltipContent side='top' align='center'>
            {tooltipMessage}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
}
