"use client"
import { Calendar, Home, Inbox, Search, Settings, LogOut } from "lucide-react"
import { useThemeContext } from "../context/themeWrapper"
import { useLanguageContext } from "../context/languageWrapper"
import handleLogout from "@/app/actions/logout"
import { usePathname } from "next/navigation"



import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Progress",
    url: "/progress",
    icon: Inbox,
  },
  {
    title: "Create Task",
    url: "/create-task",
    icon: Calendar,
  },
  {
    title: "Settings",
    url: "/setting",
    icon: Settings,
  },


]

export function AppSidebar() {
  const { isDark } = useThemeContext();
  const { t } = useLanguageContext();
  const pathname = usePathname();
  const page = pathname.split("/")[pathname.split("/").length - 1]
  
  
 

 
  
  

  return (
    <Sidebar
   
    >
      <SidebarContent className={`${isDark ? "bg-black" : "bg-white"} border-black`} >
        <SidebarGroup >
          <SidebarGroupLabel className={isDark ? "text-white" : "text-black"}>{t("appName")}</SidebarGroupLabel>
          <SidebarGroupContent className="h-full">
            <SidebarMenu className="flex flex-col h-full">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className={isDark ? "text-white" : "text-black"} />
                      <span className={isDark ? "text-white" : "text-black"}>
                        {item.title === "Dashboard"
                          ? t("dashboard")
                          : item.title === "Progress"
                            ? t("progress")
                            : item.title === "Create Task"
                              ? t("createTask")
                              : t("settings")}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {(page != "login" && page != "register") && (
      <SidebarFooter className={isDark ? "bg-black" : "bg-white"}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild onClick={() => handleLogout()}>
              <a href="#">
                <LogOut className={isDark ? "text-white" : "text-black"} />
                <span className={isDark ? "text-white" : "text-black"}>{t("logout")}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      )}
    </Sidebar>

      

    

  )
}