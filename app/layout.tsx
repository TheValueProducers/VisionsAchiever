"use server"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/navigation/menu"
import { Label } from "@/components/ui/label"
import {ThemeProvider}  from "@/components/context/themeWrapper";
import { LanguageProvider } from "@/components/context/languageWrapper";
import TopBar from "@/components/background/TopBar";
import { SessionProvider } from "next-auth/react";


import { Inter } from "next/font/google";
import StarryNight from "../components/background/home"
import './globals.css';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});





export default async function Layout({ children }: { children: React.ReactNode }) {
  

  
  
  return (
    <html className={inter.variable}>
      
        <body className="flex">
          <SessionProvider>
          <LanguageProvider>
          <ThemeProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className={`relative flex-1`}>
                  
                  <TopBar />
                  <StarryNight/>
                  {children}
              </main>
            </SidebarProvider>
            
        </ThemeProvider>
          </LanguageProvider>
        </SessionProvider>    
        </body>

      

    </html>
      
  )
}