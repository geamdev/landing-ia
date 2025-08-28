'use client';

import { Phone } from 'lucide-react';
import { useState } from 'react';
import { TestCallModal } from './TestCallModal';

export function FloatingCallButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Botón flotante circular */}
      <button
        onClick={() => setShowModal(true)}
        className='fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 via-purple-500 to-indigo-600 shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-110 active:scale-95 group'
        aria-label='Probar llamada de prueba'
      >
        <Phone className='h-8 w-8 text-white transition-transform duration-300 group-hover:rotate-12' />

        {/* Efecto de brillo en hover */}
        <div className='absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

        {/* Tooltip */}
        <div className='absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap'>
          Probar Agente IA
          <div className='absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900' />
        </div>
      </button>

      {/* Modal de llamadas */}
      <TestCallModal open={showModal} onOpenChange={setShowModal} />
    </>
  );
}
