// Slim VFS-style footer matching the verification portal layout.
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/customer-logo.svg"
          alt="VFS Global"
          className="footer-logo-img"
        />
        <span className="site-footer-text">
          AR-4.3.5 © {new Date().getFullYear()} IVS-GBS &amp; VFS Global Group.
          All Rights Reserved. ISO 23026 compliant information.
        </span>
      </div>
    </footer>
  );
}
