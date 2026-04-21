import LoginCard from './components/LoginCard';
import Link from 'next/link';

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative p-4 bg-[#f4f6f8] overflow-hidden">

      {/* Global Watermarks - Left and Right */}
      <div className="hidden xl:flex absolute left-0 top-[40%] -translate-x-[5%] -translate-y-1/2 w-[35vw] h-[35vw] max-w-[700px] max-h-[700px] min-w-[400px] min-h-[400px] opacity-[0.04] pointer-events-none z-0 items-center justify-center">
        <img 
            src="/templeton_watermark.png" 
            alt="" 
            className="w-full h-full object-contain mix-blend-multiply" 
        />
      </div>
      <div className="hidden xl:flex absolute right-0 top-[60%] translate-x-[5%] -translate-y-1/2 w-[35vw] h-[35vw] max-w-[700px] max-h-[700px] min-w-[400px] min-h-[400px] opacity-[0.04] pointer-events-none z-0 items-center justify-center">
        <img 
            src="/templeton_watermark.png" 
            alt="" 
            className="w-full h-full object-contain mix-blend-multiply" 
        />
      </div>

      <div className="z-20 w-full flex justify-center items-center">
        <LoginCard />
      </div>
    </div>
  )
}


