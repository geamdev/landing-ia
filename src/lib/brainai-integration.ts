interface BrainAIConfig {
  apiUrl: string;
  enabled: boolean;
}

interface CallInfo {
  phoneNumber: string;
  callId: string;
  status: 'started' | 'ended' | 'failed';
  timestamp: string;
}

class BrainAIIntegration {
  private config: BrainAIConfig;

  constructor() {
    this.config = {
      apiUrl: 'http://localhost:3000/api/dialer-integration',
      enabled: true,
    };
  }

  // Configurar la integración
  setConfig(config: Partial<BrainAIConfig>) {
    this.config = { ...this.config, ...config };
  }

  // Enviar datos a BrainAI
  private async sendToBrainAI(action: string, data: any) {
    if (!this.config.enabled) {
      console.log('🔇 BrainAI integration disabled');
      return null;
    }

    try {
      console.log('🚀 Sending to BrainAI:', { action, data });

      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          ...data,
        }),
      });

      const result = await response.json();
      console.log('✅ BrainAI Response:', result);

      return result;
    } catch (error) {
      console.error('❌ Error communicating with BrainAI:', error);
      return null;
    }
  }

  // Registrar el dialer con BrainAI
  async registerDialer(username: string) {
    return await this.sendToBrainAI('register', {
      username,
      extensionVersion: '1.0.6',
      timestamp: new Date().toISOString(),
    });
  }

  // Notificar inicio de llamada
  async notifyCallStart(callInfo: Omit<CallInfo, 'status' | 'timestamp'>) {
    const data: CallInfo = {
      ...callInfo,
      status: 'started',
      timestamp: new Date().toISOString(),
    };

    return await this.sendToBrainAI('call', data);
  }

  // Notificar fin de llamada
  async notifyCallEnd(callId: string) {
    return await this.sendToBrainAI('hangup', {
      callId,
      timestamp: new Date().toISOString(),
    });
  }

  // Obtener estado
  async getStatus(username: string) {
    return await this.sendToBrainAI('status', {
      username,
      timestamp: new Date().toISOString(),
    });
  }

  // Método para ser llamado desde la interfaz del dialer
  async onCallEvent(event: 'call_started' | 'call_ended', data: any) {
    console.log('📞 Call event:', event, data);

    switch (event) {
      case 'call_started':
        await this.notifyCallStart({
          phoneNumber: data.phoneNumber || data.number,
          callId: data.callId || `call_${Date.now()}`,
        });
        break;

      case 'call_ended':
        await this.notifyCallEnd(data.callId || `call_${Date.now()}`);
        break;
    }
  }
}

// Crear instancia global
const brainAIIntegration = new BrainAIIntegration();

// Exportar para uso en otros módulos
export default brainAIIntegration;

// También hacer disponible globalmente para el extension
if (typeof window !== 'undefined') {
  (window as any).brainAIIntegration = brainAIIntegration;
}
