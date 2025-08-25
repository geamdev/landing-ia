import { Box } from '@chakra-ui/react';
import './styles.scss';

export const AnimatedBackground = () => {
  return (
    <Box
      position='fixed'
      top={0}
      left={0}
      width='100vw'
      height='100vh'
      zIndex={-1}
      overflow='hidden'
      className='animated-background'
    >
      {/* Gradiente base */}
      <Box
        position='absolute'
        top={0}
        left={0}
        width='100%'
        height='100%'
        background='linear-gradient(135deg, #1a1b3a 0%, #2d2d64 30%, #4a4a8a 60%, #6b73b8 100%)'
      />

      {/* Ondas animadas */}
      <Box className='wave-container'>
        <div className='wave wave-1'></div>
        <div className='wave wave-2'></div>
        <div className='wave wave-3'></div>
        <div className='wave wave-4'></div>
        <div className='wave wave-5'></div>
      </Box>

      {/* Partículas flotantes */}
      <Box className='particles'>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </Box>

      {/* Overlay sutil para mejor legibilidad */}
      <Box
        position='absolute'
        top={0}
        left={0}
        width='100%'
        height='100%'
        background='rgba(0, 0, 0, 0.1)'
        pointerEvents='none'
      />
    </Box>
  );
};

export default AnimatedBackground;
