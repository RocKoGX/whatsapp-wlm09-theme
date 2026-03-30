// content/style-injector.js
// Inyecta wlm-theme.css, restaura el tema de color y la escena de fondo guardados

(() => {

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
    function restoreSavedTheme() {
        chrome.storage.local.get('wlm_theme_css', result => {
            const css = result['wlm_theme_css'];
            if (!css) return;
            let el = document.getElementById('wlm-color-theme');
            if (!el) {
                el = document.createElement('style');
                el.id = 'wlm-color-theme';
                document.head.appendChild(el);
            }
            el.textContent = css;
        });
    }

    // ─── Restaurar escena de fondo seleccionada ───────────────
    // Si el usuario eligió una imagen propia, sobreescribe el
    // <style id="wlm-gradient-scene"> que crea icon-replacer.js.
    // Usamos un retry porque icon-replacer.js lo inyecta después.
    function restoreSavedScene() {
        chrome.storage.local.get('wlm_scene_selected', result => {
            const url = result['wlm_scene_selected'];
            if (!url) return; // null → escena predeterminada, no hacer nada

            const cls = '.x570efc.x9f619.x78zum5.x1okw0bk.x6s0dn4.x1peatla.x14ug900.x1280gxy.x889kno.x1a8lsjc.x106a9eq.x1xnnf8n';
            const css = `${cls} { background: url('${url}') no-repeat center / cover, var(--wlm-1) !important; }`;

            let attempts = 0;
            const tryInject = setInterval(() => {
                const el = document.getElementById('wlm-gradient-scene');
                if (el) {
                    el.textContent = css;
                    clearInterval(tryInject);
                }
                if (++attempts > 20) clearInterval(tryInject); // máx ~2 segundos
            }, 100);
        });
    }

    // ─── Inicializar ──────────────────────────────────────────
    function init() {
        injectThemeCSS();
        restoreSavedTheme();
        restoreSavedScene();
    }

    if (document.head) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
