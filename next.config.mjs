/** @type {import('next').NextConfig} */
const nextConfig = {
   
    eslint:{
        ignoreDuringBuilds:true
    },
    images:{
        remotePatterns:[
            {
                
                hostname:'utfs.io',
                pathname:`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`
            }
        ]
    }

}

export default nextConfig;
