import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">404 - Not Found</h1>
          <p className="text-slate-400 leading-relaxed">
            The operational intelligence you are looking for does not exist or has been moved.
          </p>
        </div>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]"
        >
          Return to Command Center <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
