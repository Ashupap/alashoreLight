import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  MapPin, 
  Mail, 
  Phone, 
  Building, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Send,
  MessageSquare,
  Globe,
  Truck,
  ShoppingCart,
  HelpCircle,
  FileText,
  User,
  Target
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { insertInquirySchema, type InsertInquirySchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactFormModal from "@/components/contact-form-modal";
import contactBg from "@assets/generated_images/Professional_office_contact_background_95a1aff4.png";

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const parallaxOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(parallaxY, springConfig);
  
  const { toast } = useToast();

  const form = useForm<InsertInquirySchema>({
    resolver: zodResolver(insertInquirySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      topic: "",
      message: "",
    },
  });

  const createInquiry = useMutation({
    mutationFn: async (data: InsertInquirySchema) => {
      await apiRequest("POST", "/api/inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your inquiry. We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertInquirySchema) => {
    createInquiry.mutate(data);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      content: "Plot No- D1/18(P), D1/19, D1/20 & D1/37, D1/38, D1/39(P)\nSomnathpur Industrial Estate, Balasore, Odisha, India, Pin- 755019",
      color: "from-red-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-red-50 to-pink-50"
    },
    {
      icon: Mail,
      title: "Email",
      content: "alashoremarine@gmail.com",
      href: "mailto:alashoremarine@gmail.com",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+91 7381050536",
      href: "tel:+917381050536",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50"
    },
    {
      icon: Building,
      title: "Company Registration",
      content: "CIN: U05000OR2012PTC016366",
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-violet-50"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Saturday: 9:00 AM - 6:00 PM\nSunday: Closed",
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-amber-50"
    },
  ];

  const socialLinks = [
    { 
      icon: Facebook, 
      href: "https://www.facebook.com/AlashoreMarine/", 
      name: "Facebook",
      color: "from-blue-600 to-blue-700",
      hoverColor: "hover:from-blue-700 hover:to-blue-800"
    },
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/alashoremarine/", 
      name: "Instagram",
      color: "from-pink-500 to-rose-500",
      hoverColor: "hover:from-pink-600 hover:to-rose-600"
    },
    { 
      icon: Twitter, 
      href: "https://twitter.com/AlashoreL", 
      name: "Twitter",
      color: "from-sky-400 to-blue-500",
      hoverColor: "hover:from-sky-500 hover:to-blue-600"
    },
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/company/alashore-marine-private-limited/", 
      name: "LinkedIn",
      color: "from-blue-600 to-indigo-600",
      hoverColor: "hover:from-blue-700 hover:to-indigo-700"
    },
  ];

  const inquiryTopics = [
    { value: "general", label: "General Inquiry", icon: MessageSquare },
    { value: "product", label: "Product Information", icon: ShoppingCart },
    { value: "export", label: "Export Requirements", icon: Globe },
    { value: "logistics", label: "Logistics & Shipping", icon: Truck },
    { value: "partnership", label: "Partnership Opportunities", icon: Target },
    { value: "support", label: "Customer Support", icon: HelpCircle },
    { value: "documentation", label: "Documentation", icon: FileText },
    { value: "other", label: "Other", icon: User },
  ];

  // Handle automatic scrolling to form when hash is present
  useEffect(() => {
    if (window.location.hash === '#contact-form') {
      setTimeout(() => {
        const element = document.getElementById('contact-form');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 1000);
    }
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative">
      <Header onEnquiryClick={() => setIsContactModalOpen(true)} />
      <main>
        {/* Enhanced Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
          {/* Optimized Background Image with Lazy Loading */}
          <div className="absolute inset-0">
            <img 
              src={contactBg}
              alt="Professional office background"
              className="w-full h-full object-cover"
              style={{ 
                filter: 'brightness(0.3) contrast(1.1)',
                willChange: 'transform'
              }}
              loading="eager"
              decoding="async"
            />
          </div>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-ocean-blue/80 via-deep-navy/70 to-marine-teal/85" />
          <motion.div 
            style={{ y, opacity: parallaxOpacity }}
            className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"
          />
          <div className="absolute top-10 right-10 w-56 h-56 bg-white/10 rounded-full backdrop-blur-sm" />
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-coral-accent/20 rounded-full backdrop-blur-sm" />
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
                <Send className="text-coral-accent mr-2" size={20} />
                <span className="text-white/90 font-medium">Let's Connect</span>
              </motion.div>
              <motion.h1 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="text-6xl md:text-8xl font-heading font-bold mb-8"
              >
                Contact <span className="text-coral-accent">Us</span>
              </motion.h1>
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-2xl text-light-marine max-w-4xl mx-auto leading-relaxed"
              >
                Ready to experience premium seafood quality? Get in touch with our team today 
                and let's discuss your requirements.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                Get In Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're here to help with all your seafood needs. Contact us through any of the following channels.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    rotateX: 5,
                    rotateY: 5
                  }}
                  className={`${info.bgColor} p-8 rounded-xl shadow-lg hover:shadow-2xl text-center transition-all duration-300 border border-white/50 backdrop-blur-sm`}
                >
                  <motion.div 
                    className={`w-20 h-20 bg-gradient-to-r ${info.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: "0 10px 20px rgba(0,0,0,0.15)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <info.icon className="text-white drop-shadow-md" size={28} />
                  </motion.div>
                  <h3 className="text-xl font-heading font-bold text-gray-900 mb-4">
                    {info.title}
                  </h3>
                  {info.href ? (
                    <motion.a
                      href={info.href}
                      whileHover={{ scale: 1.02 }}
                      className={`text-gray-700 hover:bg-gradient-to-r hover:${info.color} hover:bg-clip-text hover:text-transparent font-medium transition-all duration-300 whitespace-pre-line`}
                      data-testid={`link-contact-${info.title.toLowerCase().replace(" ", "-")}`}
                    >
                      {info.content}
                    </motion.a>
                  ) : (
                    <p className="text-gray-700 font-medium whitespace-pre-line">{info.content}</p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Contact Form and Map */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div
                id="contact-form"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
              >
                <h3 className="text-3xl font-heading font-bold text-gray-900 mb-8">
                  Send us a Message
                </h3>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John"
                                {...field}
                                data-testid="input-first-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Doe"
                                {...field}
                                data-testid="input-last-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@example.com"
                              {...field}
                              data-testid="input-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              {...field}
                              value={field.value || ""}
                              data-testid="input-phone"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Company"
                              {...field}
                              value={field.value || ""}
                              data-testid="input-company"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Topic</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger data-testid="select-topic">
                                <SelectValue placeholder="Select inquiry topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inquiryTopics.map((topic) => (
                                <SelectItem key={topic.value} value={topic.value}>
                                  {topic.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder="Tell us about your requirements..."
                              {...field}
                              data-testid="textarea-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={createInquiry.isPending}
                      className="w-full bg-ocean-blue hover:bg-deep-navy text-white font-semibold h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      data-testid="button-send-message"
                    >
                      {createInquiry.isPending ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send size={16} className="mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>

              {/* Map and Additional Info */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-100">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-2xl font-heading font-semibold text-gray-900 mb-6 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-white" />
                    </div>
                    Find Our Location
                  </motion.h3>
                  
                  {/* Optimized Google Maps Embed */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-80 rounded-xl overflow-hidden shadow-lg mb-6 border border-gray-200"
                  >
                    <div className="relative w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-blue/5 to-marine-teal/5 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {/* Ocean Wave Background */}
                        <motion.div
                          className="absolute inset-0 opacity-10"
                          animate={{ 
                            backgroundPosition: ["0% 0%", "100% 100%"],
                          }}
                          transition={{ 
                            duration: 8, 
                            repeat: Infinity, 
                            ease: "linear" 
                          }}
                          style={{
                            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(14, 165, 233, 0.3) 0%, transparent 50%)"
                          }}
                        />
                        
                        <div className="relative z-10 text-center">
                          {/* Floating Map Pin with Ocean Ring */}
                          <div className="relative mb-6">
                            {/* Outer ripple rings */}
                            <motion.div
                              className="absolute inset-0 w-24 h-24 mx-auto border-2 border-ocean-blue/30 rounded-full"
                              animate={{ scale: [1, 1.8], opacity: [0.7, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                            />
                            <motion.div
                              className="absolute inset-0 w-24 h-24 mx-auto border-2 border-marine-teal/40 rounded-full"
                              animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "easeOut" }}
                            />
                            
                            {/* Central pin with floating effect */}
                            <motion.div
                              className="relative w-24 h-24 mx-auto bg-gradient-to-br from-ocean-blue to-deep-navy rounded-full flex items-center justify-center shadow-2xl"
                              animate={{ 
                                y: [-4, 4, -4],
                                rotate: [0, 5, -5, 0],
                                scale: [1, 1.05, 1]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }}
                            >
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                              >
                                <MapPin size={36} className="text-white drop-shadow-lg" />
                              </motion.div>
                              
                              {/* Glowing inner shadow */}
                              <div className="absolute inset-2 bg-gradient-to-tr from-white/20 to-transparent rounded-full" />
                            </motion.div>
                          </div>
                          
                          {/* Animated text with marine gradient */}
                          <motion.h3 
                            className="text-2xl font-heading font-bold mb-4 bg-gradient-to-r from-ocean-blue via-marine-teal to-deep-navy bg-clip-text text-transparent"
                            animate={{ 
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                            }}
                            transition={{ 
                              duration: 3, 
                              repeat: Infinity, 
                              ease: "easeInOut" 
                            }}
                            style={{ backgroundSize: "200% 200%" }}
                          >
                            Charting Your Course
                          </motion.h3>
                          
                          <motion.p 
                            className="text-gray-600 mb-6 font-medium"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Navigating to our location...
                          </motion.p>
                          
                          {/* Ocean wave loading bars */}
                          <div className="flex justify-center space-x-2">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-1 bg-gradient-to-t from-ocean-blue to-marine-teal rounded-full"
                                animate={{ 
                                  height: [8, 24, 8],
                                  opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                  duration: 1.5,
                                  repeat: Infinity,
                                  delay: i * 0.15,
                                  ease: "easeInOut"
                                }}
                              />
                            ))}
                          </div>
                          
                          {/* Floating particles */}
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-coral-accent/40 rounded-full"
                              style={{
                                left: `${20 + i * 10}%`,
                                top: `${30 + (i % 2) * 20}%`
                              }}
                              animate={{
                                y: [-20, 20, -20],
                                x: [-10, 10, -10],
                                opacity: [0, 0.6, 0],
                                scale: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 4 + i * 0.5,
                                repeat: Infinity,
                                delay: i * 0.8,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                      </motion.div>
                      <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d909.6626902940994!2d86.85474825389214!3d21.496863989902337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1c5ef91ba45023%3A0x6284f459d78b4645!2sAlashore%20Marine%20Exports%20Pvt.%20Limited.!5e1!3m2!1sen!2sin!4v1756293306299!5m2!1sen!2sin" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, position: 'absolute', top: 0, left: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Alashore Marine Exports Pvt. Limited Location"
                        onLoad={() => {
                          const placeholder = document.querySelector('.text-center.text-gray-500') as HTMLElement;
                          if (placeholder) placeholder.style.display = 'none';
                        }}
                      ></iframe>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
                  >
                    <p className="text-gray-700 text-sm leading-relaxed">
                      📍 <strong>Strategic Location:</strong> Located in the heart of Odisha's industrial area, our facility is easily accessible 
                      and strategically positioned for efficient distribution across India and international markets.
                    </p>
                  </motion.div>
                </div>

                {/* Enhanced Social Media Section */}
                <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-xl shadow-lg border border-gray-100">
                  <motion.h3 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-2xl font-heading font-semibold text-gray-900 mb-6 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Globe size={18} className="text-white" />
                    </div>
                    Follow Us
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-600 mb-8 leading-relaxed"
                  >
                    🚀 Stay updated with our latest news, product announcements, and industry insights. Join our community!
                  </motion.p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {socialLinks.map((social, index) => (
                      <motion.a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ 
                          scale: 1.05,
                          y: -8,
                          rotateY: 10,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className={`group relative bg-gradient-to-r ${social.color} ${social.hoverColor} p-4 rounded-xl flex flex-col items-center justify-center text-white transition-all duration-300 shadow-lg`}
                        data-testid={`link-social-${social.name.toLowerCase()}`}
                      >
                        <motion.div
                          animate={{ 
                            rotate: [0, 5, -5, 0],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.5
                          }}
                          className="mb-3"
                        >
                          <social.icon size={24} className="drop-shadow-sm" />
                        </motion.div>
                        
                        <span className="text-sm font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                          {social.name}
                        </span>
                        
                        {/* Animated Background Effect */}
                        <motion.div
                          className="absolute inset-0 bg-white/10 rounded-xl"
                          initial={{ scale: 0, opacity: 0 }}
                          whileHover={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.a>
                    ))}
                  </div>
                  
                  {/* Social Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 grid grid-cols-3 gap-4 text-center"
                  >
                    <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                      <div className="font-bold text-lg text-blue-600">5K+</div>
                      <div className="text-xs text-gray-600">Followers</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                      <div className="font-bold text-lg text-green-600">200+</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                    <div className="bg-white/50 rounded-lg p-3 border border-gray-200">
                      <div className="font-bold text-lg text-purple-600">15+</div>
                      <div className="text-xs text-gray-600">Countries</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl opacity-50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md px-6 py-3 rounded-full border border-blue-200/50 mb-8"
              >
                <HelpCircle className="text-blue-600 mr-2" size={20} />
                <span className="text-blue-800 font-medium">FAQ</span>
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-4xl md:text-6xl font-heading font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6"
              >
                Frequently Asked Questions
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-600 max-w-3xl mx-auto"
              >
                Got questions? We've got answers! Find quick solutions to the most common inquiries about our premium seafood products and services.
              </motion.p>
            </motion.div>

            {/* Interactive FAQ Accordion */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <ShoppingCart size={18} className="text-white" />
                      </motion.div>
                      <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        What are your minimum order quantities?
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="pl-14 space-y-2">
                      <p className="text-gray-600 leading-relaxed">
                        Our minimum order quantity varies by product but typically starts at <strong>1 metric ton</strong>. 
                        This ensures cost-effective shipping and maintains our quality standards.
                      </p>
                      <p className="text-sm text-blue-600 font-medium">
                        💡 Tip: Contact our sales team for specific product MOQs and volume discounts.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Target size={18} className="text-white" />
                      </motion.div>
                      <span className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        Do you provide samples?
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="pl-14 space-y-2">
                      <p className="text-gray-600 leading-relaxed">
                        <strong>Yes!</strong> We provide samples for quality verification. Sample costs and shipping 
                        charges apply, which can be adjusted against your first order.
                      </p>
                      <p className="text-sm text-green-600 font-medium">
                        ✅ Quality guaranteed: All samples undergo the same rigorous testing as our export products.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <FileText size={18} className="text-white" />
                      </motion.div>
                      <span className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                        What certifications do you have?
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="pl-14 space-y-2">
                      <p className="text-gray-600 leading-relaxed">
                        We hold <strong>HACCP, BRC, EU approval</strong>, and other international certifications. 
                        Our EIA-approved laboratory ensures consistent quality standards.
                      </p>
                      <p className="text-sm text-purple-600 font-medium">
                        🏆 Certified excellence: Meeting global food safety and quality requirements.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Truck size={18} className="text-white" />
                      </motion.div>
                      <span className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        What are your delivery timelines?
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="pl-14 space-y-2">
                      <p className="text-gray-600 leading-relaxed">
                        Delivery timelines depend on order quantity and destination. Typically, 
                        we can fulfill orders within <strong>2-4 weeks</strong> from confirmation.
                      </p>
                      <p className="text-sm text-orange-600 font-medium">
                        🚚 Fast & Reliable: Express shipping options available for urgent orders.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <AccordionTrigger className="px-6 py-4 text-left hover:no-underline group">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                      >
                        <Globe size={18} className="text-white" />
                      </motion.div>
                      <span className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        Which countries do you export to?
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4">
                    <div className="pl-14 space-y-2">
                      <p className="text-gray-600 leading-relaxed">
                        We export to <strong>15+ countries</strong> across Asia, Europe, and the Americas. 
                        Our strategic location in Odisha enables efficient global distribution.
                      </p>
                      <p className="text-sm text-indigo-600 font-medium">
                        🌍 Global Reach: Serving customers worldwide with premium seafood quality.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
              {/* Help Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                viewport={{ once: true }}
                className="mt-12 text-center"
              >
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/50">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <HelpCircle size={28} className="text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Still have questions?
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Our team is here to help! Get in touch for personalized assistance.
                  </p>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <a
                      href="mailto:alashoremarine@gmail.com"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Mail size={18} />
                      Contact Support
                    </a>
                  </motion.div>
                </div>
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
                Ready to Start Your Order?
              </h2>
              <p className="text-xl text-light-marine mb-8 max-w-3xl mx-auto">
                Our sales team is ready to help you with custom quotes, product specifications, 
                and any questions about our premium seafood products.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="tel:+917381050536"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-coral-accent hover:bg-golden-orange text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
                  data-testid="button-call-now"
                >
                  <Phone size={20} className="mr-2" />
                  Call Now
                </motion.a>
                <motion.a
                  href="mailto:alashoremarine@gmail.com"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white hover:bg-white hover:text-ocean-blue px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 inline-flex items-center justify-center"
                  data-testid="button-email-us"
                >
                  <Mail size={20} className="mr-2" />
                  Email Us
                </motion.a>
              </div>
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