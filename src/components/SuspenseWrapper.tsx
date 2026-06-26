import { Suspense, ReactNode } from 'react';

export function SuspenseWrapper({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center bg-black">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-brand-500"></div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
