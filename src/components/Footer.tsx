import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { ArchDivider } from "./ArchDivider";

export function Footer({ adminEmail }: { adminEmail: string }) {
  const ownerPhone = process.env.NEXT_PUBLIC_OWNER_PHONE ?? "";
  const ownerPhoneLink = ownerPhone.replace(/\D/g, "");
  return (
    <footer className="mt-24 bg-maroon text-ivory">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo.jpg"
              alt="तोरणद्वार ItraWala"
              width={200}
              height={80}
              className="mb-4 h-16 w-[200px] object-contain object-left mix-blend-screen"
            />
            <p className="max-w-xs font-body text-sm leading-relaxed text-ivory/70">
              Traditional attars, oudh and bakhoor, sourced and blended with the
              same care as a hundred years ago — brought to your door.
            </p>
            <div className="mt-5 flex gap-4">
              <a href="https://www.instagram.com/torandwar_itrawala/" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-ivory/70 hover:text-gold-light">
                <Instagram size={19} />
              </a>
              <a href="https://www.facebook.com/neeraj.saini.397" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-ivory/70 hover:text-gold-light">
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

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-body text-xs uppercase tracking-[0.25em] text-gold-light">
              Stay In Touch
            </h3>
            <ul className="mb-5 space-y-2 font-body text-sm text-ivory/75">
              <li className="flex items-center gap-2"><Phone size={15} /> <a href={`tel:+${ownerPhoneLink}`} className="hover:text-gold-light">{ownerPhone}</a></li>
              <li className="flex items-center gap-2"><Mail size={15} /> <a href={`mailto:${adminEmail}`} className="hover:text-gold-light">{adminEmail}</a></li>
              <li className="flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0" /> <a href="https://www.google.com/maps/dir/28.039725,76.1010138/Torandwar+itra-wala,+opposite+Polytechnic,+Seka,+Narnaul,+Haryana+123001/@28.0370157,76.0968326,16.45z/am=t/data=!4m10!4m9!1m1!4e1!1m5!1m1!1s0x3912b5ed78ba8365:0x125c3b30524937c3!2m2!1d76.0974958!2d28.0335847!3e0?entry=ttu&g_ep=EgoyMDI2MDQwMS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-1 hover:text-gold-light">Opposite Polytechnic, Seka, Narnaul, Haryana - 123001 <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></li>
              <li className="text-xs text-ivory/55">Open 9 AM - 9 PM, Mon-Sun</li>
              <li className="text-xs text-gold-light">Owner: Rajneesh Saini</li>
            </ul>
          </div>
        </div>

        <ArchDivider className="my-10 opacity-60" />

        <div className="flex flex-col items-center justify-between gap-3 font-body text-xs text-ivory/60 md:flex-row">
          <p>&copy; {new Date().getFullYear()} तोरणद्वार ItraWala. Owner: Rajneesh Saini.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-gold-light">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-gold-light">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-gold-light">Shipping</Link>
            <Link href="/returns" className="hover:text-gold-light">Returns</Link>
          </div>
        </div>

        <div className="mt-4 text-center font-body text-sm text-ivory/70 md:text-right">
          <p>
            Powered by{' '}
            <a
              href="https://ritbha.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-gold-light underline decoration-gold-light/60 underline-offset-4 transition-colors hover:text-gold-light/90"
            >
              Ritbha
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
