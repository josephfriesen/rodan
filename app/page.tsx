'use client';

export default function Home({ children }: { children: React.ReactNode }) {
  console.log("/app/page.tsx");

  return (
    <main>
      {children}
    </main>
  )
}