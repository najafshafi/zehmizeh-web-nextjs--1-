import { isStagingEnv } from 'helpers/utils/helper';
import { Helmet } from 'react-helmet';

export const MetaTags = () => {
  if (!isStagingEnv()) {
    return (
      <Helmet>
        <meta
          name="description"
          content="ZehMizeh is the Jewish freelancing platform, connecting businesses with skills freelancers. Find remote talent for your projects today!"
        />

        <meta
          name="keywords"
          content="freelancer marketplace, freelancers, project, outsourcing, Jewish, frum, heimishe, hiring freelancers, remote work, hire Israeli, zehmezeh ,zeh mezeh ,zemeze ,zemize ,zehmize ,zeh mize ,zeh mi zeh ,zeh me zeh ,ze mi ze ,ze me ze ,zeh mizeh ,zemizeh ,zemezeh"
        />

        <link rel="canonical" href="https://www.zehmizeh.com" />

        <meta name="robots" content="index, follow" />

        <meta property="og:title" content="The Jewish freelancing platform" />
        <meta property="og:description" content="Connect with remote, Jewish freelancers on ZehMizeh" />
        <meta property="og:image" content="https://www.zehmizeh.com/images/zehmizeh-logo.png" />
        <meta property="og:url" content="https://www.zehmizeh.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@yourtwitterhandle" />
        <meta name="twitter:title" content="ZehMizeh - The Jewish freelancing platform" />
        <meta name="twitter:description" content="Connect with remote, Jewish freelancers on ZehMizeh" />
        <meta name="twitter:image" content="https://www.zehmizeh.com/images/zehmizeh-logo.png" />

        {/* Google tag manager */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DWLW5WZM17"></script>

        {/* Google tag manager */}
        <script type="text/javascript">{`window.dataLayer = window.dataLayer || [];
          function gtag() {
            dataLayer.push(arguments);
          }
          gtag('js', new Date());
          gtag('config', 'G-DWLW5WZM17');`}</script>

        {/* Google tag manager */}
        <script type="text/javascript">{`(function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
          var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-W4BL8DL');`}</script>

        {/* Clarity */}
        <script type="text/javascript">{`(function (c, l, a, r, i, t, y) {
          c[a] =
            c[a] ||
            function () {
              (c[a].q = c[a].q || []).push(arguments);
            };
          t = l.createElement(r);
          t.async = 1;
          t.src = 'https://www.clarity.ms/tag/' + i;
          y = l.getElementsByTagName(r)[0];
          y.parentNode.insertBefore(t, y);
        })(window, document, 'clarity', 'script', 'jnx4lzwl42')`}</script>

        <noscript>{`<iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-W4BL8DL"
              height="0"
              width="0"
              style="display: none; visibility: hidden"
            ></iframe>`}</noscript>

        {/*  Partnero Universal */}
        <script>
          {`(function (p, t, n, e, r, o) {
            p["__partnerObject"] = r;
            function f() {
              var c = { a: arguments, q: [] };
              var r = this.push(c);
              return "number" != typeof r ? r : f.bind(c.q);
            }
            f.q = f.q || [];
            p[r] = p[r] || f.bind(f.q);
            p[r].q = p[r].q || f.q;
            o = t.createElement(n);
            var _ = t.getElementsByTagName(n)[0];
            o.async = 1;
            o.src = e + "?v" + ~~(new Date().getTime() / 1e6);
            _.parentNode.insertBefore(o, _);
          })(
            window,
            document,
            "script",
            "https://app.partnero.com/js/universal.js",
            "po"
          );
          po("settings", "assets_host", "https://assets.partnero.com");
          po("program", "FXE3MQFC", "load");`}
        </script>
        {/* End Partnero Universal */}
      </Helmet>
    );
  }

  return <Helmet></Helmet>;
};
