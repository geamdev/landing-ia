export const DEFAULT_COLOR_SCHEME = 'pink';
export const DEFAULT_TOAST_DURATION = 3000;

// Configuración de Jambonz con credenciales quemadas
export const DEFAULT_JAMBONZ_CONFIG = {
  sipDomain: 'intelnexo-dialer.sip.jambonz.cloud',
  sipServerAddress: 'wss://sip.jambonz.cloud:8443/',
  apiServer: 'https://jambonz.cloud/api/v1',
  sipUsername: 'geampiere',
  sipPassword: 'Intelnexo*2024',
  sipDisplayName: 'Geampiere',
  accountSid: 'f9d6edef-abc3-4197-9b7e-d63364462af9',
  apiKey: '816567c2-039b-4e81-942b-9f0e53719f76',
  //staging
  defaultAppId: '6e86266a-af9c-4ffd-9b01-cad79ee1cac5',
  defaultAppName: 'Agente Bancario no borrar staging',
};

// Función para validar que todas las credenciales estén presentes
export const validateJambonzConfig = () => {
  const requiredFields = [
    'sipDomain',
    'sipServerAddress',
    'sipUsername',
    'sipPassword',
    'sipDisplayName',
  ];

  const missingFields = requiredFields.filter(
    (field) =>
      !DEFAULT_JAMBONZ_CONFIG[field as keyof typeof DEFAULT_JAMBONZ_CONFIG]
  );

  if (missingFields.length > 0) {
    console.warn(
      `Configuración de Jambonz incompleta. Campos faltantes: ${missingFields.join(
        ', '
      )}`
    );
    return false;
  }

  return true;
};
