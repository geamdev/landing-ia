export function useCampaignsTranslations() {
  return {
    t: (key: string) => {
      const translations: Record<string, string> = {
        'modals.testCall.title': 'Llamada de Prueba',
        'modals.testCall.description':
          'Realiza una llamada de prueba para verificar el funcionamiento del agente IA',
        'modals.testCall.button': 'Probar Agente',
        'modals.testCall.form.campaign': 'Campaña',
        'modals.testCall.form.campaignPlaceholder': 'Selecciona una campaña',
        'modals.testCall.form.contactName': 'Nombre del Contacto',
        'modals.testCall.form.contactNamePlaceholder':
          'Ingresa el nombre del contacto',
        'modals.testCall.form.phoneNumber': 'Número de Teléfono',
        'modals.testCall.form.phoneNumberPlaceholder':
          'Ingresa el número de teléfono',
        'modals.testCall.form.loadingCampaigns': 'Cargando campañas...',
        'modals.testCall.form.noCampaigns': 'No hay campañas disponibles',
        'modals.testCall.interactive.readyToCall': 'Listo para Llamar',
        'modals.testCall.interactive.clickToStart':
          'Haz clic para iniciar la llamada',
        'modals.testCall.interactive.calling': 'Llamando...',
        'modals.testCall.interactive.unknown': 'Contacto desconocido',
        'modals.testCall.validation.campaignRequired':
          'Por favor seleccione una campaña.',
        'modals.testCall.validation.contactNameRequired':
          'Por favor escriba el nombre del contacto.',
        'modals.testCall.validation.phoneRequired': 'El número es requerido',
        'modals.testCall.validation.phoneInvalid':
          'El número de teléfono no es válido',
        'modals.testCall.success': 'Llamada iniciada exitosamente',
        'modals.testCall.error': 'Error al iniciar la llamada',
      };

      return translations[key] || key;
    },
  };
}
