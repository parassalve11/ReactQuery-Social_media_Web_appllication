import {z} from 'zod'

const requiredString = z.string().trim().min(1 , 'Required')
export const SignUpForm = z.object({
    email: requiredString.email('Invalid Email Address'),
    username: requiredString
            .regex(/^[a-zA-Z0-9_-]+$/, "only letter,number & _ ,- can be used!"),
    password: requiredString
            .min(8, "minimum 8 Charecter are Required!")        
})

export type SignUpValues = z.infer<typeof SignUpForm>

export const LoginFrom = z.object({
    username:requiredString,
    password:requiredString
})

export type LoginValues = z.infer<typeof LoginFrom>


export const createPost = z.object({
    content:requiredString,
})