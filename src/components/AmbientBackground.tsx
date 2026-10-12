import React from 'react';

export const AmbientBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Top subtle golden ambient orb */}
      <div className="absolute -top-[15%] start-[10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-gradient-to-br from-[#C5A059]/10 to-transparent dark:from-[#C5A059]/8 blur-[100px] transform-gpu" />

      {/* Middle right soft slate/charcoal orb */}
      <div className="absolute top-[35%] end-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-gradient-to-bl from-zinc-300/30 dark:from-zinc-800/25 to-transparent blur-[110px] transform-gpu" />

      {/* Bottom ambient glow */}
      <div className="absolute -bottom-[10%] start-[25%] w-[60vw] h-[40vw] max-w-[700px] max-h-[500px] rounded-full bg-gradient-to-t from-slate-200/40 dark:from-zinc-900/40 to-transparent blur-[120px] transform-gpu" />
    </div>
  );
};
