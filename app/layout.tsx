import React from "react";
import "@styles/global.css";
import "tailwindcss/tailwind.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="dark:bg-gray-900">{children}</body>
    </html>
  );
}
