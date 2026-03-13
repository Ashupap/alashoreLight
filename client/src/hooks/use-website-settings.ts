import { STATIC_SETTINGS } from "@/data/settings";

interface WebsiteSettingsData {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  email: string;
  phone: string;
}

export function useWebsiteSettings() {
  const settingsData: WebsiteSettingsData = {
    facebook: STATIC_SETTINGS["social.facebook"] || "https://www.facebook.com/AlashoreMarine/",
    instagram: STATIC_SETTINGS["social.instagram"] || "https://www.instagram.com/alashoremarine/",
    twitter: STATIC_SETTINGS["social.twitter"] || "https://twitter.com/AlashoreL",
    linkedin: STATIC_SETTINGS["social.linkedin"] || "https://www.linkedin.com/company/alashore-marine-private-limited/",
    email: STATIC_SETTINGS["contact.email"] || "alashoremarine@gmail.com",
    phone: STATIC_SETTINGS["contact.phone"] || "+91 7381050536",
  };

  return {
    settings: settingsData,
    isLoading: false,
    error: null,
    rawSettings: []
  };
}
