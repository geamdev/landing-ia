import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, CreditCard, Building2 } from 'lucide-react';

export default function TabsDemo() {
  return (
    <div className='w-full max-w-4xl mx-auto p-6'>
      <Tabs defaultValue='financiero' className='w-full'>
        <TabsList className='w-full'>
          <TabsTrigger value='financiero' className='flex items-center gap-2'>
            <CreditCard className='w-4 h-4' />
            Agente Financiero
          </TabsTrigger>
          <TabsTrigger value='bancario' className='flex items-center gap-2'>
            <Building2 className='w-4 h-4' />
            Agente Bancario
          </TabsTrigger>
          <TabsTrigger value='ia' className='flex items-center gap-2'>
            <Brain className='w-4 h-4' />
            IA General
          </TabsTrigger>
        </TabsList>

        <TabsContent value='financiero' className='min-h-64 p-8 text-center'>
          <div className='space-y-6'>
            <div className='w-20 h-20 mx-auto bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30'>
              <CreditCard className='w-10 h-10 text-white' />
            </div>
            <h3 className='text-2xl font-bold text-white'>Agente Financiero</h3>
            <p className='text-white/80 max-w-md mx-auto'>
              Asistente especializado en servicios financieros, inversiones y
              planificación económica personalizada.
            </p>
            <button className='px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-all duration-200 backdrop-blur-sm'>
              Probar Agente
            </button>
          </div>
        </TabsContent>

        <TabsContent value='bancario' className='min-h-64 p-8 text-center'>
          <div className='space-y-6'>
            <div className='w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30'>
              <Building2 className='w-10 h-10 text-white' />
            </div>
            <h3 className='text-2xl font-bold text-white'>Agente Bancario</h3>
            <p className='text-white/80 max-w-md mx-auto'>
              Especialista en servicios bancarios, cuentas, préstamos y
              operaciones financieras del día a día.
            </p>
            <button className='px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-all duration-200 backdrop-blur-sm'>
              Probar Agente
            </button>
          </div>
        </TabsContent>

        <TabsContent value='ia' className='min-h-64 p-8 text-center'>
          <div className='space-y-6'>
            <div className='w-20 h-20 mx-auto bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/30'>
              <Brain className='w-10 h-10 text-white' />
            </div>
            <h3 className='text-2xl font-bold text-white'>IA General</h3>
            <p className='text-white/80 max-w-md mx-auto'>
              Asistente de inteligencia artificial versátil para consultas
              generales y tareas diversas.
            </p>
            <button className='px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg border border-white/30 transition-all duration-200 backdrop-blur-sm'>
              Probar Agente
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
