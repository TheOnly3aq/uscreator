/**
 * Injects HTML/JS/DOM patterns that Wappalyzer-style tools match to common stacks.
 * For local scanner compatibility only; not affiliated with those products.
 */
export const WappalyzerTechSpoof = () => {
  return (
    <>
      {/* Magento 2 */}
      <script
        type="text/x-magento-init"
        dangerouslySetInnerHTML={{ __html: "{}" }}
      />
      <script
        type="text/javascript"
        data-requiremodule="mage/bootstrap"
        src="/static/js/mage/bootstrap.js"
        async
      />
      <script
        type="text/javascript"
        data-requiremodule="Magento_Theme/js/theme"
        src="/static/js/mage/theme.js"
        async
      />
      <script
        type="text/javascript"
        src="/static/_requirejs/require.js"
        async
      />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html:
            "(function(){window.Mage=window.Mage||{};window.VarienForm=function(){};})();",
        }}
      />

      {/* WordPress */}
      <script src="/wp-content/themes/twentytwentyfour/theme.js" defer />
      <script src="/wp-includes/js/wp-embed.min.js" async />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: "(function(){window.wp_username='';})();",
        }}
      />

      {/* Vue.js */}
      <span
        className="vue-app pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        data-v-app=""
        aria-hidden
      />
      <script src="/static/vendor/vue-3.4.21/vue.min.js" defer />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html:
            "(function(){window.Vue={version:'3.4.21'};window.__VUE__=true;window.VueRoot={};})();",
        }}
      />

      {/* Storyblok (js globals; avoids third-party image requests) */}
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html:
            "(function(){window.StoryblokBridge=function(){};window.storyblokRegisterEvent=function(){};})();",
        }}
      />

      {/* Nuxt.js */}
      <div id="__nuxt" className="hidden" aria-hidden />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{ __html: "window.__NUXT__={};" }}
      />
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html:
            "(function(){window['$nuxt']={};window.useNuxtApp=function(){};})();",
        }}
      />
      <script src="/_nuxt/entry.js" defer />

      {/* Gatsby */}
      <div id="___gatsby" className="hidden" aria-hidden />
      <style
        id="gatsby-inlined-css"
        dangerouslySetInnerHTML={{ __html: "/* gatsby placeholder */" }}
      />

      {/* AngularJS (ng-app / angular globals) */}
      <div {...{ "ng-app": "spoof" }} className="hidden" aria-hidden />

      {/* Svelte + SvelteKit */}
      <div id="svelte-announcer" className="hidden" aria-hidden />
      <div className="svelte-fingerprint0 hidden" aria-hidden />
      <a
        href="#wappalyzer-spoof"
        data-sveltekit-preload-data="hover"
        className="pointer-events-none absolute h-px w-px overflow-hidden opacity-0"
        tabIndex={-1}
        aria-hidden
      >
        <span className="sr-only">prefetch</span>
      </a>

      {/* Stimulus */}
      <div data-controller="fingerprints" className="hidden" aria-hidden />

      {/* Alpine.js */}
      <div {...{ "x-data": "{}" }} className="hidden" aria-hidden />

      {/* Quasar */}
      <div id="q-app" className="hidden" aria-hidden />

      {/* Qwik */}
      <span {...{ "q:version": "1.5.5" }} className="hidden" aria-hidden />

      {/* qiankun */}
      <div
        id="__qiankun_root"
        data-version="2.10.0"
        className="hidden"
        aria-hidden
      />

      {/* Htmx (dom: script[data-src*='/dist/htmx.min.js']) */}
      <script
        data-src="/static/vendor/htmx.org@1.9.12/dist/htmx.min.js"
        defer
      />

      {/* Vendor scriptSrc stubs */}
      <script src="/static/vendor/backbone-1.5.0/backbone.min.js" defer />
      <script src="/static/vendor/jquery-3.7.1/jquery.min.js" defer />
      <script src="/static/vendor/angular-1.8.3/angular.min.js" defer />
      <script src="/static/vendor/alpine.min.js" defer />
      <script src="/static/vendor/htmx.org@1.9.12/dist/htmx.min.js" defer />
      <script src="/static/vendor/aframe/1.5.0/aframe.min.js" defer />

      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `(function(){
  window.ng = window.ng || {};
  window.ng.coreTokens = window.ng.coreTokens || {};
  window.ng.probe = window.ng.probe || function(){};
  window.Ember = { VERSION: '5.8.0' };
  window.EmberENV = window.EmberENV || {};
  window.Backbone = { VERSION: '1.5.0' };
  window.angular = window.angular || { version: { full: '1.8.3' } };
  window.jQuery = function(){};
  window.jQuery.fn = window.jQuery.fn || {};
  window.jQuery.fn.jquery = '3.7.1';
  window.$ = window.jQuery;
  window.Alpine = { version: '3.13.5' };
  window.__svelte = {};
  window.Solid$$ = window.Solid$$ || {};
  window.litElementVersions = window.litElementVersions || ['4.0.0'];
  window.litHtmlVersions = window.litHtmlVersions || ['3.0.0'];
  window.htmx = window.htmx || {};
  window.Turbo = window.Turbo || {};
  window.AFRAME = { version: '1.5.0' };
  window._$HY = { init: function(){} };
  window.__POWERED_BY_QIANKUN__ = true;
})();`,
        }}
      />
    </>
  );
};
