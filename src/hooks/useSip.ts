import { useState, useEffect, useRef, useCallback } from 'react';
import { SipUA, SipConstants, SipModel } from '@/lib';
import { DEFAULT_JAMBONZ_CONFIG } from '@/common/constants';
import { SipClientStatus, SipCallDirection } from '@/common/types';
import type { SipStatus, CallInfo } from '@/common/types';

interface UseSipReturn {
  sipStatus: SipStatus;
  callStatus: SipClientStatus;
  currentCall?: CallInfo;
  makeCall: (number: string, headers?: string[]) => void;
  hangup: () => void;
  answer: () => void;
  mute: () => void;
  unmute: () => void;
  hold: () => void;
  unhold: () => void;
  sendDtmf: (tone: string | number) => void;
  debugState: () => void;
  isConnected: boolean;
  isRegistered: boolean;
}

export const useSip = (): UseSipReturn => {
  const [sipStatus, setSipStatus] = useState<SipStatus>({
    status: SipClientStatus.Disconnected,
    isConnected: false,
    isRegistered: false,
  });

  const [callStatus, setCallStatus] = useState<SipClientStatus>(
    SipClientStatus.Disconnected
  );
  const [currentCall, setCurrentCall] = useState<CallInfo | undefined>();

  const sipUaRef = useRef<SipUA | null>(null);
  const currentCallIdRef = useRef<string | undefined>(undefined);

  // Configuración del cliente SIP - memorizada para evitar re-creaciones
  const getSipConfig = (): {
    clientAuth: SipModel.ClientAuth;
    clientOptions: SipModel.ClientOptions;
  } => {
    return {
      clientAuth: {
        username: DEFAULT_JAMBONZ_CONFIG.sipUsername,
        password: DEFAULT_JAMBONZ_CONFIG.sipPassword,
        name: DEFAULT_JAMBONZ_CONFIG.sipDisplayName,
      },
      clientOptions: {
        wsUri: DEFAULT_JAMBONZ_CONFIG.sipServerAddress,
        register: true,
        pcConfig: {
          iceServers: [
            { urls: ['stun:stun.l.google.com:19302'] },
            { urls: ['stun:stun1.l.google.com:19302'] },
          ],
        },
      },
    };
  };

  // Inicializar SIP UA
  const initializeSip = () => {
    if (sipUaRef.current) {
      console.log('⚠️ SIP UA already initialized, skipping...');
      return;
    }

    console.log('🚀 Initializing SIP UA...');
    try {
      const { clientAuth, clientOptions } = getSipConfig();
      const sipUa = new SipUA(clientAuth, clientOptions);

      // Event listeners para el UA
      sipUa.on(SipConstants.UA_CONNECTING, () => {
        console.log('🔄 SIP Connecting...');
        setSipStatus((prev) => ({
          ...prev,
          status: SipClientStatus.Connecting,
        }));
      });

      sipUa.on(SipConstants.UA_CONNECTED, () => {
        console.log('✅ SIP Connected');
        setSipStatus((prev) => ({
          ...prev,
          status: SipClientStatus.Connected,
          isConnected: true,
        }));
      });

      sipUa.on(SipConstants.UA_DISCONNECTED, () => {
        console.log('❌ SIP Disconnected');
        setSipStatus((prev) => ({
          ...prev,
          status: SipClientStatus.Disconnected,
          isConnected: false,
          isRegistered: false,
        }));
        setCallStatus(SipClientStatus.Disconnected);
      });

      sipUa.on(SipConstants.UA_REGISTERED, () => {
        console.log('📞 SIP Registered');
        setSipStatus((prev) => ({
          ...prev,
          status: SipClientStatus.Registered,
          isRegistered: true,
        }));
        setCallStatus(SipClientStatus.Connected);
      });

      sipUa.on(SipConstants.UA_UNREGISTERED, () => {
        console.log('📵 SIP Unregistered');
        setSipStatus((prev) => ({
          ...prev,
          status: SipClientStatus.RegistrationFailed,
          isRegistered: false,
        }));
      });

      // Event listeners para las sesiones
      sipUa.on('newRTCSession', (data: any) => {
        console.log('🆕 New RTC Session created:', data);
        console.log('🆕 Data structure:', JSON.stringify(data, null, 2));

        let sessionId = data.session?.id;
        console.log('🆕 Raw session ID from data:', sessionId);

        // Si no tenemos un session ID válido, usar el defaultAppId como fallback
        if (!sessionId) {
          sessionId = DEFAULT_JAMBONZ_CONFIG.defaultAppId;
          console.log(
            '🆕 Using defaultAppId as fallback session ID:',
            sessionId
          );
        }

        currentCallIdRef.current = sessionId;
        console.log('✅ Session ID captured:', sessionId);

        // Crear el objeto de llamada inmediatamente
        setCurrentCall({
          id: sessionId,
          phoneNumber: 'AI Agent',
          direction: SipCallDirection.Outgoing,
          status: SipClientStatus.Ringing,
          startTime: new Date(),
        });
      });

      // Listener para el progreso de la llamada
      sipUa.on('progress', (data: any) => {
        console.log('📞 Call Progress:', data);
        console.log(
          '📞 Progress data structure:',
          JSON.stringify(data, null, 2)
        );

        const sessionId = data.session?.id || currentCallIdRef.current;
        if (sessionId && sessionId !== currentCallIdRef.current) {
          currentCallIdRef.current = sessionId;
          console.log('✅ Session ID updated from progress:', sessionId);

          // Actualizar el estado de la llamada
          setCallStatus(SipClientStatus.Ringing);
          setCurrentCall((prev) => {
            if (prev) {
              return { ...prev, status: SipClientStatus.Ringing };
            } else {
              // Crear un nuevo objeto si no existe
              return {
                id: sessionId,
                phoneNumber: 'AI Agent',
                direction: SipCallDirection.Outgoing,
                status: SipClientStatus.Ringing,
                startTime: new Date(),
              };
            }
          });
        }
      });

      // Listener para cuando la llamada se está conectando
      sipUa.on('connecting', (data: any) => {
        console.log('🔗 Call Connecting:', data);
        const sessionId = data.session?.id || currentCallIdRef.current;
        if (sessionId && sessionId !== currentCallIdRef.current) {
          currentCallIdRef.current = sessionId;
          console.log('✅ Session ID updated from connecting:', sessionId);
        }
      });

      // Listener para cuando la llamada está confirmada (activa)
      sipUa.on('confirmed', (data: any) => {
        console.log('✅ Call Confirmed:', data);
        const sessionId = data.session?.id || currentCallIdRef.current;
        if (sessionId && sessionId !== currentCallIdRef.current) {
          currentCallIdRef.current = sessionId;
          console.log('✅ Session ID updated from confirmed:', sessionId);
        }

        // Actualizar el estado de la llamada
        setCallStatus(SipClientStatus.InCall);
        setCurrentCall((prev) => {
          if (prev) {
            return { ...prev, status: SipClientStatus.InCall };
          } else {
            // Crear un nuevo objeto si no existe
            const newSessionId =
              sessionId ||
              currentCallIdRef.current ||
              DEFAULT_JAMBONZ_CONFIG.defaultAppId;
            return {
              id: newSessionId,
              phoneNumber: 'AI Agent',
              direction: SipCallDirection.Outgoing,
              status: SipClientStatus.InCall,
              startTime: new Date(),
            };
          }
        });
      });

      sipUa.on(SipConstants.SESSION_RINGING, (data: any) => {
        console.log('📞 Call Ringing', data);
        let sessionId = data.session?.id || data.id || currentCallIdRef.current;

        // Si no tenemos un session ID válido, usar el defaultAppId como fallback
        if (!sessionId || sessionId === 'unknown') {
          sessionId = DEFAULT_JAMBONZ_CONFIG.defaultAppId;
          console.log(
            '📞 Using defaultAppId as fallback session ID:',
            sessionId
          );
        }

        currentCallIdRef.current = sessionId;
        console.log('📞 Using session ID:', sessionId);

        setCallStatus(SipClientStatus.Ringing);
        setCurrentCall({
          id: sessionId,
          phoneNumber: 'AI Agent',
          direction: SipCallDirection.Outgoing,
          status: SipClientStatus.Ringing,
          startTime: new Date(),
        });
      });

      sipUa.on(SipConstants.SESSION_ANSWERED, (data: any) => {
        console.log('✅ Call Answered', data);
        setCallStatus(SipClientStatus.CallAnswered);

        setCurrentCall((prev) => {
          if (prev) {
            console.log('✅ Updating existing call status to answered');
            return {
              ...prev,
              status: SipClientStatus.CallAnswered,
            };
          } else {
            console.log('⚠️ No previous call found, creating new call object');
            // Solo crear un nuevo objeto si tenemos un session ID válido
            const sessionId = currentCallIdRef.current;
            if (sessionId && sessionId !== 'unknown') {
              return {
                id: sessionId,
                phoneNumber: 'AI Agent',
                direction: SipCallDirection.Outgoing,
                status: SipClientStatus.CallAnswered,
                startTime: new Date(),
              };
            } else {
              console.log(
                '⚠️ No valid session ID available, cannot create call object'
              );
              return undefined;
            }
          }
        });
      });

      sipUa.on(SipConstants.SESSION_FAILED, ({ cause, description }: any) => {
        console.log('❌ Call Failed:', cause, description);
        setCallStatus(SipClientStatus.CallFailed);

        setCurrentCall((prev) =>
          prev
            ? {
                ...prev,
                status: SipClientStatus.CallFailed,
                endTime: new Date(),
              }
            : undefined
        );

        // Limpiar después de un tiempo
        setTimeout(() => {
          setCurrentCall(undefined);
          setCallStatus(
            sipStatus.isRegistered
              ? SipClientStatus.Registered
              : SipClientStatus.Connected
          );
          currentCallIdRef.current = undefined;
        }, 3000);
      });

      sipUa.on(SipConstants.SESSION_ENDED, ({}: any) => {
        console.log('📴 Call Ended');
        setCallStatus(SipClientStatus.CallEnded);

        setCurrentCall((prev) =>
          prev
            ? {
                ...prev,
                status: SipClientStatus.CallEnded,
                endTime: new Date(),
              }
            : undefined
        );

        // Limpiar después de un tiempo
        setTimeout(() => {
          setCurrentCall(undefined);
          setCallStatus(
            sipStatus.isRegistered
              ? SipClientStatus.Registered
              : SipClientStatus.Connected
          );
          currentCallIdRef.current = undefined;
        }, 2000);
      });

      sipUa.on(SipConstants.SESSION_ACTIVE, (data: any) => {
        console.log('🎯 Session Active', data);
        setCallStatus(SipClientStatus.InCall);

        setCurrentCall((prev) => {
          if (prev) {
            console.log('🎯 Updating existing call status to in call');
            return {
              ...prev,
              status: SipClientStatus.InCall,
            };
          } else {
            console.log(
              '⚠️ No previous call found, creating new call object for active session'
            );
            // Solo crear un nuevo objeto si tenemos un session ID válido
            const sessionId = currentCallIdRef.current;
            if (sessionId && sessionId !== 'unknown') {
              return {
                id: sessionId,
                phoneNumber: 'AI Agent',
                direction: SipCallDirection.Outgoing,
                status: SipClientStatus.InCall,
                startTime: new Date(),
              };
            } else {
              console.log(
                '⚠️ No valid session ID available, cannot create call object'
              );
              return undefined;
            }
          }
        });
      });

      sipUaRef.current = sipUa;
      sipUa.start();
    } catch (error) {
      console.error('❌ Error initializing SIP:', error);
      setSipStatus((prev) => ({
        ...prev,
        status: SipClientStatus.Disconnected,
        lastError: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  };

  // Funciones de control de llamadas
  const makeCall = useCallback(
    (number: string, headers: string[] = []) => {
      if (!sipUaRef.current) {
        console.error('❌ SIP UA not initialized');
        return;
      }

      if (!sipStatus.isRegistered) {
        console.error('❌ SIP client not registered');
        return;
      }

      try {
        console.log('📞 Making call to:', number);
        console.log('📞 Current SIP status:', sipStatus);
        console.log('📞 Current call status:', callStatus);
        console.log('📞 Current call ID ref:', currentCallIdRef.current);

        const customHeaders =
          headers.length > 0
            ? headers
            : [`X-Application-Sid: ${DEFAULT_JAMBONZ_CONFIG.defaultAppId}`];

        console.log('📞 Using headers:', customHeaders);
        console.log('📞 About to call sipUa.call()...');
        sipUaRef.current.call(number, customHeaders);
        console.log('📞 Call initiated successfully');
      } catch (error) {
        console.error('❌ Error making call:', error);
      }
    },
    [sipStatus.isRegistered, sipStatus, callStatus]
  );

  const hangup = useCallback(() => {
    console.log('📴 Hangup function called');
    console.log('📴 sipUaRef.current:', !!sipUaRef.current);
    console.log('📴 currentCallIdRef.current:', currentCallIdRef.current);
    console.log('📴 currentCall:', currentCall);

    if (!sipUaRef.current) {
      console.error('❌ SIP UA not initialized');
      return;
    }

    // Intentar obtener el ID de la sesión de múltiples fuentes
    let sessionId = currentCallIdRef.current;
    if (!sessionId && currentCall?.id) {
      sessionId = currentCall.id;
      console.log('📴 Using fallback session ID from currentCall:', sessionId);
    }

    // Si aún no tenemos session ID pero hay una llamada activa, solo limpiar el estado
    if (
      !sessionId &&
      callStatus !== SipClientStatus.Connected &&
      callStatus !== SipClientStatus.Disconnected
    ) {
      console.log('📴 No valid session ID, cleaning up call state only');
      setCurrentCall(undefined);
      setCallStatus(SipClientStatus.Connected);
      currentCallIdRef.current = undefined;
      return;
    }

    if (!sessionId) {
      console.error('❌ No active call to hangup');
      console.log('📴 Available data for debugging:', {
        currentCall,
        callStatus,
        sipStatus,
      });
      return;
    }

    // Si el session ID es el defaultAppId, solo limpiar el estado local
    if (sessionId === DEFAULT_JAMBONZ_CONFIG.defaultAppId) {
      console.log(
        '📴 Cleaning up call state for default app without terminating session'
      );
      setCurrentCall(undefined);
      setCallStatus(SipClientStatus.Connected);
      currentCallIdRef.current = undefined;
      return;
    }

    try {
      console.log('📴 Hanging up call with ID:', sessionId);
      sipUaRef.current.terminate(200, 'Call Ended by User', sessionId);

      // Limpiar inmediatamente el estado
      setCurrentCall(undefined);
      setCallStatus(SipClientStatus.Connected);
      currentCallIdRef.current = undefined;
      console.log('📴 Call state cleaned up');
    } catch (error) {
      console.error('❌ Error hanging up:', error);
    }
  }, [currentCall, callStatus, sipStatus]);

  const answer = useCallback(() => {
    if (!sipUaRef.current || !currentCallIdRef.current) {
      console.error('❌ No incoming call to answer');
      return;
    }

    try {
      console.log('✅ Answering call');
      sipUaRef.current.answer(currentCallIdRef.current);
    } catch (error) {
      console.error('❌ Error answering call:', error);
    }
  }, []);

  const mute = useCallback(() => {
    if (!sipUaRef.current) return;

    try {
      sipUaRef.current.mute(currentCallIdRef.current);
      setCurrentCall((prev) => (prev ? { ...prev, isMuted: true } : undefined));
    } catch (error) {
      console.error('❌ Error muting call:', error);
    }
  }, []);

  const unmute = useCallback(() => {
    if (!sipUaRef.current) return;

    try {
      sipUaRef.current.unmute(currentCallIdRef.current);
      setCurrentCall((prev) =>
        prev ? { ...prev, isMuted: false } : undefined
      );
    } catch (error) {
      console.error('❌ Error unmuting call:', error);
    }
  }, []);

  const hold = useCallback(() => {
    if (!sipUaRef.current) return;

    try {
      sipUaRef.current.hold(currentCallIdRef.current);
      setCurrentCall((prev) =>
        prev ? { ...prev, isOnHold: true } : undefined
      );
    } catch (error) {
      console.error('❌ Error holding call:', error);
    }
  }, []);

  const unhold = useCallback(() => {
    if (!sipUaRef.current) return;

    try {
      sipUaRef.current.unhold(currentCallIdRef.current);
      setCurrentCall((prev) =>
        prev ? { ...prev, isOnHold: false } : undefined
      );
    } catch (error) {
      console.error('❌ Error unholding call:', error);
    }
  }, []);

  const sendDtmf = useCallback((tone: string | number) => {
    if (!sipUaRef.current) return;

    try {
      sipUaRef.current.dtmf(tone, currentCallIdRef.current);
    } catch (error) {
      console.error('❌ Error sending DTMF:', error);
    }
  }, []);

  // Función de debug para mostrar el estado completo
  const debugState = useCallback(() => {
    console.log('🔍 === SIP HOOK DEBUG STATE ===');
    console.log('🔍 sipUaRef.current:', !!sipUaRef.current);
    console.log('🔍 currentCallIdRef.current:', currentCallIdRef.current);
    console.log('🔍 sipStatus:', sipStatus);
    console.log('🔍 callStatus:', callStatus);
    console.log('🔍 currentCall:', currentCall);
    console.log('🔍 isConnected:', sipStatus.isConnected);
    console.log('🔍 isRegistered:', sipStatus.isRegistered);
    console.log('🔍 === END DEBUG STATE ===');
  }, [sipStatus, callStatus, currentCall]);

  // Inicializar automáticamente - solo una vez
  useEffect(() => {
    let isSubscribed = true;

    const init = async () => {
      if (isSubscribed && !sipUaRef.current) {
        initializeSip();
      }
    };

    init();

    // Cleanup al desmontar
    return () => {
      isSubscribed = false;
      if (sipUaRef.current) {
        console.log('🛑 Cleaning up SIP UA...');
        sipUaRef.current.stop();
        sipUaRef.current = null;
      }
    };
  }, []); // Sin dependencias para evitar re-ejecutions

  return {
    sipStatus,
    callStatus,
    currentCall,
    makeCall,
    hangup,
    answer,
    mute,
    unmute,
    hold,
    unhold,
    sendDtmf,
    debugState,
    isConnected: sipStatus.isConnected,
    isRegistered: sipStatus.isRegistered,
  };
};
