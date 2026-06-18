import "./globals.css";

export const metadata = {
  title: "VFS Global — Visa / Permit Verification Portal",
  description:
    "Verify the status of DHA visa and permit applications through VFS Global.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
