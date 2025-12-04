import Head from "next/head";

export default function PageHead({ headTitle }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Job Portal - Find your dream job or hire perfect candidates"
        />
        <meta
          name="keywords"
          content="jobs, employment, career, hiring, recruitment, job portal"
        />
        <meta name="author" content="Job Portal" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Job Portal" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Favicon */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Canonical URL - dynamic based on current route */}
        <title>{headTitle ? headTitle : "DEI Champiouns Job Portal"}</title>
        <link
          rel="shortcut icon"
          href="/assets/imgs//page/dashboard/logo2.png"
        />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>
    </>
  );
}
