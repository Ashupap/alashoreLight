import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Star, Award, Globe, Users, Leaf, Target } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PerformanceImage } from "@/components/ui/performance-image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactFormModal from "@/components/contact-form-modal";
import BlueWorldMap from "@/components/blue-world-map";
import InteractiveGlobalMap from "@/components/interactive-global-map";
import processingFacilityBg from "@assets/generated_images/Seafood_processing_facility_background_fd3ca7c1.png";
import factoryImage from "@assets/4-1 (1)_1756901765521.png";
import mdImage from "@assets/Untitled-design-4 (1)_1756902789995.jpg";

export default function AboutUs() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const parallaxOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.3, 1, 0.3],
  );
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(parallaxY, springConfig);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Leadership Team Auto-Scroll Animation
    const initLeadershipScroll = () => {
      const leadershipTrack = document.querySelector(".leadership-track");
      const leadershipCards = document.querySelectorAll(".leadership-card");

      if (leadershipTrack && leadershipCards.length > 0) {
        // Create infinite horizontal scroll animation
        const totalWidth = leadershipCards.length * (288 + 32); // card width + gap

        // Set up the seamless loop animation
        gsap.set(leadershipTrack, { x: 0 });

        const tl = gsap.timeline({ repeat: -1, ease: "none" });
        tl.to(leadershipTrack, {
          x: -totalWidth / 2, // Move by half the total width (due to duplication)
          duration: 30, // 30 seconds for full loop
          ease: "none",
        });

        // Add hover pause functionality
        const leadershipContainer = document.querySelector(
          ".leadership-scroll-container",
        );
        if (leadershipContainer) {
          leadershipContainer.addEventListener("mouseenter", () => tl.pause());
          leadershipContainer.addEventListener("mouseleave", () => tl.play());
        }

        // Card entrance animations
        leadershipCards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              delay: index * 0.1,
              ease: "back.out(1.7)",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      }
    };

    const initTimeline = () => {
      if (!timelineRef.current) return;

      const container = timelineRef.current;
      const cardsContainer = container.querySelector(".timeline-cards");
      const cards = container.querySelectorAll(".timeline-card");
      const progressFill = container.querySelector(".timeline-progress-fill");
      const currentIcon = container.querySelector(".timeline-current-icon");
      const currentYear = container.querySelector(".timeline-current-year");
      const progressPercentage = container.querySelector(
        ".timeline-progress-percentage",
      );

      if (!cardsContainer || cards.length === 0 || !progressFill) return;

      // Milestone data
      const milestones = [
        { year: "1997", icon: "🏗️" },
        { year: "2000-2005", icon: "📈" },
        { year: "2009", icon: "🌏" },
        { year: "2012", icon: "🚀" },
        { year: "2015-2020", icon: "🏆" },
        { year: "2021-Present", icon: "🌟" },
      ];

      // Horizontal scroll timeline
      gsap.to(cards, {
        xPercent: -100 * (cards.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          snap: 1 / (cards.length - 1),
          end: () =>
            "+=" +
            (cardsContainer.scrollWidth || window.innerWidth * cards.length),
          onUpdate: (self) => {
            const progress = self.progress;
            const currentIndex = Math.round(progress * (cards.length - 1));
            const progressPercentageValue = Math.round(
              ((currentIndex + 1) / cards.length) * 100,
            );

            // Update circular progress bar (283 is the total circumference)
            if (progressFill) {
              const offset = 283 - 283 * progress;
              gsap.to(progressFill, {
                strokeDashoffset: offset,
                duration: 0.3,
                ease: "power2.out",
              });
            }

            // Update current milestone icon and year
            if (currentIcon && milestones[currentIndex]) {
              currentIcon.textContent = milestones[currentIndex].icon;
              gsap.fromTo(
                currentIcon,
                { scale: 1 },
                {
                  scale: 1.1,
                  duration: 0.3,
                  yoyo: true,
                  repeat: 1,
                  ease: "power2.inOut",
                },
              );
            }

            if (currentYear && milestones[currentIndex]) {
              currentYear.textContent = milestones[currentIndex].year;
            }

            // Update progress percentage
            if (progressPercentage) {
              progressPercentage.textContent = `${progressPercentageValue}%`;
            }
          },
        },
      });

      // Floating progress indicator entrance animation
      gsap.fromTo(
        container.querySelector(".fixed"),
        { opacity: 0, x: 100 },
        { opacity: 1, x: 0, duration: 1, delay: 0.5, ease: "back.out(1.7)" },
      );

      // Add parallax animations to timeline icons
      const timelineIcons = container.querySelectorAll(".timeline-icon");
      const mainIcons = container.querySelectorAll(".timeline-main-icon");

      timelineIcons.forEach((icon, index) => {
        // Parallax effect on scroll
        gsap.to(icon, {
          y: -30,
          ease: "none",
          scrollTrigger: {
            trigger: icon,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });

        // Rotation animation on scroll
        gsap.to(icon, {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: icon,
            start: "top bottom",
            end: "bottom top",
            scrub: 3,
          },
        });

        // Scale animation when in view
        gsap.fromTo(
          icon,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: icon,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          },
        );

        // Floating animation for main icon
        if (mainIcons[index]) {
          gsap.to(mainIcons[index], {
            y: -10,
            duration: 2 + index * 0.2,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
          });
        }

        // Hover animations
        icon.addEventListener("mouseenter", () => {
          gsap.to(icon, {
            scale: 1.1,
            rotation: "+=45",
            duration: 0.3,
            ease: "power2.out",
          });

          if (mainIcons[index]) {
            gsap.to(mainIcons[index], {
              scale: 1.2,
              rotation: "+=180",
              duration: 0.4,
              ease: "back.out(1.7)",
            });
          }
        });

        icon.addEventListener("mouseleave", () => {
          gsap.to(icon, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });

          if (mainIcons[index]) {
            gsap.to(mainIcons[index], {
              scale: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });
      });
    };

    // Initialize animations after DOM is ready
    const timer = setTimeout(() => {
      initLeadershipScroll();
      initTimeline();
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      <Header onEnquiryClick={() => setIsContactModalOpen(true)} />

      <main>
        {/* Enhanced Hero Section with Parallax */}
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${processingFacilityBg})`,
              filter: "brightness(0.3) contrast(1.1)",
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-blue/80 via-marine-teal/70 to-deep-navy/85" />
          <motion.div
            style={{ y, opacity: parallaxOpacity }}
            className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"
          />
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, 20, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute bottom-20 left-10 w-32 h-32 bg-coral-accent/20 rounded-full backdrop-blur-sm"
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="inline-flex items-center bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8"
              >
                <Star className="text-coral-accent mr-2" size={20} />
                <span className="text-white/90 font-medium">
                  Excellence Since 2012
                </span>
              </motion.div>
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="text-6xl md:text-8xl font-heading font-bold mb-8"
              >
                About <span className="text-coral-accent">Us</span>
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-2xl text-light-marine max-w-4xl mx-auto leading-relaxed"
              >
                Dedicated to Quality Product - Leading the way in premium
                seafood exports with sustainable practices and unmatched quality
                standards
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20 bg-gradient-to-br from-light-marine to-white">
          <div className="container mx-auto px-4">
            {/* Who We Are Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h3 className="text-ocean-blue text-xl font-semibold mb-4">
                  Who We Are
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  <strong>Alashore Marine Exports Pvt. Ltd.</strong> is
                  well-known in the seafood industry and renowned as a leading
                  shrimp export company, praised for its strong dedication to
                  doing things exceptionally well and in an environmentally
                  friendly way. As a top shrimp exporter in Odisha, India, we
                  provide the best-quality shrimp products worldwide and set new
                  standards in the industry.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  We know how diverse tastes can be, so we offer a wide variety
                  of shrimp products. Our commitment to reliability and quality
                  has resulted in long-term partnerships with customers. Our
                  customers come from different places like food companies,
                  stores, restaurants, clubs, and distributors in developed
                  markets such as the USA, UK, and various European countries.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl overflow-hidden shadow-2xl"
                >
                  <PerformanceImage
                    src={factoryImage}
                    alt="Alashore Marine modern seafood processing facility - aerial view"
                    className="w-full h-auto object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={false}
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Message From Our Managing Director */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                  Message From Our Managing Director
                </h3>
                <div className="w-24 h-1 bg-gradient-to-r from-ocean-blue to-marine-teal mx-auto rounded-full"></div>
              </div>

              <div className="bg-gradient-to-br from-white to-light-marine/30 rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="p-12 md:p-16">
                    <blockquote className="text-gray-700 text-lg leading-relaxed italic mb-8">
                      "At Alashore Marine, we believe that quality is not just a
                      standard but a commitment to excellence that defines every
                      aspect of our operations. Our journey from a small seafood
                      processing unit to becoming a leading exporter has been
                      guided by our unwavering dedication to sustainable
                      practices, innovation, and customer satisfaction.
                      <br />
                      <br />
                      We are not just exporting seafood; we are sharing the rich
                      maritime heritage of our region with the world. Each
                      product that leaves our facility carries with it our
                      promise of freshness, quality, and environmental
                      responsibility."
                    </blockquote>
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-ocean-blue to-marine-teal rounded-full flex items-center justify-center mr-4">
                        <span className="text-white text-xl font-bold">
                          GRD
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          Gyana Ranjan Dash
                        </p>
                        <p className="text-ocean-blue font-semibold">
                          Managing Director
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <PerformanceImage
                      src={mdImage}
                      alt="Managing Director - Gyana Ranjan Dash"
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={false}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mission and Vision Section */}
            <div className="grid md:grid-cols-2 gap-12 mb-20">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Background Image with Parallax Effect */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Our Mission - Innovation in Seafood"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-600/95 via-red-600/90 to-purple-600/95"></div>
                </div>

                {/* Content */}
                <div className="relative p-10 h-full flex flex-col justify-between min-h-[500px]">
                  <div>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <span className="text-white text-3xl">🎯</span>
                    </div>
                    <h3 className="text-white text-3xl font-bold mb-6 group-hover:text-yellow-200 transition-colors duration-300">
                      Our Mission
                    </h3>
                  </div>
                  <div>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                      We're on a mission to introduce a 'New Taste for Life' by
                      creating innovative breaded products. We believe in
                      continuous improvement through technological advancements
                      in our processes. Additionally, we're committed to
                      supporting farmers for a more sustainable future.
                    </p>
                    <div className="w-full h-1 bg-gradient-to-r from-white/30 to-yellow-200/50 rounded-full group-hover:from-yellow-200 group-hover:to-white transition-all duration-500"></div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* Background Image with Parallax Effect */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Our Vision - Global Leadership"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/95 via-green-600/90 to-purple-600/95"></div>
                </div>

                {/* Content */}
                <div className="relative p-10 h-full flex flex-col justify-between min-h-[500px]">
                  <div>
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                      <span className="text-white text-3xl">🌟</span>
                    </div>
                    <h3 className="text-white text-3xl font-bold mb-6 group-hover:text-yellow-200 transition-colors duration-300">
                      Our Vision
                    </h3>
                  </div>
                  <div>
                    <p className="text-white/90 text-lg leading-relaxed mb-6">
                      Alashore Marine's vision is to be a leading global brand
                      in the frozen food industry and to become a top global
                      brand and a leading frozen seafood exporter. We strive for
                      this by investing in top-notch infrastructure, adopting
                      industry best practices, adhering to global quality
                      standards.
                    </p>
                    <div className="w-full h-1 bg-gradient-to-r from-white/30 to-yellow-200/50 rounded-full group-hover:from-yellow-200 group-hover:to-white transition-all duration-500"></div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Modern Leadership Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                Meet Our Leadership Team
              </h3>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                Visionary leaders driving our success in the global seafood
                industry
              </p>
            </motion.div>

            {/* Horizontal Scrolling Leadership Cards */}
            <div className="relative mb-20 overflow-hidden">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-ocean-blue/5 via-transparent to-marine-teal/5 pointer-events-none"></div>

              {/* Scrolling Container */}
              <div className="leadership-scroll-container relative py-8">
                <div className="leadership-track flex gap-8 w-max animate-none">
                  {[
                    {
                      name: "Gyana Ranjan Dash",
                      position: "Managing Director",
                      avatar: mdImage,
                    },
                    {
                      name: "Madhusudan Dash",
                      position: "Director",
                      avatar:
                        "https://ui-avatars.com/api/?name=M+D&size=400&background=9ca3af&color=fff&format=png",
                    },
                    
                    {
                      name: "Monalina Panda",
                      position: "Director",
                      avatar:
                        "https://ui-avatars.com/api/?name=M+P&size=400&background=9ca3af&color=fff&format=png",
                    },
                    {
                      name: "Rashmikanta Panda",
                      position: "Director",
                      avatar:
                        "https://ui-avatars.com/api/?name=R+P&size=400&background=9ca3af&color=fff&format=png",
                    },
                    {
                      name: "Debasish Dash",
                      position: "Director",
                      avatar:
                        "https://ui-avatars.com/api/?name=D+D&size=400&background=9ca3af&color=fff&format=png",
                    },
                    // Duplicate for seamless loop
                    {
                      name: "Gyana Ranjan Dash",
                      position: "Managing Director",
                      avatar: mdImage,
                    },
                    {
                      name: "Madhusudan Dash",
                      position: "Director",
                      avatar:
                        "https://ui-avatars.com/api/?name=M+D&size=400&background=9ca3af&color=fff&format=png",
                    },
                  ].map((leader, index) => (
                    <motion.div
                      key={`${leader.name}-${index}`}
                      initial={{ opacity: 0, y: 50, scale: 0.9 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100,
                      }}
                      viewport={{ once: true }}
                      className="leadership-card group relative flex-shrink-0 w-72 h-96"
                      data-testid={`leadership-card-${index}`}
                    >
                      {/* Main Card */}
                      <div className="relative w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:scale-105 hover:rotate-2 hover:shadow-2xl">
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-ocean-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Photo Container */}
                        <div className="relative h-64 overflow-hidden">
                          <PerformanceImage
                            src={
                              leader.avatar &&
                              leader.avatar.includes("unsplash")
                                ? `${leader.avatar}&q=85&w=800&h=600`
                                : leader.avatar || "/placeholder-avatar.jpg"
                            }
                            alt={leader.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 200px, 288px"
                            priority={index < 2}
                          />

                          {/* Photo Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent group-hover:from-ocean-blue/40 transition-all duration-500"></div>

                          {/* Floating Decoration */}
                          <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                            <div className="w-6 h-6 bg-gradient-to-r from-ocean-blue to-marine-teal rounded-full animate-pulse"></div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="relative p-6 text-center">
                          <motion.h4
                            className="text-xl font-bold text-gray-900 mb-2 group-hover:text-ocean-blue transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                          >
                            {leader.name}
                          </motion.h4>

                          <p className="text-coral-accent font-semibold text-sm uppercase tracking-wide group-hover:text-marine-teal transition-colors duration-300">
                            {leader.position}
                          </p>

                          {/* Animated Underline */}
                          <div className="w-16 h-1 bg-gradient-to-r from-ocean-blue to-marine-teal mx-auto rounded-full mt-4 transform scale-0 group-hover:scale-100 transition-transform duration-500"></div>
                        </div>

                        {/* Hover Effects */}
                        <div className="absolute inset-0 border-2 border-ocean-blue/0 group-hover:border-ocean-blue/20 rounded-3xl transition-all duration-500"></div>

                        {/* Corner Accent */}
                        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-[30px] border-r-[30px] border-b-marine-teal/20 border-r-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>

                      {/* Shadow Effect */}
                      <div className="absolute inset-0 rounded-3xl shadow-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 transform translate-y-2 -z-10 bg-ocean-blue/10"></div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Gradient Fade Edges */}
              <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none"></div>
            </div>

            {/* Horizontal Journey Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-20"
            >
              <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                  Journey of Alashore Marine Group
                </h3>
                <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                  From 1997, in the past 24 years, we have come so far and the
                  journey has been amazing
                </p>
                <div className="w-24 h-1 bg-gradient-to-r from-ocean-blue to-marine-teal mx-auto rounded-full mt-6"></div>
              </div>

              {/* Horizontal Timeline with Progress Bar */}
              <div
                ref={timelineRef}
                className="relative h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50"
              >
                {/* Circular Progress Indicator */}
                <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-50">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                    {/* Background Circle */}
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="rgb(229, 231, 235)"
                        strokeWidth="6"
                        fill="none"
                        className="opacity-30"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        stroke="url(#progressGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="283"
                        strokeDashoffset="283"
                        className="timeline-progress-fill transition-all duration-500 ease-out"
                      />
                      <defs>
                        <linearGradient
                          id="progressGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="0%"
                        >
                          <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                          <stop offset="50%" stopColor="rgb(6, 182, 212)" />
                          <stop offset="100%" stopColor="rgb(239, 68, 68)" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Current Milestone Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="timeline-current-icon w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 border-2 border-gray-200">
                        🏗️
                      </div>
                    </div>

                    {/* Current Year */}
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-sm font-bold text-gray-700 bg-white px-3 py-1 rounded-full shadow-md timeline-current-year border border-gray-200">
                      1997
                    </div>

                    {/* Progress Percentage */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-600 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm timeline-progress-percentage">
                      0%
                    </div>
                  </div>
                </div>

                {/* Horizontal Scrolling Cards */}
                <div className="timeline-cards absolute top-16 left-0 w-max h-full flex">
                  {[
                    {
                      year: "1997",
                      title: "Foundation Year",
                      description:
                        "Started our journey in the seafood industry with a vision to become a leading exporter",
                      icon: "🏗️",
                      color: "from-blue-500 to-cyan-500",
                      achievements: [
                        "Established Company",
                        "First Processing Unit",
                        "Local Market Entry",
                      ],
                    },
                    {
                      year: "2000-2005",
                      title: "Growth Phase",
                      description:
                        "Expanded operations and improved processing capabilities to meet international standards",
                      icon: "📈",
                      color: "from-green-500 to-teal-500",
                      achievements: [
                        "Quality Certifications",
                        "Process Upgrades",
                        "Team Expansion",
                      ],
                    },
                    {
                      year: "2009",
                      title: "Balasore Marine Exports Pvt. Ltd.",
                      description:
                        "Established operations with focus on Asian markets including China, Vietnam, and UAE",
                      icon: "🌏",
                      color: "from-purple-500 to-pink-500",
                      achievements: [
                        "Asian Market Entry",
                        "Export License",
                        "International Standards",
                      ],
                    },
                    {
                      year: "2012",
                      title: "Alashore Marine Exports Pvt. Ltd.",
                      description:
                        "Expanded globally to USA, EU, Canada, Malaysia, Japan, and Mauritius with premium quality standards",
                      icon: "🚀",
                      color: "from-orange-500 to-red-500",
                      achievements: [
                        "Global Expansion",
                        "Premium Quality",
                        "Multiple Certifications",
                      ],
                    },
                    {
                      year: "2015-2020",
                      title: "Excellence Era",
                      description:
                        "Achieved industry recognition and expanded product portfolio with sustainable practices",
                      icon: "🏆",
                      color: "from-yellow-500 to-orange-500",
                      achievements: [
                        "Industry Awards",
                        "Sustainable Practices",
                        "Product Innovation",
                      ],
                    },
                    {
                      year: "2021-Present",
                      title: "Future Forward",
                      description:
                        "Leading with innovation, technology, and commitment to quality in the global seafood market",
                      icon: "🌟",
                      color: "from-indigo-500 to-purple-500",
                      achievements: [
                        "Technology Integration",
                        "Market Leadership",
                        "Innovation Hub",
                      ],
                    },
                  ].map((milestone, index) => (
                    <div
                      key={milestone.year}
                      className="timeline-card flex-shrink-0 w-screen h-full flex items-center justify-center px-8 sm:px-12 lg:px-16"
                    >
                      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-16 items-center">
                        {/* Content Side */}
                        <div className="space-y-2 sm:space-y-3 order-2 lg:order-1">
                          <div
                            className={`inline-block bg-gradient-to-r ${milestone.color} text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg`}
                          >
                            {milestone.year}
                          </div>

                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-gray-900 leading-tight">
                            {milestone.title}
                          </h3>

                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            {milestone.description}
                          </p>

                          {/* Achievements */}
                          <div className="space-y-2">
                            <h4 className="text-ocean-blue text-sm font-semibold uppercase tracking-wider">
                              Key Achievements
                            </h4>
                            <div className="grid gap-2">
                              {milestone.achievements.map((achievement, i) => (
                                <div
                                  key={achievement}
                                  className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
                                >
                                  <div
                                    className={`w-3 h-3 bg-gradient-to-r ${milestone.color} rounded-full flex-shrink-0`}
                                  ></div>
                                  <span className="text-gray-700 font-medium text-sm">
                                    {achievement}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Visual Side */}
                        <div className="flex items-center justify-center order-1 lg:order-2 mb-4 lg:mb-0">
                          <div
                            className={`timeline-icon relative w-28 h-28 sm:w-36 sm:h-36 lg:w-48 lg:h-48 bg-gradient-to-br ${milestone.color} rounded-full flex items-center justify-center shadow-2xl group`}
                          >
                            <div className="timeline-main-icon text-2xl sm:text-3xl lg:text-5xl transition-transform duration-300 group-hover:scale-110">
                              {milestone.icon}
                            </div>

                            {/* Floating elements */}
                            <div className="absolute inset-0 rounded-full">
                              {[...Array(8)].map((_, i) => (
                                <div
                                  key={i}
                                  className="absolute w-2 h-2 sm:w-3 sm:h-3 bg-white/30 rounded-full animate-float"
                                  style={{
                                    top: `${20 + Math.sin((i * 45 * Math.PI) / 180) * 35}%`,
                                    left: `${50 + Math.cos((i * 45 * Math.PI) / 180) * 40}%`,
                                    animationDelay: `${i * 0.3}s`,
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scroll Hint */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="flex items-center space-x-2 text-gray-600 text-sm bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                    <span>Scroll horizontally to explore timeline</span>
                    <div className="w-2 h-2 bg-ocean-blue rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Business Evolution Section */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
                Our Global Presence
              </h3>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-12">
                Connecting oceans worldwide - Discover how our premium seafood
                reaches tables across continents through our extensive global
                network
              </p>
            </motion.div>

            {/* Interactive Global Map */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="mb-16"
            >
              <InteractiveGlobalMap />
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center bg-gradient-to-r from-ocean-blue to-marine-teal text-white p-12 rounded-xl"
            >
              <h3 className="text-3xl font-bold mb-4">
                Discover Fresh Flavors - Order Your Premium Seafood Today!
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Explore our exquisite selection of freshly caught seafood,
                sourced from the world's finest waters. Order now to experience
                the taste of quality and sustainability!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsContactModalOpen(true)}
                className="bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                data-testid="button-about-get-in-touch"
              >
                GET IN TOUCH
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />

      <ContactFormModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
