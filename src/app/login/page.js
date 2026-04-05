import LoginCard from './components/LoginCard';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 bg-white overflow-hidden">

      {/* Global Watermark - hidden on mobile/tablet to avoid overflow and prioritize performance */}
      <div className="hidden xl:block absolute right-0 bottom-0 translate-x-[10%] translate-y-[25%] w-[1050px] h-[1050px] opacity-[0.35] pointer-events-none z-0 flex items-center justify-center">
        <img 
            src="/lion.png" 
            alt="" 
            className="w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] saturate-[2] brightness-[1.1] sepia-[0.5]" 
        />
      </div>

      <div className="z-20 w-full flex justify-center items-center">
        <LoginCard />
      </div>
    </div>
  )
}


