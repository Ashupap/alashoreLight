import { useParams } from "wouter";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { BookOpen, Calendar, User, Eye } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactFormModal from "@/components/contact-form-modal";
import BlogPostCard from "@/components/blog/blog-post-card";
import { formatDistanceToNow } from "date-fns";
import blogBg from "@assets/generated_images/Blog_page_hero_background_995e7f81.png";
import { STATIC_BLOGS } from "@/data/blogs";

export default function Blog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(parallaxY, springConfig);

  const { slug } = useParams();

  const posts = STATIC_BLOGS;
  const post = slug ? STATIC_BLOGS.find(p => p.slug === slug) : null;
  const postsLoading = false;
  const postLoading = false;

  if (slug && post) {
    return (
      <div className="min-h-screen bg-background relative">
        <Header onEnquiryClick={() => setIsContactModalOpen(true)} />
        <main>
          <article className="container mx-auto px-4 py-24 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-12 md:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <Calendar className="mr-2" size={16} />
                    <span>{formatDistanceToNow(new Date((post as any).createdAt!))} ago</span>
                    <span className="mx-3">•</span>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="bg-gradient-to-r from-ocean-blue to-marine-teal text-white px-4 py-2 rounded-full text-xs font-semibold"
                    >
                      {(post as any).category}
                    </motion.span>
                  </div>
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-8 leading-tight"
                  >
                    {(post as any).title}
                  </motion.h1>
                  {(post as any).excerpt && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="text-xl md:text-2xl text-gray-600 leading-relaxed"
                    >
                      {(post as any).excerpt}
                    </motion.p>
                  )}
                </motion.div>

                {(post as any).featuredImage && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mb-12 rounded-2xl overflow-hidden shadow-2xl"
                  >
                    <img
                      src={(post as any).featuredImage}
                      alt={(post as any).title}
                      className="w-full h-96 md:h-[500px] object-cover"
                    />
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="prose prose-lg md:prose-xl max-w-none prose-headings:font-heading prose-headings:text-gray-900 prose-a:text-ocean-blue hover:prose-a:text-marine-teal"
                >
                  <div dangerouslySetInnerHTML={{ __html: (post as any).content }} />
                </motion.div>
              </div>
            </motion.div>
          </article>
        </main>
        <Footer />

        <ContactFormModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />
      </div>
    );
  }

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
              backgroundImage: `url(${blogBg})`,
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
              duration: 22,
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
              duration: 16,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 5
            }}
            className="absolute bottom-20 left-10 w-36 h-36 bg-coral-accent/20 rounded-full backdrop-blur-sm"
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
                <BookOpen className="text-coral-accent mr-2" size={20} />
                <span className="text-white/90 font-medium">Industry Insights</span>
              </motion.div>
              <motion.h1
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="text-6xl md:text-8xl font-heading font-bold mb-8"
              >
                Latest <span className="text-coral-accent">News</span>
                <br />& Insights
              </motion.h1>
              <motion.p
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-2xl text-light-marine max-w-4xl mx-auto leading-relaxed"
              >
                Stay updated with the latest news, industry insights, and stories from the world of sustainable seafood.
              </motion.p>
            </motion.div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-br from-light-marine/10 to-white relative overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-20 w-64 h-64 bg-marine-teal/10 rounded-full backdrop-blur-sm"
          />
          <div className="container mx-auto px-4 relative z-10">

            {postsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded mb-3"></div>
                      <div className="h-20 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts && Array.isArray(posts) && posts.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {posts.map((post: any, index: number) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    viewport={{ once: true }}
                    whileHover={{
                      y: -10,
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                    }}
                    className="group"
                  >
                    <BlogPostCard post={post} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center py-24 bg-gradient-to-br from-white to-light-marine/20 rounded-3xl border border-gray-100 backdrop-blur-md"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-8"
                >
                  <BookOpen size={64} className="text-gray-400 mx-auto" />
                </motion.div>
                <h3 className="text-2xl font-heading font-bold text-gray-600 mb-4">No blog posts available</h3>
                <p className="text-gray-500">Check back soon for the latest news and insights!</p>
              </motion.div>
            )}
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
