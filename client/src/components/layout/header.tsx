import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Menu, X, Shield, Mail, Phone, Building2, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { PerformanceImage } from "@/components/ui/performance-image";
import { useWebsiteSettings } from "@/hooks/use-website-settings";
import logoImage from "@assets/Asset 3_1_1756973310181.png";

interface HeaderProps {
  onEnquiryClick?: () => void;
}

export default function Header({ onEnquiryClick }: HeaderProps = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const { settings } = useWebsiteSettings();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about-us" },
    { name: "Products", href: "/products" },
    { name: "Sustainability", href: "/sustainability" },
    { name: "Media", href: "/media" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  const scrollToSection = (href: string) => {
    if (href.startsWith("/#")) {
      const element = document.querySelector(href.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const handleNavigation = (href: string) => {
    if (href.startsWith("/#")) {
      // If we're not on the home page, navigate to home first
      if (location !== "/") {
        window.location.href = "/" + href;
      } else {
        scrollToSection(href);
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[100]">
      {/* Animated Information Bar - Hidden on mobile and tablet */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ 
          y: isScrolled ? -50 : 0, 
          opacity: isScrolled ? 0 : 1,
          height: isScrolled ? 0 : 'auto'
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative overflow-hidden hidden xl:block"
      >
        {/* Animated Background */}
        <motion.div
          animate={{
            background: [
              "linear-gradient(90deg, #3B82F6, #14B8A6, #F59E0B, #EF4444, #8B5CF6)",
              "linear-gradient(90deg, #14B8A6, #F59E0B, #EF4444, #8B5CF6, #3B82F6)",
              "linear-gradient(90deg, #F59E0B, #EF4444, #8B5CF6, #3B82F6, #14B8A6)",
              "linear-gradient(90deg, #EF4444, #8B5CF6, #3B82F6, #14B8A6, #F59E0B)",
              "linear-gradient(90deg, #8B5CF6, #3B82F6, #14B8A6, #F59E0B, #EF4444)",
              "linear-gradient(90deg, #3B82F6, #14B8A6, #F59E0B, #EF4444, #8B5CF6)",
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute inset-0"
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="flex items-center justify-between h-10 text-white text-sm font-bold">
            {/* Contact Information */}
            <motion.div 
              className="flex items-center space-x-6"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <a 
                href={`mailto:${settings.email}`}
                className="flex items-center space-x-1 hover:text-yellow-200 transition-colors"
                data-testid="link-email"
              >
                <Mail size={14} />
                <span>{settings.email}</span>
              </a>
              <a 
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="flex items-center space-x-1 hover:text-yellow-200 transition-colors"
                data-testid="link-phone"
              >
                <Phone size={14} />
                <span>{settings.phone}</span>
              </a>
              <div className="hidden lg:flex items-center space-x-1">
                <Building2 size={14} />
                <span>CIN: U05000OR2012PTC016366</span>
              </div>
            </motion.div>

            {/* Social Media Links */}
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <span className="hidden sm:inline">Follow Us:</span>
              <div className="flex space-x-2">
                {settings.facebook && (
                  <motion.a
                    href={settings.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                    data-testid="link-facebook"
                  >
                    <Facebook size={16} />
                  </motion.a>
                )}
                {settings.instagram && (
                  <motion.a
                    href={settings.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                    data-testid="link-instagram"
                  >
                    <Instagram size={16} />
                  </motion.a>
                )}
                {settings.twitter && (
                  <motion.a
                    href={settings.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                    data-testid="link-twitter"
                  >
                    <Twitter size={16} />
                  </motion.a>
                )}
                {settings.linkedin && (
                  <motion.a
                    href={settings.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                    data-testid="link-linkedin"
                  >
                    <Linkedin size={16} />
                  </motion.a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
      <div className="container mx-auto px-4 relative overflow-visible" style={{ width: '100%', minWidth: '100%' }}>
        {/* Sea Creatures Swimming Across Entire Navbar */}
        {/* Swimming Shrimp */}
        <motion.div
          className="absolute text-lg pointer-events-none"
          animate={{
            x: [-60, 1200],
            y: [0, -3, 2, -1, 0],
            rotate: [0, 2, -1, 1, 0]
          }}
          transition={{
            x: { duration: 15, repeat: Infinity, ease: "linear" },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            left: '-60px',
            top: '20%',
            zIndex: 1,
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))',
            opacity: 0.6
          }}
        >
          🦐
        </motion.div>

        {/* Swimming Fish */}
        <motion.div
          className="absolute text-base pointer-events-none"
          animate={{
            x: [1200, -60],
            y: [0, 4, -2, 3, 0],
            rotate: [180, 182, 178, 181, 180],
            scale: [1, 1.1, 0.9, 1.05, 1]
          }}
          transition={{
            x: { duration: 18, repeat: Infinity, ease: "linear" },
            y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            right: '-60px',
            top: '60%',
            zIndex: 1,
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))',
            opacity: 0.6
          }}
        >
          🐟
        </motion.div>

        {/* Swimming Crab */}
        <motion.div
          className="absolute text-sm pointer-events-none"
          animate={{
            x: [-50, 1200, -50],
            y: [0, -2, 1, -3, 0],
            rotate: [0, -5, 5, -3, 0]
          }}
          transition={{
            x: { duration: 22, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{
            left: '-50px',
            bottom: '20%',
            zIndex: 1,
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))',
            opacity: 0.5
          }}
        >
          🦀
        </motion.div>

        {/* Small Tropical Fish */}
        <motion.div
          className="absolute text-xs pointer-events-none"
          animate={{
            x: [-40, window.innerWidth + 40],
            y: [0, -5, 3, -2, 0],
            rotate: [0, 3, -2, 1, 0]
          }}
          transition={{
            x: { duration: 12, repeat: Infinity, ease: "linear", delay: 5 },
            y: { duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 5 },
            rotate: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: 5 }
          }}
          style={{
            left: '-40px',
            top: '70%',
            zIndex: 1,
            filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.4))',
            opacity: 0.7
          }}
        >
          🐠
        </motion.div>

        {/* Seahorse */}
        <motion.div
          className="absolute text-sm pointer-events-none"
          animate={{
            x: [1200, -50],
            y: [0, -4, 2, -3, 0],
            rotate: [180, 185, 175, 182, 180]
          }}
          transition={{
            x: { duration: 20, repeat: Infinity, ease: "linear", delay: 8 },
            y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 8 },
            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 8 }
          }}
          style={{
            right: '-50px',
            top: '40%',
            zIndex: 1,
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))',
            opacity: 0.5
          }}
        >
          🐙
        </motion.div>


        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20 overflow-visible" style={{ width: '100%', minWidth: '100%' }}>
          {/* Logo */}
          <div style={{ overflow: 'visible', flexShrink: 0, width: 'auto', minWidth: 'fit-content' }}>
            <Link href="/">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 cursor-pointer relative overflow-visible logo-container"
                data-testid="link-logo"
                style={{ width: 'auto', minWidth: 'fit-content', minHeight: 'fit-content', maxWidth: 'none', flexShrink: 0, overflow: 'visible' }}
            >
              {/* Pearl Grey Foam/Vapor Effect - Permanent Background */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  scale: [1, 1.03, 0.99, 1.01, 1]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  background: "radial-gradient(ellipse 160px 45px at center, rgba(240,240,240,0.7) 0%, rgba(220,220,220,0.5) 30%, rgba(200,200,200,0.3) 60%, transparent 100%)",
                  filter: 'blur(12px)',
                  opacity: 0.6,
                  zIndex: -1
                }}
              />

              {/* Permanent Floating Bubbles */}
              <motion.div
                className="absolute w-1.5 h-1.5 bg-white/40 rounded-full"
                animate={{
                  x: [0, 4, -2, 5, 0],
                  y: [0, -3, 2, -4, 0],
                  scale: [0.8, 1.1, 0.9, 1.2, 0.8]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0
                }}
                style={{
                  left: '20%',
                  top: '30%',
                  filter: 'blur(0.5px)',
                  opacity: 0.6,
                  zIndex: -1
                }}
              />
              <motion.div
                className="absolute w-1 h-1 bg-white/35 rounded-full"
                animate={{
                  x: [0, -3, 2, -4, 0],
                  y: [0, 2, -3, 1, 0],
                  scale: [0.7, 1, 0.8, 0.9, 0.7]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
                style={{
                  right: '25%',
                  top: '20%',
                  opacity: 0.5,
                  zIndex: -1
                }}
              />
              <motion.div
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                animate={{
                  x: [0, 5, -2, 6, 0],
                  y: [0, 3, -1, 4, 0],
                  scale: [0.6, 1.2, 0.9, 1.3, 0.6]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 3
                }}
                style={{
                  right: '15%',
                  bottom: '15%',
                  filter: 'blur(1px)',
                  opacity: 0.4,
                  zIndex: -1
                }}
              />
              <motion.div
                className="absolute w-0.5 h-0.5 bg-white/50 rounded-full"
                animate={{
                  x: [0, -1, 3, -2, 0],
                  y: [0, -4, 1, -5, 0],
                  scale: [0.5, 0.9, 1.1, 0.7, 0.5]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
                style={{
                  left: '70%',
                  bottom: '25%',
                  opacity: 0.7,
                  zIndex: -1
                }}
              />
              <motion.div
                className="absolute w-1.2 h-1.2 bg-white/32 rounded-full"
                animate={{
                  x: [0, -3, 1, -4, 0],
                  y: [0, 2, -2, 2, 0],
                  scale: [0.7, 1.1, 0.9, 1.2, 0.7]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 4
                }}
                style={{
                  left: '10%',
                  bottom: '30%',
                  filter: 'blur(0.8px)',
                  opacity: 0.5,
                  zIndex: -1
                }}
              />

              {/* Logo Container */}
              <motion.div
                className={`relative z-10 transition-all duration-500 overflow-visible ${
                  isScrolled 
                    ? 'filter brightness-110 contrast-125 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]' 
                    : 'filter brightness-125 contrast-150 saturate-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                }`}
                style={{ minWidth: 'fit-content', minHeight: 'fit-content', overflow: 'visible', width: 'auto', maxWidth: 'none', flexShrink: 0 }}
                animate={{
                  filter: isScrolled 
                    ? ["brightness(1.1) contrast(1.25)", "brightness(1.15) contrast(1.3)", "brightness(1.1) contrast(1.25)"]
                    : ["brightness(1.25) contrast(1.5) saturate(1.1)", "brightness(1.3) contrast(1.55) saturate(1.15)", "brightness(1.25) contrast(1.5) saturate(1.1)"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <PerformanceImage
                  src={logoImage}
                  alt="Alashore Marine Exports"
                  className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
                  data-testid="header-logo"
                  priority={true}
                  loading="eager"
                  style={{ 
                    clipPath: 'none', 
                    overflow: 'visible',
                    maxWidth: 'none',
                    maxHeight: 'none',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </motion.div>
            </motion.div>
          </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.href.startsWith("/#") ? (
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`${isScrolled ? 'text-gray-700' : 'text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'} hover:text-coral-accent transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,107,107,0.4)]`}
                    data-testid={`button-nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`${isScrolled ? 'text-gray-700' : 'text-white font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'} hover:text-coral-accent transition-all duration-300 hover:drop-shadow-[0_0_8px_rgba(255,107,107,0.4)]`}
                    data-testid={`link-nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/meadmin"
              className={`hidden xl:flex items-center text-sm ${isScrolled ? 'text-gray-600' : 'text-white/90 font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'} hover:text-coral-accent transition-all duration-300`}
              data-testid="link-admin"
            >
              <Shield size={16} className="mr-1" />
              Admin
            </Link>
            <motion.button
              onClick={onEnquiryClick ? onEnquiryClick : () => scrollToSection("/#contact")}
              className="relative bg-ocean-blue text-white px-3 py-1.5 sm:px-6 sm:py-2 text-sm rounded-lg hover:bg-deep-navy transition-all duration-300 overflow-hidden"
              data-testid="button-enquiry"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glowing Effect */}
              <motion.div
                className="absolute inset-0 rounded-lg"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.2), inset 0 0 10px rgba(255,255,255,0.1)",
                    "0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.3), inset 0 0 15px rgba(255,255,255,0.2)",
                    "0 0 10px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.2), inset 0 0 10px rgba(255,255,255,0.1)"
                  ]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <span className="relative z-10">Enquiry</span>
            </motion.button>
            <button
              className={`lg:hidden ${isScrolled ? 'text-gray-700' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'} hover:text-coral-accent transition-colors duration-300`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.href.startsWith("/#") ? (
                    <button
                      onClick={() => handleNavigation(item.href)}
                      className="block text-gray-700 hover:text-coral-accent transition-colors"
                      data-testid={`button-mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className="block text-gray-700 hover:text-coral-accent transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                      data-testid={`link-mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      </motion.header>
    </div>
  );
}
