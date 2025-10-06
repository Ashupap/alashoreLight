import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Send, MessageSquare, Globe, Truck, ShoppingCart, HelpCircle, FileText, User, Target } from "lucide-react";
import { insertInquirySchema, type InsertInquirySchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
}

export default function ContactFormModal({ isOpen, onClose, productName }: ContactFormModalProps) {
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

  // Reset form values when modal opens with a product
  useEffect(() => {
    if (isOpen && productName) {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        topic: "product",
        message: `I would like to inquire about ${productName}. `,
      });
    } else if (isOpen && !productName) {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        topic: "",
        message: "",
      });
    }
  }, [isOpen, productName, form]);

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
      onClose();
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110]"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
              layoutId="contact-form"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-ocean-blue to-marine-teal text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-heading font-bold">Get In Touch</h2>
                    <p className="text-light-marine mt-1">Send us a message and we'll respond within 24 hours</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    data-testid="button-close-modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
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
                                data-testid="input-modal-first-name"
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
                                data-testid="input-modal-last-name"
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
                              data-testid="input-modal-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid md:grid-cols-2 gap-6">
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
                                data-testid="input-modal-phone"
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
                                data-testid="input-modal-company"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Inquiry Topic</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <FormControl>
                              <SelectTrigger data-testid="select-modal-topic">
                                <SelectValue placeholder="Select inquiry topic" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {inquiryTopics.map((topic) => (
                                <SelectItem key={topic.value} value={topic.value}>
                                  <div className="flex items-center gap-2">
                                    <topic.icon size={16} />
                                    {topic.label}
                                  </div>
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
                              data-testid="textarea-modal-message"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 h-12 rounded-lg border-2 font-semibold hover:bg-gray-50"
                        data-testid="button-modal-cancel"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={createInquiry.isPending}
                        className="flex-1 bg-ocean-blue hover:bg-deep-navy text-white font-semibold h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        data-testid="button-modal-send-message"
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
                    </div>
                  </form>
                </Form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}