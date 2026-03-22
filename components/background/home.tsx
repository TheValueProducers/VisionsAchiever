"use client"
import { useThemeContext } from "../context/themeWrapper";
export default function StarryNight() {
  const { isDark } = useThemeContext();

  
  return (
    <div className={`fixed inset-0 -z-10 overflow-hidden transition-all duration-[2000ms] ease-in-out ${
      isDark 
        ? 'bg-gradient-to-b from-[#0b0b2b] via-[#1b2735] to-[#090a0f]'
        : 'bg-gradient-to-b from-gray-50 via-gray-100 to-white'
    }`}>
      <style jsx>{`
        .stars {
          width: 1px;
          height: 1px;
          position: absolute;
          background: ${isDark ? 'white' : '#1a1a1a'};
          box-shadow: 2vw 5vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            10vw 8vh 2px ${isDark ? 'white' : '#2a2a2a'}, 
            15vw 15vh 1px ${isDark ? 'white' : '#1a1a1a'},
            22vw 22vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            28vw 12vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            32vw 32vh 1px ${isDark ? 'white' : '#2a2a2a'},
            38vw 18vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            42vw 35vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            48vw 25vh 2px ${isDark ? 'white' : '#1a1a1a'},
            53vw 42vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            58vw 15vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            63vw 38vh 1px ${isDark ? 'white' : '#2a2a2a'},
            68vw 28vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            73vw 45vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            78vw 32vh 2px ${isDark ? 'white' : '#1a1a1a'},
            83vw 48vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            88vw 20vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            93vw 52vh 1px ${isDark ? 'white' : '#2a2a2a'},
            98vw 35vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            5vw 60vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            12vw 65vh 2px ${isDark ? 'white' : '#1a1a1a'},
            18vw 72vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            25vw 78vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            30vw 85vh 1px ${isDark ? 'white' : '#2a2a2a'},
            35vw 68vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            40vw 82vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            45vw 92vh 2px ${isDark ? 'white' : '#1a1a1a'},
            50vw 75vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            55vw 88vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            60vw 95vh 1px ${isDark ? 'white' : '#2a2a2a'},
            65vw 72vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            70vw 85vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            75vw 78vh 2px ${isDark ? 'white' : '#1a1a1a'},
            80vw 92vh 1px ${isDark ? 'white' : '#2a2a2a'}, 
            85vw 82vh 2px ${isDark ? 'white' : '#1a1a1a'}, 
            90vw 88vh 1px ${isDark ? 'white' : '#2a2a2a'},
            95vw 75vh 2px ${isDark ? 'white' : '#1a1a1a'};
          animation: twinkle 8s infinite linear;
          transition: background 1.5s ease-in-out, box-shadow 1.5s ease-in-out;
        }
        
        .stars::after {
          content: "";
          position: absolute;
          width: 1px;
          height: 1px;
          background: ${isDark ? 'white' : '#1a1a1a'};
          box-shadow: 8vw 12vh 2px ${isDark ? 'white' : '#2a2a2a'}, 
            16vw 18vh 1px ${isDark ? 'white' : '#1a1a1a'}, 
            24vw 25vh 2px ${isDark ? 'white' : '#2a2a2a'},
            33vw 15vh 1px ${isDark ? 'white' : '#1a1a1a'}, 
            41vw 28vh 2px ${isDark ? 'white' : '#2a2a2a'}, 
            49vw 35vh 1px ${isDark ? 'white' : '#1a1a1a'},
            57vw 22vh 2px ${isDark ? 'white' : '#2a2a2a'}, 
            65vw 42vh 1px ${isDark ? 'white' : '#1a1a1a'}, 
            73vw 28vh 2px ${isDark ? 'white' : '#2a2a2a'},
            81vw 48vh 1px ${isDark ? 'white' : '#1a1a1a'}, 
            89vw 32vh 2px ${isDark ? 'white' : '#2a2a2a'}, 
            97vw 45vh 1px ${isDark ? 'white' : '#1a1a1a'},
            3vw 68vh 2px ${isDark ? 'white' : '#2a2a2a'}, 
            11vw 75vh 1px ${isDark ? 'white' : '#1a1a1a'}, 
            19vw 82vh 2px ${isDark ? 'white' : '#2a2a2a'},
            27vw 88vh 1px ${isDark ? 'white' : '#1a1a1a'}, 
            35vw 72vh 2px ${isDark ? 'white' : '#2a2a2a'}, 
            43vw 85vh 1px ${isDark ? 'white' : '#1a1a1a'},
            51vw 92vh 2px ${isDark ? 'white' : '#2a2a2a'}, 
            59vw 78vh 1px ${isDark ? 'white' : '#1a1a1a'};
          animation: twinkle 6s infinite linear reverse;
          transition: background 1.5s ease-in-out, box-shadow 1.5s ease-in-out;
        }
        
        .shooting-star {
          position: absolute;
          width: 100px;
          height: 2px;
          background: linear-gradient(90deg, ${isDark ? 'white' : '#1a1a1a'}, transparent);
          animation: shoot 3s infinite ease-in;
          transition: background 1.5s ease-in-out;
        }
        
        .shooting-star:nth-child(2) {
          top: 20%;
          left: -100px;
          animation-delay: 0s;
        }
        
        .shooting-star:nth-child(3) {
          top: 35%;
          left: -100px;
          animation-delay: 1s;
        }
        
        .shooting-star:nth-child(4) {
          top: 50%;
          left: -100px;
          animation-delay: 2s;
        }
        
        .shooting-star:nth-child(5) {
          top: 65%;
          left: -100px;
          animation-delay: 0.5s;
        }
        
        .shooting-star:nth-child(6) {
          top: 80%;
          left: -100px;
          animation-delay: 1.5s;
        }
        
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.8;
          }
          50% {
            opacity: ${isDark ? '0.4' : '0.3'};
          }
        }
        
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(25deg);
            opacity: 1;
          }
          100% {
            transform: translateX(120vw) translateY(50vh) rotate(25deg);
            opacity: 0;
          }
        }
      `}</style>
      
      <div className="stars"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
      <div className="shooting-star"></div>
    </div>
  );
}