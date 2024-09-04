'use client'
import LoadingButton from "@/components/LoadingButton";
import { PasswordInput } from "@/components/PasswordInput";
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import { FloatingLabelInput } from "@/components/ui/floatInput";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginFrom, LoginValues } from "@/lip/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, User } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { PassThrough } from "stream";
import { Login } from "./actions";


export default  function LoginForm() {
    
   const[error , setError] = useState<string>();
   const[isPending, startTransition] = useTransition();
    const form = useForm<LoginValues>({
        resolver:zodResolver(LoginFrom),
        defaultValues:{
            username:'',
            password:''
        }
    });

     async function OnSubmit(values : LoginValues) {
          setError(undefined);
          startTransition(async() => {
            const{error} = await Login(values)
            if(error) setError(error)
          })
    }

    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(OnSubmit)} className="space-y-6">
                {error && <p className="text-destructive">{error}</p>}
                <FormField 
                control={form.control}
                name='username'
                render={({field}) =>(
                    <FormItem>
                        <FormControl>
                            <FloatingLabelInput label="Username"  startContent={<User className="w-4 h-4" />} {...field} />
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
                           <PasswordInput {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                
                />
              <LoadingButton loading={isPending}  className="w-full">Login in Metrosphre</LoadingButton>
            </form>
        </Form>
    )
}