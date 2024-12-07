'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Home({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 ">
      {isHome && (
        <ul className="flex flex-col items-center justify-center space-y-4 text-2xl">
          <li>
            <Link href="/advent-of-code/2022">Advent of Code 2022</Link>
          </li>
          <li>
            <Link href="/advent-of-code/2024">Advent of Code 2024</Link>
          </li>
        </ul>
      )}
      {children}
    </section>
  )
}