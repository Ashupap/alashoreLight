import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { WebsiteSetting } from "@shared/schema";

const settingsFormSchema = z.object({
  facebook: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  instagram: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  twitter: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  linkedin: z.string().url({ message: "Please enter a valid URL" }).or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function WebsiteSettingsManager() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const { data: settings, isLoading } = useQuery<WebsiteSetting[]>({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings?category=contact");
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      email: "",
      phone: "",
    },
  });

  // Update form when settings are loaded
  useState(() => {
    if (settings) {
      const formData: Partial<SettingsFormValues> = {};
      settings.forEach((setting) => {
        if (setting.key in form.getValues()) {
          formData[setting.key as keyof SettingsFormValues] = setting.value || "";
        }
      });
      form.reset(formData);
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const existingSetting = settings?.find((s) => s.key === key);
      
      if (existingSetting) {
        return await apiRequest("PUT", `/api/settings/${key}`, { value });
      } else {
        return await apiRequest("POST", "/api/settings", {
          key,
          value,
          category: "contact",
          description: `${key.charAt(0).toUpperCase() + key.slice(1)} link or contact info`,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  const onSubmit = async (data: SettingsFormValues) => {
    setIsSaving(true);
    try {
      const updates = Object.entries(data).map(([key, value]) =>
        updateSettingMutation.mutateAsync({ key, value })
      );
      
      await Promise.all(updates);
      
      toast({
        title: "Settings Saved",
        description: "Your website settings have been updated successfully.",
      });
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
          Manage your social media links and contact information. These will appear in the header, footer, and contact page.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Social Media Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-ocean-blue rounded-lg flex items-center justify-center mr-3">
                <Facebook size={20} className="text-white" />
              </div>
              Social Media Links
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
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
                      <Input
                        placeholder="https://www.facebook.com/yourpage"
                        {...field}
                        data-testid="input-facebook"
                      />
                    </FormControl>
                    <FormDescription>
                      Your Facebook page URL
                    </FormDescription>
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
                      <Input
                        placeholder="https://www.instagram.com/yourprofile"
                        {...field}
                        data-testid="input-instagram"
                      />
                    </FormControl>
                    <FormDescription>
                      Your Instagram profile URL
                    </FormDescription>
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
                      <Input
                        placeholder="https://twitter.com/yourhandle"
                        {...field}
                        data-testid="input-twitter"
                      />
                    </FormControl>
                    <FormDescription>
                      Your Twitter profile URL
                    </FormDescription>
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
                      <Input
                        placeholder="https://www.linkedin.com/company/yourcompany"
                        {...field}
                        data-testid="input-linkedin"
                      />
                    </FormControl>
                    <FormDescription>
                      Your LinkedIn company page URL
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          {/* Contact Information Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-xl font-heading font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-10 h-10 bg-marine-teal rounded-lg flex items-center justify-center mr-3">
                <Phone size={20} className="text-white" />
              </div>
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
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
                      <Input
                        type="email"
                        placeholder="info@company.com"
                        {...field}
                        data-testid="input-email-setting"
                      />
                    </FormControl>
                    <FormDescription>
                      Your primary contact email
                    </FormDescription>
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
                      <Input
                        type="tel"
                        placeholder="+91 1234567890"
                        {...field}
                        data-testid="input-phone-setting"
                      />
                    </FormControl>
                    <FormDescription>
                      Your primary contact phone number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-ocean-blue hover:bg-deep-navy px-8"
              data-testid="button-save-settings"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
