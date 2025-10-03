import { useQuery } from "@tanstack/react-query";
import type { WebsiteSetting } from "@shared/schema";

interface WebsiteSettingsData {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  email: string;
  phone: string;
}

const defaultSettings: WebsiteSettingsData = {
  facebook: "https://www.facebook.com/AlashoreMarine/",
  instagram: "https://www.instagram.com/alashoremarine/",
  twitter: "https://twitter.com/AlashoreL",
  linkedin: "https://www.linkedin.com/company/alashore-marine-private-limited/",
  email: "alashoremarine@gmail.com",
  phone: "+91 7381050536",
};

export function useWebsiteSettings() {
  const { data: settings, isLoading, error } = useQuery<WebsiteSetting[]>({
    queryKey: ["/api/settings"],
    queryFn: async () => {
      const response = await fetch("/api/settings?category=contact");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const settingsData: WebsiteSettingsData = { ...defaultSettings };

  if (settings) {
    settings.forEach((setting) => {
      if (setting.key in settingsData && setting.value) {
        settingsData[setting.key as keyof WebsiteSettingsData] = setting.value;
      }
    });
  }

  return {
    settings: settingsData,
    isLoading,
    error,
    rawSettings: settings,
  };
}
