/** @type {import('next').NextConfig} */
const nextConfig = {
   
    eslint:{
        ignoreDuringBuilds:true
    },
    images:{
        remotePatterns:[
            {
                protocol:'https',
                hostname:'utfs.io',
                pathname:`/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`
            }
        ]
    }

}

export default nextConfig;
