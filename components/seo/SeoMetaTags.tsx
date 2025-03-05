"use client";

import Head from "next/head";
import Script from "next/script";

export const MetaTags = () => {
  return (
    <>
      <Head>
        {/* SEO Meta Tags */}
        <meta
          name="description"
          content="ZehMizeh is the Jewish freelancing platform, connecting businesses with skilled freelancers. Find remote talent for your projects today!"
        />
        <meta
          name="keywords"
          content="freelancer marketplace, freelancers, project, outsourcing, Jewish, frum, heimishe, hiring freelancers, remote work, hire Israeli, zehmezeh, zeh mezeh, zemeze, zemize, zehmize, zeh mize, zeh mi zeh, zeh me zeh, ze mi ze, ze me ze, zeh mizeh, zemizeh, zemezeh"
        />
        <link rel="canonical" href="https://www.zehmizeh.com" />
        <meta name="robots" content="index, follow" />

        {/* Open Graph (Facebook) */}
        <meta property="og:title" content="The Jewish Freelancing Platform" />
        <meta property="og:description" content="Connect with remote, Jewish freelancers on ZehMizeh" />
        <meta property="og:image" content="https://www.zehmizeh.com/images/zehmizeh-logo.png" />
        <meta property="og:url" content="https://www.zehmizeh.com" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        <meta name="twitter:title" content="ZehMizeh - The Jewish Freelancing Platform" />
        <meta name="twitter:description" content="Connect with remote, Jewish freelancers on ZehMizeh" />
        <meta name="twitter:image" content="https://www.zehmizeh.com/images/zehmizeh-logo.png" />
      </Head>

      {/* Google Tag Manager */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-DWLW5WZM17"
        async
      />
      <Script
        strategy="afterInteractive"
        id="gtag-script"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "G-DWLW5WZM17");
          `,
        }}
      />

      {/* Google Tag Manager NoScript Fallback */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-W4BL8DL"
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>

      {/* Microsoft Clarity */}
      <Script
        strategy="afterInteractive"
        id="clarity-script"
        dangerouslySetInnerHTML={{
          __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","jnx4lzwl42");
          `,
        }}
      />

      {/* Partnero Universal */}
      <Script
        strategy="afterInteractive"
        id="partnero-script"
        dangerouslySetInnerHTML={{
          __html: `
            (function(p,t,n,e,r,o){
              p["__partnerObject"]=r;
              function f(){var c={a:arguments,q:[]};var r=this.push(c);
              return"number"!=typeof r?r:f.bind(c.q)}
              f.q=f.q||[];
              p[r]=p[r]||f.bind(f.q);
              p[r].q=p[r].q||f.q;
              o=t.createElement(n);
              var _=t.getElementsByTagName(n)[0];
              o.async=1;
              o.src=e+"?v"+~~(new Date().getTime()/1e6);
              _.parentNode.insertBefore(o, _);
            })(window,document,"script","https://app.partnero.com/js/universal.js","po");
            po("settings", "assets_host", "https://assets.partnero.com");
            po("program", "FXE3MQFC", "load");
          `,
        }}
      />
    </>
  );
};