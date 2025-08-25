// Tipos para el estado de las llamadas SIP
export const SipClientStatus = {
  Disconnected: 'disconnected',
  Connecting: 'connecting',
  Connected: 'connected',
  Registered: 'registered',
  RegistrationFailed: 'registration_failed',
  InCall: 'in_call',
  Ringing: 'ringing',
  CallAnswered: 'call_answered',
  CallFailed: 'call_failed',
  CallEnded: 'call_ended',
} as const;

export type SipClientStatus =
  (typeof SipClientStatus)[keyof typeof SipClientStatus];

export const SipCallDirection = {
  Incoming: 'incoming',
  Outgoing: 'outgoing',
} as const;

export type SipCallDirection =
  (typeof SipCallDirection)[keyof typeof SipCallDirection];

// Estado del SIP Client
export interface SipStatus {
  status: SipClientStatus;
  isConnected: boolean;
  isRegistered: boolean;
  lastError?: string;
}

// Información de la llamada
export interface CallInfo {
  id: string;
  phoneNumber: string;
  direction: SipCallDirection;
  status: SipClientStatus;
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  isMuted?: boolean;
  isOnHold?: boolean;
}

// Configuración del cliente SIP
export interface SipConfig {
  sipDomain: string;
  sipServerAddress: string;
  sipUsername: string;
  sipPassword: string;
  sipDisplayName: string;
  apiServer?: string;
  accountSid?: string;
  apiKey?: string;
}

// Props para el componente de dialer
export interface DialerProps {
  onCall?: (phoneNumber: string) => void;
  onHangup?: () => void;
  onMute?: () => void;
  onUnmute?: () => void;
  onHold?: () => void;
  onUnhold?: () => void;
}

// Estado del dialer
export interface DialerState {
  inputNumber: string;
  callStatus: SipClientStatus;
  sipStatus: SipStatus;
  currentCall?: CallInfo;
  isCallButtonLoading: boolean;
}
