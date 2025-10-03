import { motion } from "framer-motion";
import { Anchor, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { PerformanceImage } from "@/components/ui/performance-image";
import { useWebsiteSettings } from "@/hooks/use-website-settings";
import logoImage from "@assets/Asset 3_1_1756973310181.png";

export default function Footer() {
  const { settings } = useWebsiteSettings();
  
  const groupCompanies = [
    "Balasore Marine Exports Pvt. Ltd.",
    { name: "Natnov Bioscience Pvt. Ltd.", url: "http://www.natnovbioscience.com/" },
    "Alashore Aqua Pvt. Ltd.",
    "Meghasani Pulp and Paper Pvt. Ltd.",
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/#about" },
    { name: "Products", href: "/#products" },
    { name: "Sustainability", href: "/#sustainability" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: settings.facebook, name: "Facebook" },
    { icon: Instagram, href: settings.instagram, name: "Instagram" },
    { icon: Twitter, href: settings.twitter, name: "Twitter" },
    { icon: Linkedin, href: settings.linkedin, name: "LinkedIn" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-deep-navy text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6 overflow-visible logo-container" style={{ width: 'auto', minWidth: 'fit-content' }}>
              <div className="relative overflow-visible" style={{ overflow: 'visible !important', width: 'auto', minWidth: 'fit-content' }}>
                <PerformanceImage
                  src={logoImage}
                  alt="Alashore Marine Exports"
                  className="h-16 w-auto object-contain filter brightness-110"
                  priority={true}
                  loading="eager"
                  data-testid="footer-logo"
                  style={{ 
                    clipPath: 'none', 
                    overflow: 'visible',
                    maxWidth: 'none',
                    width: 'auto',
                    minWidth: 'fit-content',
                    maxHeight: 'none',
                    objectFit: 'contain',
                    display: 'block',
                    filter: 'drop-shadow(0 0 0 1px white) drop-shadow(0 0 0 2px rgba(255,255,255,0.5))'
                  }}
                />
                {/* Glowing effect underneath */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3/4 h-2 bg-gradient-to-r from-transparent via-marine-teal/40 to-transparent rounded-full blur-md animate-pulse" />
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-coral-accent/30 to-transparent rounded-full blur-sm" />
              </div>
            </div>
            <p className="text-light-marine mb-6">
              At Alashore Marine - we care about our People, our Products & the Farmers. 
              These are the core values we demonstrate in our actions.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-light-marine">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  {link.href.startsWith("/#") ? (
                    <button
                      onClick={() => scrollToSection(link.href)}
                      className="hover:text-white transition-colors text-left"
                      data-testid={`button-footer-${link.name.toLowerCase().replace(" ", "-")}`}
                    >
                      {link.name}
                    </button>
                  ) : (
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors"
                      data-testid={`link-footer-${link.name.toLowerCase().replace(" ", "-")}`}
                    >
                      {link.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Group Companies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Group Companies</h4>
            <ul className="space-y-3 text-light-marine">
              {groupCompanies.map((company, index) => (
                <li key={index}>
                  {typeof company === "object" ? (
                    <a
                      href={company.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      data-testid="link-natnov-bioscience"
                    >
                      {company.name}
                    </a>
                  ) : (
                    <span>{company}</span>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <div className="space-y-4 text-light-marine">
              <p className="text-sm">
                Plot No- D1/18(P), D1/19, D1/20 & D1/37, D1/38, D1/39(P)<br />
                Somnathpur Industrial Estate, Balasore, Odisha, India, Pin- 755019
              </p>
              <p>
                <a 
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                  data-testid="link-email"
                >
                  {settings.email}
                </a>
              </p>
              <p>
                <a 
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="hover:text-white transition-colors"
                  data-testid="link-phone"
                >
                  {settings.phone}
                </a>
              </p>
            </div>

            <div className="flex space-x-4 mt-6">
              {socialLinks.filter(social => social.href).map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-ocean-blue rounded-lg flex items-center justify-center text-white hover:bg-marine-teal transition-colors"
                  data-testid={`link-social-${social.name.toLowerCase()}`}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-light-marine">
          <p>
            Copyright 2025 Alashore Marine Exports Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
