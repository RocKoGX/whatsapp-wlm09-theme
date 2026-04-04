// content/main.js
// Punto de entrada y coordinador de módulos WLM

(() => {

    function init() {
        IconReplacer.initStyles();
        AdBanner.loadAds();

        IconReplacer.run();
        AdBanner.run();
        DragWindow.init();

        startObserver();
    }

    function startObserver() {
        const observer = new MutationObserver(() => {
            IconReplacer.run();
            AdBanner.run();
            DragWindow.init();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
