"use client"
import { SidebarTrigger } from "../ui/sidebar"
import { useThemeContext } from "../context/themeWrapper"

export default function TopBar(){
    const { isDark } = useThemeContext();

    return(
        <div className={`m-0 sticky top-0 z-10 flex justify-between items-center ${isDark ? "bg-black" : "bg-white"}`}>
            <SidebarTrigger className={`${isDark ? "text-white" : "text-black"}`} />
           

        </div>
    )
    
}