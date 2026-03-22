"use client"
import { Button } from "@/components/ui/button"
import { useThemeContext } from "../context/themeWrapper"
import { useLanguageContext } from "../context/languageWrapper"
import { sendVerification } from "../../app/actions/confirmation"



import {
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"





export default function ConfirmationField() {
    const { isDark } = useThemeContext()
    const { t } = useLanguageContext()


 

  
    return (
        <div className="w-full h-full flex justify-center items-center absolute">
        <form className={` w-2/3 h-2/3 flex flex-col justify-center items-center rounded-5xl`}>
            <FieldGroup className=" h-2/3 flex flex-col justify-center items-center rounded-5xl">
                <FieldLabel className={`text-xl ${isDark ? 'text-white' : 'text-black'}`}>{t("confirmationSent")}</FieldLabel>
                <Button type="button" onClick = {() => sendVerification()} className={` w-40 text-xl ${isDark ? `bg-black text-white` : `bg-white text-black hover:bg-gray-100`}`}>{t("resendCode")}</Button>
            
            
            </FieldGroup>
        </form>
        </div>
    )
}
