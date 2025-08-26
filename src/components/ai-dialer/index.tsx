import { Button } from '@/components/ui/button';
import { DEFAULT_JAMBONZ_CONFIG } from '@/common/constants';
import { useSip } from '@/hooks/useSip';
import { SipClientStatus } from '@/common/types';
import { AILoader } from '../ui/ai-loader';
import { useState, useEffect } from 'react';

export const AiDialer = () => {
  const { callStatus, makeCall, hangup, isConnected, isRegistered } = useSip();
  const [isProcessing, setIsProcessing] = useState(false);

  // Manejar el estado de procesamiento basado en el estado real de la llamada
  useEffect(() => {
    // Si la llamada está en progreso (ringing, answered, in call), mantener procesando
    if (
      callStatus === SipClientStatus.Ringing ||
      callStatus === SipClientStatus.CallAnswered ||
      callStatus === SipClientStatus.InCall
    ) {
      setIsProcessing(true);
    }
    // Si la llamada terminó o falló, permitir nueva llamada
    else if (
      callStatus === SipClientStatus.CallEnded ||
      callStatus === SipClientStatus.CallFailed ||
      callStatus === SipClientStatus.Connected ||
      callStatus === SipClientStatus.Registered
    ) {
      setIsProcessing(false);
    }
  }, [callStatus]);

  const handleTestAgent = () => {
    // Prevenir múltiples clics
    if (isProcessing) return;

    const defaultAppId = DEFAULT_JAMBONZ_CONFIG.defaultAppId;
    const defaultAppName = DEFAULT_JAMBONZ_CONFIG.defaultAppName;

    console.log('🤖 Conectando con agente IA:', {
      appId: defaultAppId,
      appName: defaultAppName,
    });

    // Llamar directamente al agente IA usando el app ID
    const appNumber = `app-${defaultAppId}`;
    makeCall(appNumber, [`X-Application-Sid: ${defaultAppId}`]);

    // El useEffect se encargará de manejar isProcessing basado en callStatus
  };

  const handleHangup = () => {
    // Prevenir múltiples clics
    if (isProcessing) return;

    hangup();

    // El useEffect se encargará de manejar isProcessing basado en callStatus
  };

  // Determinar el estado del botón
  const getButtonState = () => {
    if (!isConnected) {
      return { text: 'Conectando...', disabled: true, loading: true };
    }

    if (!isRegistered) {
      return { text: 'Registrando...', disabled: true, loading: true };
    }

    // Si está procesando, deshabilitar el botón
    if (isProcessing) {
      return { text: 'Procesando...', disabled: true, loading: true };
    }

    switch (callStatus) {
      case SipClientStatus.Ringing:
        return { text: 'Llamando...', disabled: false, loading: true };
      case SipClientStatus.CallAnswered:
      case SipClientStatus.InCall:
        return {
          text: 'En llamada - Colgar',
          disabled: false,
          loading: false,
          isHangup: true,
        };
      case SipClientStatus.CallFailed:
        return { text: 'Llamada falló', disabled: true, loading: false };
      case SipClientStatus.CallEnded:
        return { text: 'Llamada terminada', disabled: true, loading: false };
      default:
        return { text: 'Probar Agente IA', disabled: false, loading: false };
    }
  };

  const buttonState = getButtonState();

  // Determinar el estado del loader y texto
  const getLoaderState = () => {
    if (
      callStatus === SipClientStatus.InCall ||
      callStatus === SipClientStatus.CallAnswered
    ) {
      return { text: 'En conversación', isActive: true };
    } else if (callStatus === SipClientStatus.Ringing) {
      return { text: 'Conectando...', isActive: true };
    } else {
      return { text: 'Generando', isActive: false };
    }
  };

  const loaderState = getLoaderState();

  return (
    <div className='flex flex-col items-center space-y-8 w-full max-w-3xl mx-auto p-6'>
      {/* Título principal */}
      <div className='text-center space-y-3'>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent'>
          Asistente de IA
        </h1>
      </div>

      {/* Loader de IA con ondas de audio */}
      <div className='py-4'>
        <AILoader
          size={180}
          text={loaderState.text}
          isActive={loaderState.isActive}
        />
      </div>

      {/* Descripción */}
      <div className='text-center max-w-2xl'>
        <p className='text-lg text-white/80 leading-relaxed font-medium'>
          Conecta instantáneamente con nuestro agente de IA especializado en
          servicios financieros y bancarios
        </p>
      </div>

      {/* Botón principal */}
      <div className='pt-2'>
        <Button
          onClick={buttonState.isHangup ? handleHangup : handleTestAgent}
          disabled={buttonState.disabled}
          size='lg'
          variant={buttonState.isHangup ? 'destructive' : 'default'}
        >
          {buttonState.loading && (
            <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
          )}
          {buttonState.text}
        </Button>
      </div>
    </div>
  );
};

export default AiDialer;
