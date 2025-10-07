import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Leaf,
  Droplets,
  Recycle,
  Shield,
  Factory,
  Truck,
  Users,
  Zap,
  Thermometer,
  FlaskConical,
  Award,
  Car,
  Package,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactFormModal from "@/components/contact-form-modal";
import { useRef, useState } from "react";
import sustainabilityBg from "@assets/generated_images/Sustainable_aquaculture_ocean_background_50127a79.png";
import processingFacilityImg from "@assets/generated_images/Seafood_processing_facility_interior_25ca1780.png";
import transportFleetImg from "@assets/generated_images/Refrigerated_seafood_transport_fleet_da6483c0.png";
import compressionSystemImg from "@assets/generated_images/Industrial_compression_systems_facility_06113571.png";
import plantFacilityImg from "@assets/4-1 (1)_1756901765521.png";
import qualityLabImg from "@assets/qa_1759821463123.png";
import productionCapacityImg from "@assets/production1_1759821485619.png";
import aquacultureFarmImg from "@assets/farm1_1759821524383.jpg";
// Customer Logo Imports
import azureLogo from "@assets/AZURE_1755944927383.png";
import costarLogo from "@assets/Costar_1755944927383.png";
import geishaLogo from "@assets/GEISHA_1755944927383.png";
import genseaLogo from "@assets/GENSEA_1755944927383.png";
import goldenBayLogo from "@assets/Golden-bay_1755944927383.png";
import seastarLogo from "@assets/Seastar_1755944927383.png";
import selectLogo from "@assets/SELECT_1755944927384.png";
// Certification Logo Imports
import fssaiLogo from "@assets/pngegg_1756202338499.png";
import bapLogo from "@assets/BAP-Logo-2_1756201576811.png";
import haccpLogo from "@assets/steptodown.com594892_1756202338499.png";
import fdaLogo from "@assets/unnamed_1756201576811.png";

