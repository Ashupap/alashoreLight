import { useState, useEffect, KeyboardEvent } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  Facebook, Instagram, Twitter, Linkedin, Mail, Phone, Save, RefreshCw,
  Building2, Globe, Settings2, X, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage, 
  FormDescription 
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { WebsiteSetting } from "@shared/schema";

// Schema for Site Information
const siteInfoSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  description: z.string().min(1, "Description is required"),
  address: z.string().min(1, "Address is required"),
});

// Schema for SEO Settings
const seoSchema = z.object({
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  keywords: z.string(),
});

// Schema for Social Media
const socialMediaSchema = z.object({
  facebook: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  instagram: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  twitter: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  linkedin: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

// Schema for Analytics
const analyticsSchema = z.object({
  googleAnalyticsId: z.string(),
  facebookPixelId: z.string(),
});

type SiteInfoFormValues = z.infer<typeof siteInfoSchema>;
type SeoFormValues = z.infer<typeof seoSchema>;
type SocialMediaFormValues = z.infer<typeof socialMediaSchema>;
type AnalyticsFormValues = z.infer<typeof analyticsSchema>;

export default function WebsiteSettingsManager() {
  const { toast } = useToast();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all settings
  const { data: settings, isLoading } = useQuery<WebsiteSetting[]>({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  // Helper function to get settings by category
  const getSettingsByCategory = (category: string) => {
    if (!settings) return [];
    return settings.filter(s => s.category === category);
  };

  // Helper function to get setting value
  const getSettingValue = (key: string, defaultValue: string = "") => {
    const setting = settings?.find(s => s.key === key);
    return setting?.value || defaultValue;
  };

  // Update setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, category, description }: { 
      key: string; 
      value: string; 
      category: string;
      description?: string;
    }) => {
      const existingSetting = settings?.find((s) => s.key === key);
      
      if (existingSetting) {
        return await apiRequest("PUT", `/api/settings/${key}`, { value });
      } else {
        return await apiRequest("POST", "/api/settings", {
          key,
          value,
          category,
          description: description || `${key} setting`,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  // Save settings helper
  const saveSettings = async (data: Record<string, string>, category: string) => {
    setIsSaving(true);
    try {
      const updates = Object.entries(data).map(([key, value]) =>
        updateSettingMutation.mutateAsync({ 
          key, 
          value, 
          category,
          description: `${key.charAt(0).toUpperCase() + key.slice(1)} setting`
        })
      );
      
      await Promise.all(updates);
      
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
      setActiveDialog(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-ocean-blue" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">
          Website Settings
        </h1>
        <p className="text-gray-600">
          Manage your website configuration, SEO, social media, and analytics settings.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Site Information Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-start mb-4">
            <div className="w-12 h-12 bg-ocean-blue rounded-lg flex items-center justify-center mr-4">
              <Building2 size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                Site Information
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Company name, tagline, and basic information
              </p>
            </div>
          </div>
          <Button 
            className="bg-ocean-blue hover:bg-deep-navy w-full" 
            onClick={() => setActiveDialog('siteInfo')}
            data-testid="button-edit-site-info"
          >
            Edit Site Information
          </Button>
        </motion.div>
        
        {/* SEO Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-start mb-4">
            <div className="w-12 h-12 bg-ocean-blue rounded-lg flex items-center justify-center mr-4">
              <Globe size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                SEO Settings
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Meta titles, descriptions, and SEO configuration
              </p>
            </div>
          </div>
          <Button 
            className="bg-ocean-blue hover:bg-deep-navy w-full" 
            onClick={() => setActiveDialog('seo')}
            data-testid="button-edit-seo"
          >
            Edit SEO Settings
          </Button>
        </motion.div>
        
        {/* Social Media Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-start mb-4">
            <div className="w-12 h-12 bg-ocean-blue rounded-lg flex items-center justify-center mr-4">
              <Facebook size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                Social Media
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Social media links and contact information
              </p>
            </div>
          </div>
          <Button 
            className="bg-ocean-blue hover:bg-deep-navy w-full" 
            onClick={() => setActiveDialog('social')}
            data-testid="button-edit-social"
          >
            Edit Social Media
          </Button>
        </motion.div>
        
        {/* Analytics Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-start mb-4">
            <div className="w-12 h-12 bg-ocean-blue rounded-lg flex items-center justify-center mr-4">
              <Settings2 size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2">
                Analytics
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Google Analytics and tracking configuration
              </p>
            </div>
          </div>
          <Button 
            className="bg-ocean-blue hover:bg-deep-navy w-full" 
            onClick={() => setActiveDialog('analytics')}
            data-testid="button-edit-analytics"
          >
            Edit Analytics
          </Button>
        </motion.div>
      </div>

      {/* Site Information Dialog */}
      <SiteInfoDialog
        open={activeDialog === 'siteInfo'}
        onClose={() => setActiveDialog(null)}
        settings={settings || []}
        onSave={(data) => saveSettings(data, 'general')}
        isSaving={isSaving}
        getSettingValue={getSettingValue}
      />

      {/* SEO Dialog */}
      <SeoDialog
        open={activeDialog === 'seo'}
        onClose={() => setActiveDialog(null)}
        settings={settings || []}
        onSave={(data) => saveSettings(data, 'seo')}
        isSaving={isSaving}
        getSettingValue={getSettingValue}
      />

      {/* Social Media Dialog */}
      <SocialMediaDialog
        open={activeDialog === 'social'}
        onClose={() => setActiveDialog(null)}
        settings={settings || []}
        onSave={(data) => saveSettings(data, 'contact')}
        isSaving={isSaving}
        getSettingValue={getSettingValue}
      />

      {/* Analytics Dialog */}
      <AnalyticsDialog
        open={activeDialog === 'analytics'}
        onClose={() => setActiveDialog(null)}
        settings={settings || []}
        onSave={(data) => saveSettings(data, 'analytics')}
        isSaving={isSaving}
        getSettingValue={getSettingValue}
      />
    </div>
  );
}

// Site Information Dialog Component
interface DialogProps {
  open: boolean;
  onClose: () => void;
  settings: WebsiteSetting[];
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
  getSettingValue: (key: string, defaultValue?: string) => string;
}

function SiteInfoDialog({ open, onClose, settings, onSave, isSaving, getSettingValue }: DialogProps) {
  const form = useForm<SiteInfoFormValues>({
    resolver: zodResolver(siteInfoSchema),
    defaultValues: {
      companyName: "",
      tagline: "",
      description: "",
      address: "",
    },
  });

  useEffect(() => {
    if (open && settings) {
      form.reset({
        companyName: getSettingValue('companyName', 'Alashore Marine Exports Pvt. Ltd.'),
        tagline: getSettingValue('tagline', 'Premium Seafood Exports Worldwide'),
        description: getSettingValue('description', 'Leading exporter of high-quality seafood products'),
        address: getSettingValue('address', 'Chennai, India'),
      });
    }
  }, [open, settings, form, getSettingValue]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Building2 className="mr-2 text-ocean-blue" />
            Site Information
          </DialogTitle>
          <DialogDescription>
            Manage your company's basic information displayed across the website.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-company-name" />
                  </FormControl>
                  <FormDescription>Your company's official name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-tagline" />
                  </FormControl>
                  <FormDescription>A short, catchy phrase describing your business</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} data-testid="input-description" />
                  </FormControl>
                  <FormDescription>A brief description of your company and services</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} data-testid="input-address" />
                  </FormControl>
                  <FormDescription>Your company's physical address</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-ocean-blue hover:bg-deep-navy" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// SEO Dialog Component
function SeoDialog({ open, onClose, settings, onSave, isSaving, getSettingValue }: DialogProps) {
  const form = useForm<SeoFormValues>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
      keywords: "",
    },
  });

  useEffect(() => {
    if (open && settings) {
      form.reset({
        metaTitle: getSettingValue('metaTitle', 'Alashore Marine - Premium Seafood Exports'),
        metaDescription: getSettingValue('metaDescription', 'Leading exporter of high-quality seafood products worldwide. Sustainable fishing practices and premium quality guaranteed.'),
        keywords: getSettingValue('keywords', 'seafood export, marine products, fish export, sustainable fishing'),
      });
    }
  }, [open, settings, form, getSettingValue]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Globe className="mr-2 text-ocean-blue" />
            SEO Settings
          </DialogTitle>
          <DialogDescription>
            Configure search engine optimization settings for better visibility.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <FormField
              control={form.control}
              name="metaTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-meta-title" />
                  </FormControl>
                  <FormDescription>
                    Main title shown in search results (50-60 characters recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="metaDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} data-testid="input-meta-description" />
                  </FormControl>
                  <FormDescription>
                    Description shown in search results (150-160 characters recommended)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => {
                const [inputValue, setInputValue] = useState("");
                const keywords = field.value ? field.value.split(',').map(k => k.trim()).filter(k => k) : [];

                const addKeyword = (keyword: string) => {
                  const trimmed = keyword.trim();
                  if (trimmed && !keywords.includes(trimmed)) {
                    const newKeywords = [...keywords, trimmed];
                    field.onChange(newKeywords.join(', '));
                    setInputValue("");
                  }
                };

                const removeKeyword = (keywordToRemove: string) => {
                  const newKeywords = keywords.filter(k => k !== keywordToRemove);
                  field.onChange(newKeywords.join(', '));
                };

                const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addKeyword(inputValue);
                  }
                };

                return (
                  <FormItem>
                    <FormLabel>SEO Keywords</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border border-input rounded-md bg-background">
                          {keywords.length === 0 ? (
                            <span className="text-muted-foreground text-sm">No keywords added yet</span>
                          ) : (
                            keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-ocean-blue/10 text-ocean-blue rounded-full text-sm font-medium border border-ocean-blue/20 hover:bg-ocean-blue/20 transition-colors"
                                data-testid={`keyword-tag-${index}`}
                              >
                                {keyword}
                                <button
                                  type="button"
                                  onClick={() => removeKeyword(keyword)}
                                  className="ml-1 hover:bg-ocean-blue/30 rounded-full p-0.5 transition-colors"
                                  data-testid={`button-remove-keyword-${index}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type keyword and press Enter or comma to add"
                            data-testid="input-keyword-add"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => addKeyword(inputValue)}
                            className="shrink-0"
                            data-testid="button-add-keyword"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Add keywords relevant to your business. Press Enter or comma to add.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-ocean-blue hover:bg-deep-navy" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Social Media Dialog Component
function SocialMediaDialog({ open, onClose, settings, onSave, isSaving, getSettingValue }: DialogProps) {
  const form = useForm<SocialMediaFormValues>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (open && settings) {
      form.reset({
        facebook: getSettingValue('facebook', ''),
        instagram: getSettingValue('instagram', ''),
        twitter: getSettingValue('twitter', ''),
        linkedin: getSettingValue('linkedin', ''),
        email: getSettingValue('email', 'alashoremarine@gmail.com'),
        phone: getSettingValue('phone', '+91 7381050540'),
      });
    }
  }, [open, settings, form, getSettingValue]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Facebook className="mr-2 text-ocean-blue" />
            Social Media & Contact
          </DialogTitle>
          <DialogDescription>
            Manage your social media links and contact information.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Social Media Links</h3>
              
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Facebook size={16} className="mr-2 text-blue-600" />
                      Facebook
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.facebook.com/yourpage" {...field} data-testid="input-facebook" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Instagram size={16} className="mr-2 text-pink-600" />
                      Instagram
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.instagram.com/yourprofile" {...field} data-testid="input-instagram" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Twitter size={16} className="mr-2 text-blue-400" />
                      Twitter
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://twitter.com/yourhandle" {...field} data-testid="input-twitter" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Linkedin size={16} className="mr-2 text-blue-700" />
                      LinkedIn
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="https://www.linkedin.com/company/yourcompany" {...field} data-testid="input-linkedin" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Mail size={16} className="mr-2 text-ocean-blue" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" {...field} data-testid="input-email" />
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
                    <FormLabel className="flex items-center">
                      <Phone size={16} className="mr-2 text-ocean-blue" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} data-testid="input-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-ocean-blue hover:bg-deep-navy" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// Analytics Dialog Component
function AnalyticsDialog({ open, onClose, settings, onSave, isSaving, getSettingValue }: DialogProps) {
  const form = useForm<AnalyticsFormValues>({
    resolver: zodResolver(analyticsSchema),
    defaultValues: {
      googleAnalyticsId: "",
      facebookPixelId: "",
    },
  });

  useEffect(() => {
    if (open && settings) {
      form.reset({
        googleAnalyticsId: getSettingValue('googleAnalyticsId', ''),
        facebookPixelId: getSettingValue('facebookPixelId', ''),
      });
    }
  }, [open, settings, form, getSettingValue]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Settings2 className="mr-2 text-ocean-blue" />
            Analytics Configuration
          </DialogTitle>
          <DialogDescription>
            Configure tracking and analytics tools for your website.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <FormField
              control={form.control}
              name="googleAnalyticsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Analytics ID</FormLabel>
                  <FormControl>
                    <Input placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX-X" {...field} data-testid="input-google-analytics" />
                  </FormControl>
                  <FormDescription>
                    Your Google Analytics tracking ID (e.g., G-XXXXXXXXXX)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="facebookPixelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook Pixel ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Facebook Pixel ID" {...field} data-testid="input-facebook-pixel" />
                  </FormControl>
                  <FormDescription>
                    Your Facebook Pixel ID for tracking conversions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> After adding tracking codes, it may take 24-48 hours for data to appear in your analytics dashboard.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-ocean-blue hover:bg-deep-navy" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
