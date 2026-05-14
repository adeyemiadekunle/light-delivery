import Link from "next/link";
import { Package2 } from "lucide-react";

const footerLinks = {
  Sending: [
    { href: "/send", label: "Send a parcel" },
    { href: "/find", label: "Find a drop-off point" },
    { href: "/send#prices", label: "Parcel sizes & prices" },
  ],
  Receiving: [
    { href: "/track", label: "Track my parcel" },
    { href: "/find", label: "Collect from a drop-off" },
  ],
  Business: [
    { href: "/business", label: "Business accounts" },
    { href: "/business/api", label: "API & integrations" },
    { href: "/business/pricing", label: "Business pricing" },
  ],
  Help: [
    { href: "/help", label: "Help centre" },
    { href: "/contact", label: "Contact us" },
    { href: "/partners", label: "Become a drop-off partner" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1e0a3c] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <Package2 className="h-7 w-7" />
              <span>Rands</span>
            </Link>
            <p className="text-sm text-purple-300 leading-relaxed">
              Nigeria&rsquo;s asset-light delivery network. Fast, reliable parcels everywhere.
            </p>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white mb-3">{group}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-purple-300 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-purple-900 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-purple-400">
            &copy; {new Date().getFullYear()} Rands Delivery Network. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-purple-400 hover:text-white">Privacy</Link>
            <Link href="/terms" className="text-xs text-purple-400 hover:text-white">Terms</Link>
            <Link href="/cookies" className="text-xs text-purple-400 hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
