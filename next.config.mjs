/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{
        instrumentationHook:true,
        
    },
    images:{
        domains:["avatars.githubusercontent.com","lh3.googleusercontent.com","secure.gravatar.com"]
    },
    reactStrictMode:false,
    compiler:{
        removeConsole:true
    }
};

export default nextConfig;
