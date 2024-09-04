import { Metadata } from 'next'
import React from 'react'
import signupImage from '@/assets/signup-image.jpg'
import Image from 'next/image'
import Link from 'next/link'
import SignUpFrom from './SignUpForm'

export const metadata:Metadata ={
    title:'Signup'
}

export default function page() {
  return (
    <div className='h-screen flex justify-center items-center p-5'>
        <div className=' flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-card shadow-2xl'>
          <div className='w-full space-y-10 p-10 overflow-y-auto md:w-1/2'>
            <div className='space-y-1 text-center '>
                <h1 className='font-bold text-3xl  '>Signup to Metoshpare</h1>
                <p className='text-muted-foreground '>A place where <span className='italic font-semibold text-[#3B82F6]'
                >you</span> can make Friends.</p>
              
            </div>
            <div className='space-y-5'>
                <SignUpFrom />

            <Link href={'login'} className=' block  font-semibold text-[#3B82F6] '
                >
                  Already have account? Login
                </Link>

            </div>
          </div>
          
         
        <Image 
        src={signupImage}
        alt=''
        className='w-1/2 hidden object-cover md:block'
        />
        </div>
    </div>
  )
}
