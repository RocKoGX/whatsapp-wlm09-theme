// content/style-injector.js
// Inyecta wlm-theme.css y restaura el tema de color guardado

(() => {

    const STORAGE_KEY_THEME = 'wlm_color_theme';

    // ─── Inyectar hoja de estilos principal ──────────────────
    function injectThemeCSS() {
        if (document.getElementById('wlm-theme')) return;
        const link = document.createElement('link');
        link.id   = 'wlm-theme';
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = chrome.runtime.getURL('styles/wlm-theme.css');
        document.head.appendChild(link);
    }

    // ─── Restaurar variables del tema guardado ────────────────
    // Las variables se definen en popup.js (WLM_THEMES).
    // El content script no tiene acceso al array del popup,
    // así que guardamos el CSS completo de variables junto al ID.
    function restoreSavedTheme() {
        chrome.storage.local.get(['wlm_color_theme', 'wlm_theme_css'], result => {
            const css = result['wlm_theme_css'];
            if (!css) return;  // sin tema guardado → usa el azul por defecto del :root

            let el = document.getElementById('wlm-color-theme');
            if (!el) {
                el = document.createElement('style');
                el.id = 'wlm-color-theme';
                document.head.appendChild(el);
            }
            el.textContent = css;
        });
    }

    // ─── Esperar a que <head> esté disponible ─────────────────
    function init() {
        injectThemeCSS();
        restoreSavedTheme();
    }

    if (document.head) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