export default function Sustainability() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const parallaxOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.3, 1, 0.3],
  );
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(parallaxY, springConfig);

  const infrastructureFeatures = [
    {
      icon: Factory,
      title: "Plant Facilities",
      description:
        "Our processing plant spans 87120 square feet with state-of-the-art facilities designed for optimal productivity and sustainability.",
      stats: "87120 Sq Ft Plant Area",
      backgroundImage: plantFacilityImg,
      details: [
        "87120 square feet processing plant area",
        "Separate boarding facilities",
        "Boys capacity: 120",
        "Girls capacity: 500",
      ],
    },
    {
      icon: Zap,
      title: "Compression Systems",
      description:
        "Advanced Kirloskar compressor systems ensuring optimal performance and energy efficiency across our operations.",
      stats: "6 Compressor Units",
      backgroundImage: compressionSystemImg,
      details: [
        "3x KC 7/2 - 9 Piston, 150HP Motor",
        "2x KC 4/2 - 6 Piston, 100HP Motor",
        "1x KC 4 - 4 Piston, 150HP Motor",
        "Total capacity: 6 units",
      ],
    },
  ];

  const processingDetails = [
    {
      icon: FlaskConical,
      title: "Quality Control Laboratory",
      description:
        "In-House EIA APPROVED Quality Certification Laboratory equipped with state-of-art modern machinery and highly trained technical staff.",
      backgroundImage: qualityLabImg,
      details: [
        "EIA approved certification",
        "Experienced certified chemists and technologists",
        "Zero shipment rejections in quality tests",
        "Monitoring at each processing stage",
        "Microbiological analysis of water/ice",
        "Highest bio-security standards",
      ],
    },
    {
      icon: Thermometer,
      title: "Production Capacity",
      description:
        "Advanced IQF systems and cold storage facilities ensuring optimal preservation and processing capabilities.",
      backgroundImage: productionCapacityImg,
      details: [
        "CFTECH IQF: 12 MT/18 Hrs",
        "Marel IQF: 8MT/18 Hrs",
        "Chilling Room: 3 MT capacity",
        "Cold Store: 250 MT each (2 units)",
        "Production Capacity: 20MT/Day",
        "Flake Ice: 10MT/Day",
        "Tube Ice: 40MT/Day",
      ],
    },
  ];

  const aquaculturePractices = [
    {
      icon: Droplets,
      title: "Sustainable Farming",
      description:
        "Shrimp farming in Balasore and surrounding districts with bio-security measures and on-site labs for better quality output.",
      details: [
        "Farms in Balasore, Bhadrak, and Jagatsinghpur",
        "Located 10-200 km from processing plant",
        "Bio-security measures implemented",
        "On-site labs with qualified personnel",
        "Seeds & feeds from BAP Certified sources",
        "Focus on farmer sustainability",
      ],
    },
  ];

  const transportationFleet = [
    {
      icon: Truck,
      title: "Local Transportation Fleet",
      description:
        "Comprehensive fleet of vehicles ensuring efficient and reliable transportation of products from farm to processing facility.",
      details: [
        "11x Bharat Benz 1617",
        "4x Ashok Leyland 1212 Ecomet",
        "2x Mahindra Pickup",
        "Temperature-controlled transport",
        "Efficient route optimization",
      ],
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative">
      <Header onEnquiryClick={() => setIsContactModalOpen(true)} />
      <main>
        {/* Hero Section with Parallax */}
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${sustainabilityBg})`,
              filter: "brightness(0.3) contrast(1.1)",
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-marine-teal/80 to-ocean-blue/75" />
          <motion.div
            style={{ y, opacity: parallaxOpacity }}
            className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center"
            >
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="text-5xl md:text-7xl font-heading font-bold mb-8"
              >
                Sustainable Operations
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="text-xl md:text-2xl text-light-marine max-w-4xl mx-auto leading-relaxed"
              >
                Alashore Marine provides an overview of our state-of-the-art
                facilities, sustainable practices, and commitment to quality
                from infrastructure to transportation.
              </motion.p>
            </motion.div>
          </div>
          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 right-10 w-24 h-24 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 left-10 w-16 h-16 bg-coral-accent/20 rounded-full backdrop-blur-sm"
          />
        </section>

        {/* Infrastructure Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-light-marine/10 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.h2
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6"
              >
                Alashore Marine Infrastructure
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Provides an overview of the company's facilities and resources
              </motion.p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16">
              {infrastructureFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -60 : 60,
                    scale: 0.9,
                  }}
                  whileInView={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    duration: 1.2,
                    delay: index * 0.3,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.3 },
                  }}
                  className="group relative bg-gradient-to-br from-white to-light-marine/20 p-10 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
                  style={{
                    backgroundImage: `url(${feature.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Background overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/75 via-ocean-blue/70 to-marine-teal/75" />

                  <div className="relative z-10 flex items-center mb-8">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.8 }}
                      className="w-20 h-20 bg-gradient-to-br from-ocean-blue to-marine-teal rounded-2xl flex items-center justify-center mr-6 shadow-lg"
                    >
                      <feature.icon className="text-white" size={36} />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-heading font-semibold text-white mb-2 drop-shadow-lg">
                        {feature.title}
                      </h3>
                      <span className="text-coral-accent font-semibold text-lg drop-shadow-lg">
                        {feature.stats}
                      </span>
                    </div>
                  </div>
                  <p className="relative z-10 text-gray-200 mb-8 text-lg leading-relaxed drop-shadow-lg">
                    {feature.description}
                  </p>
                  <div className="relative z-10 space-y-4">
                    {feature.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-white bg-white/20 backdrop-blur-md p-3 rounded-lg border border-white/30"
                      >
                        <div className="w-3 h-3 bg-gradient-to-r from-marine-teal to-ocean-blue rounded-full mr-4 shadow-sm"></div>
                        <span className="text-lg drop-shadow">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Processing Section */}
        <section className="py-24 bg-gradient-to-br from-ocean-blue to-marine-teal text-white relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                Our Processing Plant
              </h2>
              <p className="text-xl text-light-marine max-w-4xl mx-auto leading-relaxed">
                Our processing plant follows several food guidelines to ensure
                freshest shrimps are provided to customers by evaluating
                quality, performing antibiotic tests, microbiological tests,
                water and ice quality tests among other tests.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-16">
              {processingDetails.map((detail, index) => (
                <motion.div
                  key={detail.title}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 1,
                    delay: index * 0.3,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                  className="relative bg-white/10 backdrop-blur-md p-10 rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${detail.backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Background overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-ocean-blue/75 to-marine-teal/80" />

                  <div className="relative z-10 flex items-center mb-8">
                    <div className="w-20 h-20 bg-white/30 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-6 border border-white/20">
                      <detail.icon className="text-white" size={36} />
                    </div>
                    <h3 className="text-3xl font-heading font-semibold text-white drop-shadow-lg">
                      {detail.title}
                    </h3>
                  </div>
                  <p className="relative z-10 text-gray-200 mb-8 text-lg leading-relaxed drop-shadow-lg">
                    {detail.description}
                  </p>
                  <div className="relative z-10 grid gap-4">
                    {detail.details.map((item, itemIndex) => (
                      <motion.div
                        key={itemIndex}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-white bg-white/20 backdrop-blur-md p-3 rounded-lg border border-white/20"
                      >
                        <div className="w-2 h-2 bg-coral-accent rounded-full mr-4"></div>
                        <span className="text-lg drop-shadow">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Aquaculture Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-light-marine/10 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
                Our Aquaculture
              </h2>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto">
                Describes the company's aquaculture practices and commitment to
                sustainability
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {aquaculturePractices.map((practice, index) => (
                <motion.div
                  key={practice.title}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative bg-gradient-to-br from-white to-light-marine/20 p-12 rounded-3xl shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${aquacultureFarmImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Background overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-ocean-blue/75 to-marine-teal/80" />

                  <div className="relative z-10 flex items-center mb-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-ocean-blue to-marine-teal rounded-3xl flex items-center justify-center mr-8 shadow-lg">
                      <practice.icon className="text-white" size={44} />
                    </div>
                    <h3 className="text-4xl font-heading font-semibold text-white drop-shadow-lg">
                      {practice.title}
                    </h3>
                  </div>
                  <p className="relative z-10 text-gray-200 mb-10 text-xl leading-relaxed drop-shadow-lg">
                    {practice.description}
                  </p>
                  <div className="relative z-10 grid md:grid-cols-2 gap-6">
                    {practice.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: detailIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-white bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 min-h-[60px]"
                      >
                        <div className="w-4 h-4 bg-gradient-to-r from-marine-teal to-ocean-blue rounded-full mr-4 shadow-sm"></div>
                        <span className="text-lg">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Transportation Section */}
        <section className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                Our Transportation
              </h2>
              <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                Explains the transportation methods and logistics involved in
                exporting seafood
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {transportationFleet.map((fleet, index) => (
                <motion.div
                  key={fleet.title}
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="relative bg-white/10 backdrop-blur-md p-12 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${transportFleetImg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Background overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-ocean-blue/75 to-marine-teal/80" />

                  <div className="relative z-10 flex items-center mb-10">
                    <div className="w-24 h-24 bg-white/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mr-8 border border-white/20">
                      <fleet.icon className="text-white" size={44} />
                    </div>
                    <div>
                      <h3 className="text-4xl font-heading font-semibold mb-2 text-white drop-shadow-lg">
                        {fleet.title}
                      </h3>
                      <span className="text-coral-accent text-lg font-medium drop-shadow-lg">
                        For Local Transportation
                      </span>
                    </div>
                  </div>
                  <p className="relative z-10 text-gray-200 mb-10 text-xl leading-relaxed drop-shadow-lg">
                    {fleet.description}
                  </p>
                  <div className="relative z-10 grid md:grid-cols-2 gap-6">
                    {fleet.details.map((detail, detailIndex) => (
                      <motion.div
                        key={detailIndex}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: detailIndex * 0.1 }}
                        viewport={{ once: true }}
                        className="flex items-center text-white bg-white/20 backdrop-blur-md p-4 rounded-xl border border-white/30 min-h-[60px]"
                      >
                        <Car className="text-coral-accent mr-4" size={20} />
                        <span className="text-lg drop-shadow">{detail}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-24 bg-gradient-to-br from-light-marine to-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
                Our Accreditations
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Quality certifications and standards that define our commitment
                to excellence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* FSSAI Certification - Golden Badge */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.8, rotateY: 180 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                whileHover={{
                  y: -15,
                  scale: 1.08,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(255,215,0,0.4)",
                }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="relative overflow-hidden text-center group cursor-pointer"
              >
                {/* Golden Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-3xl shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/20 via-transparent to-yellow-200/30 rounded-3xl" />

                {/* Golden Border Ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-yellow-200/50"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,215,0,0.3)",
                      "0 0 40px rgba(255,215,0,0.6)",
                      "0 0 20px rgba(255,215,0,0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Sparkle Effects */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-8 left-6 w-1.5 h-1.5 bg-yellow-100 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />

                <div className="relative p-8 z-10">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <div className="bg-white/95 rounded-full p-3 shadow-lg">
                      <img
                        src={fssaiLogo}
                        alt="FSSAI Certification"
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-yellow-900 mb-3 drop-shadow-sm">
                    FSSAI Certified
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed font-medium">
                    Food Safety and Standards Authority of India certification
                    ensuring highest food safety standards.
                  </p>
                </div>
              </motion.div>

              {/* BAP Certification - Golden Badge */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.8, rotateY: 180 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                whileHover={{
                  y: -15,
                  scale: 1.08,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(255,215,0,0.4)",
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="relative overflow-hidden text-center group cursor-pointer"
              >
                {/* Golden Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-3xl shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/20 via-transparent to-yellow-200/30 rounded-3xl" />

                {/* Golden Border Ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-yellow-200/50"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,215,0,0.3)",
                      "0 0 40px rgba(255,215,0,0.6)",
                      "0 0 20px rgba(255,215,0,0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                />

                {/* Sparkle Effects */}
                <motion.div
                  className="absolute top-6 right-8 w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />

                <div className="relative p-8 z-10">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <div className="bg-white/95 rounded-full p-3 shadow-lg">
                      <img
                        src={bapLogo}
                        alt="BAP Best Aquaculture Practices Certification"
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-yellow-900 mb-3 drop-shadow-sm">
                    BAP Certified
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed font-medium">
                    Best Aquaculture Practices certification for sustainable and
                    responsible seafood production.
                  </p>
                </div>
              </motion.div>

              {/* HACCP Certification - Golden Badge */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.8, rotateY: 180 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                whileHover={{
                  y: -15,
                  scale: 1.08,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(255,215,0,0.4)",
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="relative overflow-hidden text-center group cursor-pointer"
              >
                {/* Golden Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-3xl shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/20 via-transparent to-yellow-200/30 rounded-3xl" />

                {/* Golden Border Ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-yellow-200/50"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,215,0,0.3)",
                      "0 0 40px rgba(255,215,0,0.6)",
                      "0 0 20px rgba(255,215,0,0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                />

                {/* Sparkle Effects */}
                <motion.div
                  className="absolute top-8 right-6 w-1.5 h-1.5 bg-yellow-100 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                />

                <div className="relative p-8 z-10">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <div className="bg-white/95 rounded-full p-3 shadow-lg">
                      <img
                        src={haccpLogo}
                        alt="HACCP Food Safety Certification"
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-yellow-900 mb-3 drop-shadow-sm">
                    HACCP Certified
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed font-medium">
                    Hazard Analysis Critical Control Points system ensuring food
                    safety at every production stage.
                  </p>
                </div>
              </motion.div>

              {/* FDA Approval - Golden Badge */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.8, rotateY: 180 }}
                whileInView={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                whileHover={{
                  y: -15,
                  scale: 1.08,
                  rotateY: 5,
                  boxShadow: "0 25px 50px rgba(255,215,0,0.4)",
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100,
                }}
                viewport={{ once: true }}
                className="relative overflow-hidden text-center group cursor-pointer"
              >
                {/* Golden Background with Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-3xl shadow-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-600/20 via-transparent to-yellow-200/30 rounded-3xl" />

                {/* Golden Border Ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-yellow-200/50"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,215,0,0.3)",
                      "0 0 40px rgba(255,215,0,0.6)",
                      "0 0 20px rgba(255,215,0,0.3)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.5,
                  }}
                />

                {/* Sparkle Effects */}
                <motion.div
                  className="absolute top-6 left-8 w-2 h-2 bg-white rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                />

                <div className="relative p-8 z-10">
                  <motion.div
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{
                      rotate: 360,
                      scale: 1.1,
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <div className="bg-white/95 rounded-full p-3 shadow-lg">
                      <img
                        src={fdaLogo}
                        alt="FDA Approved"
                        className="w-full h-full object-contain filter drop-shadow-md"
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-yellow-900 mb-3 drop-shadow-sm">
                    FDA Approved
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed font-medium">
                    US Food and Drug Administration approval for safe export to
                    American markets.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Global Customer Base */}
        <section className="py-24 bg-gradient-to-br from-ocean-blue to-marine-teal text-white relative overflow-hidden">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute top-10 right-10 w-40 h-40 bg-white/5 rounded-full backdrop-blur-sm"
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-heading font-bold mb-8"
              >
                90+ Customers Globally
              </motion.h2>
              <p className="text-xl text-light-marine max-w-3xl mx-auto leading-relaxed">
                Trusted by leading brands worldwide for our commitment to
                quality, sustainability, and reliable supply chain management.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
              >
                <div className="text-5xl md:text-6xl font-bold text-coral-accent mb-4">
                  90+
                </div>
                <p className="text-light-marine text-lg font-medium">
                  Global Customers
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "backOut" }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
              >
                <div className="text-5xl md:text-6xl font-bold text-coral-accent mb-4">
                  20MT
                </div>
                <p className="text-light-marine text-lg font-medium">
                  Daily Production
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "backOut" }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
              >
                <div className="text-5xl md:text-6xl font-bold text-coral-accent mb-4">
                  1500MT
                </div>
                <p className="text-light-marine text-lg font-medium">
                  Cold Storage
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3, ease: "backOut" }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
              >
                <div className="text-5xl md:text-6xl font-bold text-coral-accent mb-4">
                  17
                </div>
                <p className="text-light-marine text-lg font-medium">
                  Fleet Vehicles
                </p>
              </motion.div>
            </div>

            {/* Brand Logos */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-20"
            >
              <p className="text-center text-light-marine mb-12 text-lg">
                Trusted by leading global seafood brands
              </p>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-8 items-center">
                {[
                  { name: "SEASTAR", img: seastarLogo },
                  { name: "COSTAR", img: costarLogo },
                  { name: "GEISHA", img: geishaLogo },
                  { name: "SELECT", img: selectLogo },
                  { name: "GOLDEN BAY", img: goldenBayLogo },
                  { name: "AZURE", img: azureLogo },
                  { name: "GENSEA", img: genseaLogo },
                ].map((brand, index) => (
                  <motion.div
                    key={brand.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.1,
                      y: -5,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      },
                    }}
                    className="bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-white/30 flex items-center justify-center h-20 hover:shadow-2xl transition-all duration-300"
                    data-testid={`logo-${brand.name.toLowerCase().replace(" ", "-")}`}
                  >
                    <img
                      src={brand.img}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain filter brightness-90 hover:brightness-100 transition-all duration-300"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-24 relative overflow-hidden text-white">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${sustainabilityBg})`,
              filter: "brightness(0.3) contrast(1.1)",
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-gray-900/90" />

          {/* Background Animation Elements */}
          <motion.div
            animate={{
              x: [0, 100, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm"
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                At Alashore Marine - we care about our People, our Products &
                the Farmers. These are the core values we demonstrate in our
                actions.
              </p>
            </motion.div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* People Value Card */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative bg-white/10 backdrop-blur-md p-8 lg:p-12 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                data-testid="value-people"
              >
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start mb-8 lg:mb-10">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 lg:mr-8 border border-white/20">
                    <Users className="text-white" size={40} />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl lg:text-4xl font-heading font-semibold mb-2 text-white drop-shadow-lg">
                      Our People
                    </h3>
                    <span className="text-coral-accent text-base lg:text-lg font-medium drop-shadow-lg">
                      Team Excellence
                    </span>
                  </div>
                </div>
                <p className="relative z-10 text-gray-200 mb-8 lg:mb-10 text-lg lg:text-xl leading-relaxed drop-shadow-lg text-center sm:text-left">
                  We believe our team is our greatest asset. We invest in their
                  growth, well-being, and professional development to create a
                  thriving workplace culture.
                </p>
                <div className="relative z-10 grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Award className="text-white" size={28} />
                    </div>
                    <span className="text-sm sm:text-base text-white drop-shadow font-medium">
                      Professional Development
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Users className="text-white" size={28} />
                    </div>
                    <span className="text-sm sm:text-base text-white drop-shadow font-medium">
                      Workplace Culture
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Products Value Card */}
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="relative bg-white/10 backdrop-blur-md p-8 lg:p-12 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                data-testid="value-products"
              >
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start mb-8 lg:mb-10">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 lg:mr-8 border border-white/20">
                    <Package className="text-white" size={40} />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl lg:text-4xl font-heading font-semibold mb-2 text-white drop-shadow-lg">
                      Our Products
                    </h3>
                    <span className="text-coral-accent text-base lg:text-lg font-medium drop-shadow-lg">
                      Quality Excellence
                    </span>
                  </div>
                </div>
                <p className="relative z-10 text-gray-200 mb-8 lg:mb-10 text-lg lg:text-xl leading-relaxed drop-shadow-lg text-center sm:text-left">
                  Quality is our cornerstone. Every product meets the highest
                  international standards through rigorous testing and quality
                  control processes.
                </p>
                <div className="relative z-10 grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Shield className="text-white" size={28} />
                    </div>
                    <span className="text-sm sm:text-base text-white drop-shadow font-medium">
                      International Standards
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <FlaskConical className="text-white" size={28} />
                    </div>
                    <span className="text-sm sm:text-base text-white drop-shadow font-medium">
                      Quality Control
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Farmers Value Card */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                viewport={{ once: true }}
                className="relative bg-white/10 backdrop-blur-md p-8 lg:p-12 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
                data-testid="value-farmers"
              >
                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start mb-8 lg:mb-10">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-white/30 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-4 sm:mb-0 sm:mr-6 lg:mr-8 border border-white/20">
                    <Droplets className="text-white" size={40} />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-2xl lg:text-4xl font-heading font-semibold mb-2 text-white drop-shadow-lg">
                      Our Farmers
                    </h3>
                    <span className="text-coral-accent text-base lg:text-lg font-medium drop-shadow-lg">
                      Partnership Excellence
                    </span>
                  </div>
                </div>
                <p className="relative z-10 text-gray-200 mb-8 lg:mb-10 text-lg lg:text-xl leading-relaxed drop-shadow-lg text-center sm:text-left">
                  We support sustainable farming practices and farmer
                  development through partnerships, training, and fair business
                  relationships.
                </p>
                <div className="relative z-10 grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Leaf className="text-white" size={28} />
                    </div>
                    <span className="text-sm sm:text-base text-white drop-shadow font-medium">
                      Sustainable Practices
                    </span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                      <Users className="text-white" size={28} />
                    </div>
                    <span className="text-sm sm:text-base text-white drop-shadow font-medium">
                      Fair Partnerships
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-br from-marine-teal via-ocean-blue to-gray-800 text-white relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5,
            }}
            className="absolute bottom-0 right-0 w-80 h-80 bg-coral-accent/20 rounded-full backdrop-blur-sm"
          />

          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-5xl md:text-7xl font-heading font-bold mb-8"
              >
                Partner with Excellence
              </motion.h2>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl text-light-marine mb-12 max-w-4xl mx-auto leading-relaxed"
              >
                Join the ranks of 90+ global customers who trust Alashore Marine
                for premium seafood with uncompromising quality, sustainability,
                and reliability.
              </motion.p>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/contact")}
                className="bg-coral-accent hover:bg-golden-orange text-white px-12 py-6 rounded-2xl text-xl font-bold transition-all duration-300 shadow-2xl hover:shadow-coral-accent/30"
              >
                Start Partnership
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
