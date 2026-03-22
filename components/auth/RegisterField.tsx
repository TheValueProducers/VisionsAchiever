"use client"
import { Button, ButtonWithIcon } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"


import { useThemeContext } from "@/components/context/themeWrapper"
import { useLanguageContext } from "@/components/context/languageWrapper"

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"



const isValidRegex = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  

}
const isValidLength = (password: string) => {
  return password.length > 6;
}

export default function RegisterField({action}) {
 

 

   const [active, setActive] = useState(false)
    const [validLength, setValidLength] = useState(false);
    const [validRegex, setValidRegex] = useState(false);
    const { isDark } = useThemeContext();
    const { t } = useLanguageContext();

    const checkValidPassword = (password) => {
    if (isValidLength(password)) setValidLength(true);
    else {
      setValidLength(false);
      return false;
    }
    if (isValidRegex(password)) setValidRegex(true);
  
    else {
      setValidRegex(false);
      return false;
    }
    return true;
  

  }


  return (
    <div className="w-full h-full flex justify-center items-center z-0">
      <form className={` w-2/3 h-2/3 flex flex-col justify-center items-center rounded-5xl`} action = {action}>
        <FieldGroup className="w-2/3">
          <FieldSet>
            <FieldLegend className={isDark ? 'text-white' : 'text-black'}>{t("register")}</FieldLegend>
            
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1" className={isDark ? 'text-white' : 'text-black'}>
                  {t("email")}
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-number-uw1"
                  placeholder={t("email")}
                  className={isDark ? 'text-white' : 'text-black'}
                  name = "email"
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
                  onBlur={() => setActive(false)}
                  onFocus={() => {
                    setActive(true);

                  }}
                  onChange={(e) => {
                    
                    checkValidPassword(e.target.value);
                  }}
                  required
                />
                <FieldLabel htmlFor="checkout-7j9-card-name-43j" className={validLength && validRegex? "text-green-500": "text-red-500"}>
                  {active && !validLength
                    ? "Password must be longer than 5 characters"
                    : active && !validRegex
                    ? "Password must contain at least an uppercase, a lowercase, a number, and a special character (e.g. !@#$%^&*()_+-.)"
                    : active? "Valid Password": null}
                  
                </FieldLabel>
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1" className={isDark ? 'text-white' : 'text-black'}>
                  {t("confirmPassword")}
                </FieldLabel>
                <Input
                  id="checkout-7j9-card-number-uw1"
                  type="password"
                  className={isDark ? 'text-white' : 'text-black'}
                 
                  required
                    />
              </Field>
              

              
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation="horizontal" className="w-full">
              <Checkbox 
                id="finder-pref-9k2-hard-disks-ljj" 
                name = "notification"

               />
              <FieldLabel
                htmlFor="finder-pref-9k2-hard-disks-ljj"
                
               
                className={`font-normal w-full ${isDark ? 'text-white' : 'text-black'}`}
              >
                Would you like to receive notifications from us?
              </FieldLabel>
        </Field>

          
          <Field orientation="horizontal">
            <Button 
              type="submit" 
              className={`cursor-pointer ${isDark ? `bg-black text-white` : `bg-white text-black hover:bg-gray-100`}`}

              

            >{t("submit")}
            </Button>
            

            
          </Field>
          
        </FieldGroup>
      </form>
    </div>
  )
}
