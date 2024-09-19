import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()
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
        removeConsole: process.env.NODE_ENV === "production"
    }
};

export default withNextIntl(nextConfig);
