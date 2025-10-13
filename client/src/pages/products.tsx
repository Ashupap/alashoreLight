import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Package, Star, Award, Sparkles, Filter, Shield } from "lucide-react";
import { useRef, useState } from "react";
import { PerformanceImage } from "@/components/ui/performance-image";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactFormModal from "@/components/contact-form-modal";
import fssaiLogo from "@assets/pngegg_1756202338499.png";
import bapLogo from "@assets/BAP-Logo-2_1756201576811.png";
import haccpLogo from "@assets/steptodown.com594892_1756202338499.png";
import fdaLogo from "@assets/unnamed_1756201576811.png";
import productsBg from "@assets/generated_images/Products_page_hero_background_00e06eb6.png";

export default function Products() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(parallaxY, springConfig);

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products?published=true"],
  });

  // Default products data based on original website
  const defaultProducts = [
    {
      id: 1,
      name: "Frozen Peeled & Deveined Tail On IQF",
      description: "Premium quality individually quick frozen shrimp, peeled and deveined with tail on for optimal presentation. Perfect for restaurants and high-end culinary applications.",
      featuredImage: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "IQF Shrimp",
      specifications: "Sizes: 16/20, 21/25, 26/30, 31/40, 41/50 per lb\nPackaging: 2kg blocks, 6 blocks per carton\nShelf life: 24 months at -18°C"
    },
    {
      id: 2,
      name: "Frozen Peeled & Deveined Tail-off IQF",
      description: "Expertly processed shrimp with tails removed, perfect for quick cooking and preparation in various dishes. Ideal for ready-to-cook applications.",
      featuredImage: "https://images.unsplash.com/photo-1544943910-4c1dc44aab44?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "IQF Shrimp",
      specifications: "Sizes: 16/20, 21/25, 26/30, 31/40, 41/50 per lb\nPackaging: 2kg blocks, 6 blocks per carton\nShelf life: 24 months at -18°C"
    },
    {
      id: 3,
      name: "Raw Frozen Headless EZ Peel IQF",
      description: "Easy-to-peel headless shrimp, flash frozen to maintain freshness and quality for extended shelf life. Convenient for food service industry.",
      featuredImage: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "Raw Frozen",
      specifications: "Sizes: 16/20, 21/25, 26/30, 31/40, 41/50 per lb\nPackaging: 2kg blocks, 6 blocks per carton\nShelf life: 24 months at -18°C"
    },
    {
      id: 4,
      name: "Frozen Headless Shell-On",
      description: "Traditional shell-on shrimp, headless and frozen to preserve natural flavors and textures. Maintains authentic taste and appearance.",
      featuredImage: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "Shell-On",
      specifications: "Sizes: 16/20, 21/25, 26/30, 31/40, 41/50 per lb\nPackaging: 2kg blocks, 6 blocks per carton\nShelf life: 24 months at -18°C"
    },
    {
      id: 5,
      name: "Raw Frozen Peeled & Un-Deveined IQF",
      description: "Peeled but un-deveined shrimp for customers who prefer to prepare their seafood with maximum control over final preparation.",
      featuredImage: "https://images.unsplash.com/photo-1585032226651-4e875fb40b24?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "Raw Frozen",
      specifications: "Sizes: 16/20, 21/25, 26/30, 31/40, 41/50 per lb\nPackaging: 2kg blocks, 6 blocks per carton\nShelf life: 24 months at -18°C"
    },
    {
      id: 6,
      name: "Frozen Headless",
      description: "Whole headless shrimp, perfect for traditional cooking methods and authentic seafood preparations. Maintains full natural flavor profile.",
      featuredImage: "https://images.unsplash.com/photo-1563379091-20937a7886d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
      category: "Whole Shrimp",
      specifications: "Sizes: 16/20, 21/25, 26/30, 31/40, 41/50 per lb\nPackaging: 2kg blocks, 6 blocks per carton\nShelf life: 24 months at -18°C"
    }
  ];

  // Always prioritize database products over default products
  const allProducts = (products && Array.isArray(products) && products.length > 0) ? products : defaultProducts;
  
  // Sort products by order field (smaller first), then by id as fallback
  const sortedProducts = allProducts
    .slice()
    .sort((a, b) => {
      const orderA = a.order || 0;
      const orderB = b.order || 0;
      if (orderA !== orderB) return orderA - orderB;
      return a.id - b.id; // fallback to id if order is same
    });

  const categories = ["All", "HON/HL", "PD/PDTO", "PUD", "EZPL", "FISH"];
  const filteredProducts = selectedCategory === "All" 
    ? sortedProducts 
    : sortedProducts.filter(product => product.category === selectedCategory);

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative">
      <Header onEnquiryClick={() => setIsContactModalOpen(true)} />
      <main>
        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${productsBg})`,
              filter: 'brightness(0.3) contrast(1.1)'
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
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 right-10 w-48 h-48 bg-white/10 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{ 
              y: [0, -40, 0],
              x: [0, 30, 0]
            }}
            transition={{ 
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3
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
                <Package className="text-coral-accent mr-2" size={20} />
                <span className="text-white/90 font-medium">Premium Quality Products</span>
              </motion.div>
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="text-6xl md:text-8xl font-heading font-bold mb-8"
              >
                Premium <span className="text-coral-accent">Seafood</span>
                <br />Products
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-2xl text-light-marine max-w-4xl mx-auto leading-relaxed"
              >
                Experience top-quality seafood with Alashore Marine. Our carefully sourced and processed products 
                set new standards, offering delicious and sustainable choices in the seafood industry.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <motion.section 
          style={{ y: useTransform(scrollYProgress, [0.1, 0.3], [50, 0]) }}
          className="py-16 bg-gradient-to-br from-light-marine/20 to-white relative overflow-hidden"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <motion.h2
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6"
              >
                Browse Our Collection
              </motion.h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="w-24 h-1 bg-gradient-to-r from-coral-accent to-golden-orange mx-auto rounded-full mb-8"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4 mb-8"
            >
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 backdrop-blur-md border ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-coral-accent to-golden-orange text-white border-transparent shadow-lg"
                      : "bg-white/70 text-gray-700 border-gray-200 hover:bg-white/90 hover:border-coral-accent"
                  }`}
                >
                  <Filter className="inline mr-2" size={16} />
                  {category}
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Enhanced Products Grid */}
        <section className="py-24 bg-white relative overflow-hidden">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-64 h-64 bg-marine-teal/10 rounded-full backdrop-blur-sm"
          />
          <div className="container mx-auto px-4 relative z-10">
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-64 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-20 bg-gray-200 rounded mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -15, 
                      scale: 1.02,
                      boxShadow: "0 25px 60px rgba(0, 0, 0, 0.15)"
                    }}
                    className="group bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl border border-gray-100/50 backdrop-blur-md"
                  >
                    <div className="relative overflow-hidden">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-64 overflow-hidden"
                      >
                        <PerformanceImage
                          src={product.featuredImage && product.featuredImage.includes('unsplash') ? `${product.featuredImage}&q=85&w=800&h=600` : product.featuredImage || '/placeholder-product.jpg'}
                          alt={product.name}
                          className="w-full h-64 object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 3}
                        />
                      </motion.div>
                      <div className="absolute top-4 right-4 bg-ocean-blue text-white px-3 py-1 rounded-full text-sm">
                        {product.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {product.description}
                      </p>
                      {product.specifications && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Specifications:</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-line">
                            {product.specifications}
                          </p>
                        </div>
                      )}
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={() => {
                          setSelectedProduct(product.name);
                          setIsContactModalOpen(true);
                        }}
                        className="text-ocean-blue font-semibold hover:text-deep-navy transition-colors flex items-center"
                        data-testid={`button-inquire-${product.id}`}
                      >
                        Inquire Now <ArrowRight size={16} className="ml-1" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Quality Assurance Section */}
        <section className="py-20 bg-gradient-to-br from-light-marine to-white relative overflow-hidden">
          {/* Background Animation Elements */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.05, 0.15, 0.05]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 right-10 w-80 h-80 bg-ocean-blue/10 rounded-full backdrop-blur-sm"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.03, 0.08, 0.03]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-20 left-20 w-60 h-60 bg-marine-teal/10 rounded-full backdrop-blur-sm"
          />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-ocean-blue/20 mb-8"
              >
                <Award className="text-ocean-blue mr-2" size={20} />
                <span className="text-ocean-blue font-medium">Internationally Certified</span>
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                Quality Assurance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every product meets international quality standards with rigorous testing and certification from world-renowned authorities.
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
                  boxShadow: "0 25px 50px rgba(255,215,0,0.4)"
                }}
                transition={{ 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 100
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
                      "0 0 20px rgba(255,215,0,0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Sparkle Effects */}
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-white rounded-full"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div
                  className="absolute top-8 left-6 w-1.5 h-1.5 bg-yellow-100 rounded-full"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                
                <div className="relative p-8 z-10">
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <div className="bg-white/95 rounded-full p-3 shadow-lg">
                      <PerformanceImage
                        src={fssaiLogo}
                        alt="FSSAI Certification"
                        className="w-full h-full object-contain filter drop-shadow-md"
                        sizes="96px"
                        priority={false}
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-yellow-900 mb-3 drop-shadow-sm">
                    FSSAI Certified
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed font-medium">
                    Food Safety and Standards Authority of India certification ensuring highest food safety standards.
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
                  boxShadow: "0 25px 50px rgba(255,215,0,0.4)"
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.1,
                  type: "spring",
                  stiffness: 100
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
                      "0 0 20px rgba(255,215,0,0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                
                {/* Sparkle Effects */}
                <motion.div
                  className="absolute top-6 right-8 w-2 h-2 bg-white rounded-full"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
                
                <div className="relative p-8 z-10">
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <div className="bg-white/95 rounded-full p-3 shadow-lg">
                      <PerformanceImage
                        src={bapLogo}
                        alt="BAP Best Aquaculture Practices Certification"
                        className="w-full h-full object-contain filter drop-shadow-md"
                        sizes="96px"
                        priority={false}
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-yellow-900 mb-3 drop-shadow-sm">
                    BAP Certified
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed font-medium">
                    Best Aquaculture Practices certification for sustainable and responsible seafood production.
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
                  boxShadow: "0 25px 50px rgba(255,215,0,0.4)"
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.2,
                  type: "spring",
                  stiffness: 100
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
                      "0 0 20px rgba(255,215,0,0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                
                {/* Sparkle Effects */}
                <motion.div
                  className="absolute top-4 left-4 w-1.5 h-1.5 bg-yellow-100 rounded-full"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 2 }}
                />
                
                <div className="relative p-8 z-10">
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <div className="bg-white/95 rounded-full p-3 shadow-lg">
                      <PerformanceImage
                        src={haccpLogo}
                        alt="HACCP Food Safety Certification"
                        className="w-full h-full object-contain filter drop-shadow-md"
                        sizes="96px"
                        priority={false}
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-yellow-900 mb-3 drop-shadow-sm">
                    HACCP Certified
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed font-medium">
                    Hazard Analysis Critical Control Points system ensuring food safety at every production stage.
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
                  boxShadow: "0 25px 50px rgba(255,215,0,0.4)"
                }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.3,
                  type: "spring",
                  stiffness: 100
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
                      "0 0 20px rgba(255,215,0,0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
                
                {/* Sparkle Effects */}
                <motion.div
                  className="absolute top-6 left-8 w-2 h-2 bg-white rounded-full"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
                />
                
                <div className="relative p-8 z-10">
                  <motion.div 
                    className="w-24 h-24 mx-auto mb-6 flex items-center justify-center"
                    whileHover={{ 
                      rotate: 360,
                      scale: 1.1
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                  >
                    <div className="bg-white/95 rounded-full p-3 shadow-lg">
                      <PerformanceImage
                        src={fdaLogo}
                        alt="FDA Approved"
                        className="w-full h-full object-contain filter drop-shadow-md"
                        sizes="96px"
                        priority={false}
                      />
                    </div>
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-yellow-900 mb-3 drop-shadow-sm">
                    FDA Approved
                  </h3>
                  <p className="text-yellow-800 text-sm leading-relaxed font-medium">
                    US Food and Drug Administration approval for safe export to American markets.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Trust Statement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-r from-ocean-blue/10 to-marine-teal/10 backdrop-blur-md rounded-2xl p-8 border border-white/30 max-w-4xl mx-auto"
              >
                <div className="flex items-center justify-center mb-4">
                  <Shield className="text-ocean-blue mr-2" size={24} />
                  <h3 className="text-2xl font-heading font-bold text-gray-900">
                    Zero Quality Rejections
                  </h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our comprehensive quality control system and multiple certifications ensure that every shipment meets the highest international standards. We maintain a perfect track record with zero quality rejections from our global partners.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-ocean-blue to-deep-navy text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                Ready to Order Premium Seafood?
              </h2>
              <p className="text-xl text-light-marine mb-8 max-w-3xl mx-auto">
                Contact our sales team today to discuss your requirements and get a customized quote for our premium seafood products.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedProduct("");
                  setIsContactModalOpen(true);
                }}
                className="bg-coral-accent hover:bg-golden-orange text-white px-10 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
                data-testid="button-contact-sales"
              >
                Contact Sales Team
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />

      <ContactFormModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)}
        productName={selectedProduct}
      />
    </div>
  );
}