"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { handleChangeLanguage, handleGetLanguage } from "@/app/actions/setting";
import { UserLanguage } from "@/core/entities/User";
import { translate, TranslationKey } from "@/lib/i18n";

type LanguageContextValue = {
  language: UserLanguage;
  setLanguage: (language: UserLanguage) => Promise<void>;
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLanguage = "english",
}: {
  children: ReactNode;
  initialLanguage?: UserLanguage;
}) {
  const { data: session, status } = useSession();
  const [language, setLanguageState] = useState<UserLanguage>(initialLanguage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        const result = await handleGetLanguage();
        setLanguageState(result.language);
      } catch (error) {
        console.error("Failed to fetch language:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "loading") return;

    if (!session) {
      setLoading(false);
      return;
    }

    void fetchLanguage();
  }, [session, status]);

  const setLanguage = async (nextLanguage: UserLanguage) => {
    if (nextLanguage === language) return;

    setLanguageState(nextLanguage);

    try {
      await handleChangeLanguage(nextLanguage);
    } catch (error) {
      console.error("Failed to update language:", error);
    }
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey) => translate(language, key),
    }),
    [language]
  );

  if (loading) return null;

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguageContext must be used within a LanguageProvider");
  }

  return context;
}