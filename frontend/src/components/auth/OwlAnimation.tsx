import { useEffect, useRef } from 'react';

interface OwlAnimationProps {
  isFlying: boolean;
  onAnimationComplete?: () => void;
}

const OwlAnimation = ({ isFlying, onAnimationComplete }: OwlAnimationProps) => {
  const owlContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const pupils = document.querySelectorAll('.pupil');
      
      pupils.forEach(pupil => {
        const eye = pupil.parentElement;
        if (!eye) return;
        
        const eyeRect = eye.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const distance = Math.min(6, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 20);
        
        const pupilX = Math.cos(angle) * distance;
        const pupilY = Math.sin(angle) * distance;
        
        (pupil as HTMLElement).style.transform = `translate(calc(-50% + ${pupilX}px), calc(-50% + ${pupilY}px))`;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isFlying && owlContainerRef.current) {
      const timer = setTimeout(() => {
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isFlying, onAnimationComplete]);

  return (
    <div
      ref={owlContainerRef}
      className={`transition-all duration-600 ease-in-out
        ${isFlying ? 'owl-fly-around' : ''}`}
    >
      <div className={`w-[100px] h-[100px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] relative
        shadow-[0_8px_30px_rgba(33,150,243,0.5),inset_0_-10px_20px_rgba(0,0,0,0.1)]
        ${!isFlying ? 'owl-float' : ''} ${isFlying ? 'owl-wings-active' : ''}`}
        style={{
          background: 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 50%, #2196F3 100%)'
        }}>
        
        {/* Left Ear */}
        <div className="absolute w-[25px] h-[35px] rounded-[0_50%_50%_0] top-[-8px] left-[-8px] rotate-[-25deg] 
          shadow-[-2px_2px_8px_rgba(0,0,0,0.2)]"
          style={{
            background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)'
          }} />
        
        {/* Right Ear */}
        <div className="absolute w-[25px] h-[35px] rounded-[50%_0_0_50%] top-[-10px] right-[-8px] rotate-[25deg] 
          shadow-[2px_2px_8px_rgba(0,0,0,0.2)]"
          style={{
            background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)'
          }} />
        
        {/* Left Eye */}
        <div className="owl-eye absolute w-[32px] h-[32px] bg-white rounded-full top-[30px] left-[15px]
          shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_5px_rgba(255,255,255,0.5)]
          border-2 border-white/80">
          <div className="pupil absolute w-[14px] h-[14px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            transition-all duration-100 ease-out shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #1976D2, #0D47A1)'
            }}>
            <div className="absolute w-[4px] h-[4px] bg-white/90 rounded-full top-[3px] left-[3px]" />
          </div>
        </div>
        
        
        {/* Right Eye */}
        <div className="owl-eye absolute w-[32px] h-[32px] bg-white rounded-full top-[30px] right-[15px]
          shadow-[inset_0_3px_8px_rgba(0,0,0,0.15),0_2px_5px_rgba(255,255,255,0.5)]
          border-2 border-white/80">
          <div className="pupil absolute w-[14px] h-[14px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
            transition-all duration-100 ease-out shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            style={{
              background: 'radial-gradient(circle at 35% 35%, #1976D2, #0D47A1)'
            }}>
            <div className="absolute w-[4px] h-[4px] bg-white/90 rounded-full top-[3px] left-[3px]" />
          </div>
        </div>
        
        {/* Beak */}
        <div className="absolute bottom-[25px] left-1/2 -translate-x-1/2
          w-0 h-0 border-l-[8px] border-r-[8px] border-t-[15px]
          border-l-transparent border-r-transparent border-t-orange-400
          [filter:drop-shadow(0_2px_3px_rgba(0,0,0,0.2))]" />
        
        {/* Wings */}
        <div className={`wing-left absolute w-[40px] h-[30px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] top-[40px] left-[-15px] -z-10
          ${isFlying ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)'
          }} />
        <div className={`wing-right absolute w-[40px] h-[30px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] top-[40px] right-[-15px] -z-10
          ${isFlying ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%)'
          }} />
        
        {/* Enhanced Smoke trail */}
        {isFlying && (
          <>
            <div className="smoke-trail absolute w-[15px] h-[15px] rounded-full 
              blur-[8px] opacity-0 -z-20 bottom-[10px] left-1/2"
              style={{ background: 'radial-gradient(circle, #42A5F5, transparent)' }} />
            <div className="smoke-trail absolute w-[12px] h-[12px] rounded-full 
              blur-[6px] opacity-0 -z-20 bottom-[5px] left-[45%] [animation-delay:0.15s]"
              style={{ background: 'radial-gradient(circle, #64B5F6, transparent)' }} />
            <div className="smoke-trail absolute w-[10px] h-[10px] rounded-full 
              blur-[5px] opacity-0 -z-20 bottom-0 left-[55%] [animation-delay:0.3s]"
              style={{ background: 'radial-gradient(circle, #2196F3, transparent)' }} />
            <div className="smoke-trail absolute w-[13px] h-[13px] rounded-full 
              blur-[7px] opacity-0 -z-20 bottom-[-5px] left-[50%] [animation-delay:0.45s]"
              style={{ background: 'radial-gradient(circle, #42A5F5, transparent)' }} />
            <div className="smoke-trail absolute w-[11px] h-[11px] rounded-full 
              blur-[6px] opacity-0 -z-20 bottom-[-10px] left-[48%] [animation-delay:0.6s]"
              style={{ background: 'radial-gradient(circle, #64B5F6, transparent)' }} />
          </>
        )}
      </div>
    </div>
  );
};

export default OwlAnimation;
