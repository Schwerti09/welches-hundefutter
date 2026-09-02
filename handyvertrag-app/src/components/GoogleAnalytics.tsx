import Script from "next/script";

const GA_ID = "G-YY5T595M12";

/**
 * lazyOnload: gtag.js wird erst nach dem `load`-Event in einer Leerlaufphase
 * geladen. Es konkurriert damit nicht mehr mit Hydration/Interaktivität um den
 * Hauptthread → deutlich niedrigere Total Blocking Time. Für reine Zählung
 * (Pageviews) ist die kleine Verzögerung unkritisch.
 */
export default function GoogleAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="lazyOnload" />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { transport_type: 'beacon' });
        `}
      </Script>
    </>
  );
}
