"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react"
import {
  handleGetTheme,
  handleChangeTheme,
} from "@/app/actions/setting";

export type ThemeMode = "white" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => Promise<void>;
  toggleTheme: () => Promise<void>;
  isDark: boolean;
};

export const ThemeContext = createContext<
  ThemeContextValue | undefined
>(undefined);

export function ThemeProvider({
  children,
  initialTheme = "dark",
}: {
  children: ReactNode;
  initialTheme?: ThemeMode;
}) {
  const { data: session, status } = useSession()
  const [theme, setThemeState] = useState<ThemeMode>(initialTheme);
  const [loading, setLoading] = useState(true);

  // ✅ 1. Load theme from backend on mount
  useEffect(() => {
  const fetchTheme = async () => {
    try {
      const result = await handleGetTheme();

      if (result?.theme === "white" || result?.theme === "dark") {
        setThemeState(result.theme);
      }
    } catch (error) {
      console.error("Failed to fetch theme:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return;

  if (!session) {
    setLoading(false);
    return;
  }

  fetchTheme();
}, [session, status]);

  // ✅ 2. Apply theme to DOM
  useEffect(() => {
    document.documentElement.classList.remove("white", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  // ✅ 3. Set theme (with persistence)
  const setTheme = async (nextTheme: ThemeMode) => {
    if (nextTheme === theme) return;

    // optimistic update
    setThemeState(nextTheme);

    try {
      await handleChangeTheme();
    } catch (error) {
      console.error("Failed to update theme:", error);
      // rollback (optional)
    }
  };

  // ✅ 4. Toggle theme
  const toggleTheme = async () => {
    const nextTheme: ThemeMode = theme === "dark" ? "white" : "dark";

    setThemeState(nextTheme); // optimistic

    try {
      await handleChangeTheme();
    } catch (error) {
      console.error("Failed to toggle theme:", error);
      // rollback if needed
    }
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isDark: theme === "dark",
    }),
    [theme]
  );

  // Optional: prevent flash before theme loads
  if (loading) return null;

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }

  return context;
}