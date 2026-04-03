/**
 * Injects HTML/JS patterns commonly used by Wappalyzer-class tools to identify Magento 2.
 * Not affiliated with Adobe or Magento; for scanner compatibility only.
 */
export const MagentoWappalyzerSpoof = () => {
  return (
    <>
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
    </>
  );
};
