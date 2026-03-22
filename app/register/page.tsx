import handleSubmit from "../actions/register"
import RegisterField from "@/components/auth/RegisterField"
export default async function Register() {

  return (
    <div className="w-full h-full flex justify-center items-center">
      <RegisterField action = {handleSubmit} />
    </div>
  )
}
