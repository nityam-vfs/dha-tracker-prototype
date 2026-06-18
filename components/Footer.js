// Static informational footer matching VFS Global's standard layout.
// Links point to the public VFS Global site (informational only).
export default function Footer() {
  const links = [
    { label: "About", href: "https://www.vfsglobal.com/en/individuals/about.html" },
    { label: "Contact", href: "https://www.vfsglobal.com/en/individuals/contact.html" },
    { label: "FAQs", href: "https://www.vfsglobal.com/en/individuals/faq.html" },
    {
      label: "Privacy",
      href: "https://www.vfsglobal.com/en/general/privacy-notice.html",
    },
    {
      label: "Terms & Conditions",
      href: "https://www.vfsglobal.com/en/general/terms-and-conditions.html",
    },
  ];

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <nav className="site-footer-links">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="site-footer-bottom">
          <span>
            © {new Date().getFullYear()} VFS Global Group. All Rights Reserved.
          </span>
          <span>DHA Application Tracker — Prototype</span>
        </div>
      </div>
    </footer>
  );
}
