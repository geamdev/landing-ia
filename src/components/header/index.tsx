import { useSip } from '@/hooks/useSip';

export const Header = () => {
  const { isConnected, isRegistered } = useSip();

  const getConnectionStatus = () => {
    if (!isConnected) return { color: 'bg-red-500', text: 'Desconectado' };
    if (!isRegistered)
      return { color: 'bg-yellow-500', text: 'Registrando...' };
    return { color: 'bg-green-400', text: 'Conectado' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <header className='w-full p-4 relative z-20'>
      <div className='max-w-7xl mx-auto flex justify-between items-center'>
        {/* Logo */}
        <div className='flex items-center space-x-3'>
          <img
            width={150}
            src='/LOGO-IANEXO-OFICIAL.jpg'
            alt='Intelnexo Logo'
            className='object-cover rounded-xl'
          />
        </div>

        {/* Indicador de conexión */}
        <div className='flex items-center space-x-3'>
          <div
            className={`w-2.5 h-2.5 rounded-full ${connectionStatus.color} shadow-lg animate-pulse`}
          />
          <span className='text-white/90 font-medium text-sm backdrop-blur-sm px-2.5 py-1 rounded-full bg-white/5 border border-white/10'>
            {connectionStatus.text}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
