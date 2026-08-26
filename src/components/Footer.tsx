import Link from "next/link";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { ArchDivider } from "./ArchDivider";

export function Footer() {
  return (
    <footer className="mt-24 bg-maroon text-ivory">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <p className="font-display text-2xl text-gold-light">तोरणद्वार</p>
            <p className="mb-4 font-body text-xs uppercase tracking-[0.3em] text-ivory/70">
              ItraWala
            </p>
            <p className="max-w-xs font-body text-sm leading-relaxed text-ivory/70">
              Traditional attars, oudh and bakhoor, sourced and blended with the
              same care as a hundred years ago — brought to your door.
            </p>
            <div className="mt-5 flex gap-4">
              <a href="#" aria-label="Instagram" className="text-ivory/70 hover:text-gold-light">
                <Instagram size={19} />
              </a>
              <a href="#" aria-label="Facebook" className="text-ivory/70 hover:text-gold-light">
                <Facebook size={19} />
              </a>
              <a href="#" aria-label="YouTube" className="text-ivory/70 hover:text-gold-light">
                <Youtube size={19} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="mb-4 font-body text-xs uppercase tracking-[0.25em] text-gold-light">
              Shop
            </h3>
            <ul className="space-y-2 font-body text-sm text-ivory/75">
              <li><Link href="/shop" className="hover:text-gold-light">All Products</Link></li>
              <li><Link href="/shop?category=pure-attars" className="hover:text-gold-light">Pure Attars</Link></li>
              <li><Link href="/shop?category=eau-de-parfum" className="hover:text-gold-light">Eau De Parfum</Link></li>
              <li><Link href="/shop?category=bakhoor-incense" className="hover:text-gold-light">Bakhoor &amp; Incense</Link></li>
              <li><Link href="/shop?category=gift-sets" className="hover:text-gold-light">Gift Sets</Link></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="mb-4 font-body text-xs uppercase tracking-[0.25em] text-gold-light">
              Company
            </h3>
            <ul className="space-y-2 font-body text-sm text-ivory/75">
              <li><Link href="/about" className="hover:text-gold-light">Our Story</Link></li>
              <li><Link href="/contact" className="hover:text-gold-light">Contact Us</Link></li>
              <li><Link href="/account" className="hover:text-gold-light">My Account</Link></li>
              <li><Link href="/shop" className="hover:text-gold-light">Track Order</Link></li>
            </ul>
          </div>

          {/* Contact + newsletter */}
          <div>
            <h3 className="mb-4 font-body text-xs uppercase tracking-[0.25em] text-gold-light">
              Stay In Touch
            </h3>
            <ul className="mb-5 space-y-2 font-body text-sm text-ivory/75">
              <li className="flex items-center gap-2"><Phone size={15} /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail size={15} /> hello@itrawala.in</li>
              <li className="flex items-center gap-2"><MapPin size={15} /> Kannauj, Uttar Pradesh, India</li>
            </ul>
            <form className="flex overflow-hidden rounded-full border border-gold/40">
              <input
                type="email"
                placeholder="Your email"
                className="w-full bg-transparent px-4 py-2 font-body text-sm text-ivory placeholder:text-ivory/50 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-gold px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-maroon-dark transition hover:bg-gold-light"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <ArchDivider className="my-10 opacity-60" />

        <div className="flex flex-col items-center justify-between gap-3 font-body text-xs text-ivory/60 md:flex-row">
          <p>&copy; {new Date().getFullYear()} तोरणद्वार ItraWala. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/about" className="hover:text-gold-light">Privacy Policy</Link>
            <Link href="/about" className="hover:text-gold-light">Terms of Service</Link>
            <Link href="/about" className="hover:text-gold-light">Shipping &amp; Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
