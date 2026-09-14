import React from 'react';

export default function SecurityWatermark({ participant }) {
  if (!participant) return null;

  const text = `${participant.email || participant.name || 'FunTech User'} • ID: ${participant.id || 'SECURED'}`;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden opacity-[0.035] select-none flex flex-wrap content-between justify-between p-8">
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="text-xs font-mono font-bold text-cyan-200 transform -rotate-12 whitespace-nowrap p-4"
        >
          {text}
        </div>
      ))}
    </div>
  );
}
