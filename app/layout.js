import "./globals.css";

export const metadata = {
  title: "VFS Application Tracker",
  description: "Track your DHA visa application status with VFS Global.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
