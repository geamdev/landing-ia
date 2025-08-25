import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AnimatedBackground from '@/components/animated-background';
import Header from '@/components/header';
import AiDialer from '@/components/ai-dialer';

function App() {
  const tabsSettings = [
    {
      title: 'Agente Financiero',
      value: 'financiero',
      content: <AiDialer />,
    },
    {
      title: 'Agente Bancario',
      value: 'bancario',
      content: (
        <div className='flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-6 text-center'>
          <div className='bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 max-w-xl'>
            <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/25'>
              <span className='text-2xl'>🏦</span>
            </div>
            <h2 className='text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-3'>
              Agente Bancario
            </h2>
            <p className='text-lg text-white/70 leading-relaxed mb-4'>
              Próximamente estará disponible nuestro agente bancario
              especializado
            </p>
            <div className='inline-flex items-center px-3 py-1.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-400/30 text-sm font-medium'>
              🚧 En desarrollo
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Fondo animado */}
      <AnimatedBackground />

      {/* Header */}
      <Header />

      {/* Contenido principal */}
      <div className='h-[calc(100vh-88px)] relative z-10 flex flex-col items-center pt-4 pb-2'>
        <div className='max-w-6xl w-full px-6 h-full'>
          <Tabs
            defaultValue='financiero'
            className='w-full h-full flex flex-col'
          >
            <div className='flex justify-center mb-3'>
              <TabsList className='scale-100'>
                {tabsSettings.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className='text-base px-6 py-2'
                  >
                    {tab.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {tabsSettings.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className='flex-1 flex items-center justify-center'
              >
                {tab.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default App;
