import { useSip } from '@/hooks/useSip';

export const Header = () => {
  const { isConnected, isRegistered } = useSip();

  const getConnectionStatus = () => {
    if (!isConnected) return { color: 'bg-red-600', text: 'Desconectado' };
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
          <div className='w-10 h-10 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-400 rounded-xl flex items-center justify-center shadow-lg shadow-gray-500/25 backdrop-blur-sm border border-white/10'>
            <span className='text-white font-bold text-lg'>I</span>
          </div>
          <span className='text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent'>
            IAnexo
          </span>
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
