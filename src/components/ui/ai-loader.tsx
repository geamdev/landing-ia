import * as React from 'react';

interface LoaderProps {
  size?: number;
  text?: string;
  isActive?: boolean;
}

export const AILoader: React.FC<LoaderProps> = ({
  size = 180,
  text = 'Generating',
  isActive = false,
}) => {
  // Separar el texto en palabras y luego en caracteres, preservando espacios
  const words = text.split(' ');
  const letters = words.flatMap((word, wordIndex) => {
    const wordLetters = word.split('').map((letter, letterIndex) => ({
      char: letter,
      isSpace: false,
      index: wordIndex * 100 + letterIndex,
      wordIndex,
    }));

    // Agregar espacio después de cada palabra (excepto la última)
    if (wordIndex < words.length - 1) {
      wordLetters.push({
        char: ' ',
        isSpace: true,
        index: wordIndex * 100 + word.length,
        wordIndex,
      });
    }

    return wordLetters;
  });

  return (
    <div className='relative flex items-center justify-center'>
      <div
        className='relative flex items-center justify-center font-inter select-none'
        style={{ width: size, height: size }}
      >
        {letters.map((letter, index) => (
          <span
            key={letter.index}
            className={`inline-block text-white opacity-40 animate-loaderLetter ${
              letter.isSpace ? 'w-2' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {letter.char}
          </span>
        ))}

        <div className='absolute inset-0 rounded-full animate-loaderCircle'></div>

        {/* Ondas de audio cuando está activo */}
        {isActive && (
          <>
            <div className='absolute inset-0 rounded-full animate-audioWave1 border-2 border-blue-400/40'></div>
            <div className='absolute inset-0 rounded-full animate-audioWave2 border-2 border-purple-400/40'></div>
            <div className='absolute inset-0 rounded-full animate-audioWave3 border-2 border-cyan-400/40'></div>
            <div className='absolute inset-0 rounded-full animate-audioWave4 border-2 border-emerald-400/40'></div>
          </>
        )}
      </div>

      <style>{`
        @keyframes loaderCircle {
          0% {
            transform: rotate(90deg);
            box-shadow: 0 6px 12px 0 #38bdf8 inset, 0 12px 18px 0 #005dff inset,
              0 36px 36px 0 #1e40af inset, 0 0 3px 1.2px rgba(56, 189, 248, 0.3),
              0 0 6px 1.8px rgba(0, 93, 255, 0.2);
          }
          50% {
            transform: rotate(270deg);
            box-shadow: 0 6px 12px 0 #60a5fa inset, 0 12px 6px 0 #0284c7 inset,
              0 24px 36px 0 #005dff inset, 0 0 3px 1.2px rgba(56, 189, 248, 0.3),
              0 0 6px 1.8px rgba(0, 93, 255, 0.2);
          }
          100% {
            transform: rotate(450deg);
            box-shadow: 0 6px 12px 0 #4dc8fd inset, 0 12px 18px 0 #005dff inset,
              0 36px 36px 0 #1e40af inset, 0 0 3px 1.2px rgba(56, 189, 248, 0.3),
              0 0 6px 1.8px rgba(0, 93, 255, 0.2);
          }
        }

        @keyframes loaderLetter {
          0%,
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
            transform: scale(1.15);
          }
          40% {
            opacity: 0.7;
            transform: translateY(0);
          }
        }

        @keyframes audioWave1 {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes audioWave2 {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.3;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes audioWave3 {
          0% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.35;
          }
          100% {
            transform: scale(1.45);
            opacity: 0;
          }
        }

        @keyframes audioWave4 {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.35);
            opacity: 0.25;
          }
          100% {
            transform: scale(1.55);
            opacity: 0;
          }
        }

        .animate-loaderCircle {
          animation: loaderCircle 5s linear infinite;
        }

        .animate-loaderLetter {
          animation: loaderLetter 3s infinite;
        }

        .animate-audioWave1 {
          animation: audioWave1 2s ease-out infinite;
        }

        .animate-audioWave2 {
          animation: audioWave2 2s ease-out infinite 0.5s;
        }

        .animate-audioWave3 {
          animation: audioWave3 2s ease-out infinite 1s;
        }

        .animate-audioWave4 {
          animation: audioWave4 2s ease-out infinite 1.5s;
        }
      `}</style>
    </div>
  );
};
