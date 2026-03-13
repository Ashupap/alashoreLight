import { motion } from "framer-motion";
import { Star, User, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import type { Testimonial } from "@shared/schema";
import { STATIC_TESTIMONIALS } from "@/data/testimonials";

export default function Testimonials() {
  const isLoading = false;
  const testimonials = STATIC_TESTIMONIALS;

  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  // Only show testimonials from database
  const displayTestimonials = testimonials || [];

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex(prev =>
        prev === displayTestimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [displayTestimonials.length]);

  const currentTestimonial = displayTestimonials[currentTestimonialIndex];

  return (
    <section className="py-0 relative min-h-[500px] overflow-hidden">
      <div className="grid lg:grid-cols-2 min-h-[500px]">
        {/* Left Side - Teal Background with Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-teal-500 px-8 py-16 lg:px-16 lg:py-20 flex flex-col justify-center relative"
        >
          <Quote size={64} className="text-white/30 mb-8" />
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Don't just take our word for it
          </h2>
          <p className="text-white/90 text-lg leading-relaxed mb-8">
            Witness it first hand, directly from our lovely customers
          </p>

        </motion.div>

        {/* Right Side - White Background with Centered Card */}
        <div className="bg-white flex items-center justify-center p-8 lg:p-16">
          {isLoading ? (
            <div className="w-full max-w-md h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : displayTestimonials.length === 0 ? (
            <div className="w-full max-w-md text-center p-8">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No testimonials available yet.</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            <motion.div
              key={currentTestimonialIndex}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: [0, -8, 0],
                scale: [1, 1.02, 1],
                rotate: [0, 1, -1, 0]
              }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{
                opacity: { duration: 0.8 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              whileHover={{
                y: -15,
                scale: 1.05,
                rotate: 2,
                boxShadow: "0 35px 60px rgba(0,0,0,0.2), 0 15px 40px rgba(0,0,0,0.15)",
                transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 20 }
              }}
              className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 lg:p-10 rounded-lg shadow-[0_15px_35px_rgba(0,0,0,0.1)] max-w-md w-full border border-teal-100 transform-gpu"
            >
              {/* Display current testimonial */}
              {currentTestimonial && (
                <>
                  {/* Animated Stars Rating */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="flex gap-1 mb-6"
                  >
                    {[...Array(5)].map((_, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0, rotate: -180 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: 0.5 + index * 0.1,
                          type: "spring",
                          stiffness: 200
                        }}
                        viewport={{ once: true }}
                        whileHover={{
                          scale: 1.3,
                          rotate: 360,
                          transition: { duration: 0.3 }
                        }}
                      >
                        <Star
                          className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-sm"
                        />
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Testimonial Quote with enhanced styling */}
                  <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8 italic relative"
                  >
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -left-2 -top-2 text-4xl text-teal-200 font-serif"
                    >
                      "
                    </motion.span>
                    <span className="relative z-10">{currentTestimonial.content}</span>
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                      className="absolute -right-2 -bottom-2 text-4xl text-teal-200 font-serif"
                    >
                      "
                    </motion.span>
                  </motion.blockquote>

                  {/* Customer Info with enhanced animations */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-4"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-teal-100 shadow-lg"
                    >
                      {currentTestimonial.avatar ? (
                        <img
                          src={currentTestimonial.avatar}
                          alt={currentTestimonial.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <motion.div
                          whileHover={{ scale: 1.2 }}
                          className="w-full h-full bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center"
                        >
                          <User className="text-teal-600" size={20} />
                        </motion.div>
                      )}
                    </motion.div>

                    <div>
                      <motion.h4
                        whileHover={{ scale: 1.05 }}
                        className="font-bold text-gray-900 text-lg mb-1 cursor-default"
                      >
                        {currentTestimonial.name}
                      </motion.h4>
                      <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                        viewport={{ once: true }}
                        className="text-gray-400 text-sm font-medium uppercase tracking-wide"
                      >
                        {currentTestimonial.company || 'VALUED CUSTOMER'}
                      </motion.p>
                    </div>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
