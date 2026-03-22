"use server"
import { Button, ButtonWithIcon } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import handleSubmit from "../actions/register"
import sendEmail from "@/lib/sendEmail"
import crypto from "crypto"
import { cookies } from "next/headers"
import { useThemeContext } from "@/components/context/themeWrapper"
import RegisterField from "@/components/auth/RegisterField"
import User from "@/models/auth"
import connectDB from "@/lib/mongo"
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





export default async function Register() {

  return (
    <div className="w-full h-full flex justify-center items-center">
      <RegisterField action = {handleSubmit} />
    </div>
  )
}
