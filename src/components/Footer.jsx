import { useState } from "react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { MdHeadsetMic } from "react-icons/md";
import { Link } from "react-router-dom";
import BrandIcon from "./BrandIcon";
import { useMenu } from "../context/MenuContext";

const usefulLinks = [
  { label: "Home", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Offers", to: "/offers" },
];

const socialLinks = [
  { icon: FaFacebookF, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

function FooterLogo() {
  const { settings } = useMenu();
  return (
    <a href="/" className="inline-flex items-center gap-3">
      <span className="text-[22px] font-extrabold uppercase tracking-tight text-white">
        {settings?.restaurantName || "BHANDU KHAN"}
      </span>
      <BrandIcon size={52} className="shrink-0 rounded-2xl shadow-sm" />
    </a>
  );
}

function Footer() {
  const [email, setEmail] = useState("");
  const { settings } = useMenu();

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="mt-16 bg-[#f7941d] text-white">
      <div className="mx-auto max-w-[1320px] px-5 py-10 md:px-8 md:py-12 lg:px-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-12">
          {/* Brand + Newsletter + Social */}
          <div className="md:max-w-[360px]">
            <FooterLogo />

            <p className="mt-5 text-[13px] leading-relaxed text-white">
              Subscribe to our newsletter to get latest updates
            </p>

            <form onSubmit={handleSubscribe} className="mt-3">
              <div className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="h-[46px] w-full rounded-lg border-0 bg-white pr-[118px] pl-4 text-[13px] text-navy outline-none placeholder:text-gray-muted"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 h-[36px] rounded-md bg-[#f7941d] px-4 text-[13px] font-semibold text-white transition hover:bg-[#e8850f]"
                >
                  Subscribe
                </button>
              </div>
            </form>

            <p className="mt-6 text-[13px] text-white">Follow Us On</p>
            <div className="mt-3 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#f7941d] transition hover:scale-105"
                >
                  <Icon className="text-[15px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div className="md:pt-1">
            <h3 className="text-[15px] font-bold text-white">Useful Links</h3>
            <ul className="mt-4 space-y-2.5">
              {usefulLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[13px] text-white/90 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:pt-1">
            <p className="text-[15px] font-bold text-white">{settings?.contactName || "Faizan Khalid"}</p>
            <a
              href={`mailto:${settings?.email || "fk5095129@gmail.com"}`}
              className="mt-3 flex items-center gap-3 text-[13px] text-white transition hover:text-white/90"
            >
              <IoMailOutline className="h-5 w-5 shrink-0" />
              <span>{settings?.email || "fk5095129@gmail.com"}</span>
            </a>
            <a
              href={`tel:+${settings?.whatsapp || "923029655325"}`}
              className="mt-4 flex items-center gap-3 text-[13px] text-white transition hover:text-white/90"
            >
              <MdHeadsetMic className="h-5 w-5 shrink-0" />
              <span>{settings?.phone || "03029655325"}</span>
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-white/35 pt-5 text-center text-[13px] text-white">
          All Right Reserved @{settings?.copyrightYear || 2026}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
