'use client'
import { SignUpForm, SignUpValues } from "@/lip/validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FloatingLabelInput } from "@/components/ui/floatInput"
import {  EyeIcon, EyeOff, User2 } from "lucide-react"
import { MdEmail } from "react-icons/md"
import { useState, useTransition } from "react"
import SignUp from "./actions"
import LoadingButton from "@/components/LoadingButton"
import { PasswordInput } from "@/components/PasswordInput"



export default  function SignUpFrom() {
  
  const [error, setError] = useState<string>();

  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(SignUpForm),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: SignUpValues) {
    setError(undefined);
    startTransition(async () => {
      const { error } = await SignUp(values);
      if (error) setError(error);
    });
  }
    return(
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && <p className="text-destructive">{error}</p>}
        <FormField
        control={form.control}
        name="username"
        render={({field}) =>(
            <FormItem>
            <FormControl>
               <FloatingLabelInput  label="Username"  startContent={<User2 className="h-4 w-4"/>}  {...field}/> 
            </FormControl>
            <FormMessage />
            </FormItem>
            
        )}
        />

        <FormField 
        control={form.control}
        name="email"
        render={({field}) => (
          <FormItem>
            <FormControl>
              <FloatingLabelInput type="email" label="Email" startContent={<MdEmail className="h-4 w-4" />} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />

        <FormField 
        control={form.control}
        name="password"
        render={({field}) => (
          <FormItem>
            <FormControl>
             <PasswordInput  {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        />

      <LoadingButton loading={isPending} type="submit" className="w-full">Create Account</LoadingButton>
      
        </form>

      </Form>
    )
}