"use server"


import { redirect } from 'next/navigation';
import { createRegisterUserUseCase } from "@/composition/registerUserFactory"
import { cookies } from "next/headers";

export default async function handleSubmit(formData: FormData){
 
        // Receiving Data From User Form Input and Parsing the Data
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const notification = formData.get("notification") == "on";


        //Implementing Use Case
        const usecase = await createRegisterUserUseCase();
        await usecase.execute({
          email,
          password,
          notification,
          theme: "dark",
          language: "english",
        })

        const cookieStore = await cookies();
        cookieStore.set("verify_email", email, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60,
          path: "/",
        });

        //Redirect User Back To Login Page
        redirect("/login")
 

    // const user = await User.create({
    //   email, password: hashedPassword, notification, isVerified: false, token: token

    // })

    // const link = `http://localhost:3000/register/verify?token=${token}`

    // await sendEmail(link, email);

    
    // if (user) {
    //   const cookieStore = await cookies();
    //   cookieStore.set("verify_email", email as string , {
    //     httpOnly: true,
    //     secure: true,
    //     maxAge: 60 * 60,
    //     path: "/"

    //   })
    //   redirect("/register/confirmation");
    // }
    // else console.log(user)

    

    
  }




