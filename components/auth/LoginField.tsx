"use client"
import { Button, ButtonWithIcon } from "@/components/ui/button"

import { useState} from "react"
import Link from "next/link"
import { useThemeContext } from "../context/themeWrapper"
import { useLanguageContext } from "../context/languageWrapper"
import { handleGoogleLogin } from "@/app/actions/oAuthLogin"
import handleLogin from "@/app/actions/login"

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"



const isValidRegex = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  

}
const isValidLength = (password: string): boolean => {
  return password.length > 6;
}
export default function LoginField(){
  const { isDark } = useThemeContext();
  const { t } = useLanguageContext();
    const [session, setSession] = useState(null);


     async function handleSubmit(formData: FormData) {
        const result = await handleLogin(formData)

        if (!result.success) {
          alert(result.message) 
        } else {
          window.location.href = "/dashboard"
        }
      }


    


  return (
    <div className="w-full min-h-screen flex flex-col justify-center items-center absolute z-0">
      
        <form className={` w-2/3 h-2/3 flex flex-col justify-center items-center rounded-5xl`} action = {handleSubmit}>
          <FieldGroup className="w-2/3">
            <FieldSet>
              <FieldLegend className={isDark ? 'text-white' : 'text-black'}>{t("login")}</FieldLegend>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw1" className={isDark ? 'text-white' : 'text-black'}>
                    {t("email")}
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-number-uw1"
                    placeholder={t("email")}
                    className={isDark ? 'text-white' : 'text-black'}
                    name="email"
                    
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-card-number-uw1" className={isDark ? 'text-white' : 'text-black'}>
                    {t("password")}
                  </FieldLabel>
                  <Input
                    id="checkout-7j9-card-number-uw1"
                    type="password"
                    name="password"
                    className={isDark ? 'text-white' : 'text-black'}
                    required
                  />
            
                </Field>
              
    

                
              </FieldGroup>
            </FieldSet>
            <FieldSeparator />
            

            
            <Field orientation="horizontal">
              <Button 
                type="submit" 
                className={`cursor-pointer ${isDark ? `bg-black text-white` : `bg-white text-black hover:bg-gray-100`}`}
                
                
              >{t("submit")}
              </Button>
              

              
            </Field>
            <Field>
              <FieldLabel className={isDark ? 'text-white' : 'text-black'}>{t("or")}</FieldLabel>

            </Field>
            <Field>
              <ButtonWithIcon onClick={handleGoogleLogin} className={`cursor-pointer ${isDark ? `bg-black text-white` : `bg-white text-black hover:bg-gray-100`}`} />
              
            </Field>
            <Field >
              <FieldLabel className={isDark ? 'text-white' : 'text-black'}>{t("noAccountRegister")} <Link href="/register" className={`${isDark ? 'text-white' : 'text-black'} underline`}>{t("registerHere")}</Link></FieldLabel>

          </Field>


          </FieldGroup>
        </form>
      
      

    </div>
  )
}