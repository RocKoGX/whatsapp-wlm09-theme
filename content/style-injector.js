// content/style-injector.js
// Inyecta wlm-theme.css y restaura: tema de color, escena de fondo, color de texto del avatar

(() => {

    const TEXT_NORMAL = `
        .wlm-username {
            font: 9pt "Segoe UI", sans-serif;
            color: black;
            text-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 1px #fff,
                         0 0 2px #fff, 0 0 1px #fff, 0 0 1px #fff,
                         0 0 5px #fff, 0 0 1px #fff;
        }
        .wlm-status { 
            font: 6pt "Segoe UI", sans-serif;
            color: #000000;
            text-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 1px #fff,
                0 0 2px #fff, 0 0 1px #fff, 0 0 1px #fff,
                0 0 5px #fff, 0 0 1px #fff; 
        }
        .x570efc.x9f619.x78zum5.x1okw0bk.x6s0dn4.x1peatla.x14ug900.x1280gxy.x889kno.x1a8lsjc.x106a9eq.x1xnnf8n .html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft{
            text-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 1px #fff,
                0 0 2px #fff, 0 0 1px #fff, 0 0 1px #fff,
                0 0 5px #fff, 0 0 1px #fff; 
        }
    `;

    const TEXT_INVERTED = `
        .wlm-username {
            font: 9pt "Segoe UI", sans-serif;
            color: white;
            text-shadow: 0 0 2px #000, 0 0 10px #000, 0 0 1px #000,
                         0 0 2px #000, 0 0 1px #000, 0 0 1px #000,
                         0 0 5px #000, 0 0 1px #000;
        }
        .wlm-status { 
            font: 6pt "Segoe UI", sans-serif;
            color: #ffffff;
            text-shadow: 0 0 2px #000, 0 0 10px #000, 0 0 1px #000,
                0 0 2px #000, 0 0 1px #000, 0 0 1px #000,
                0 0 5px #000, 0 0 1px #000;
        }
        .x570efc.x9f619.x78zum5.x1okw0bk.x6s0dn4.x1peatla.x14ug900.x1280gxy.x889kno.x1a8lsjc.x106a9eq.x1xnnf8n .html-span.xdj266r.x14z9mp.xat24cr.x1lziwak.xexx8yu.xyri2b.x18d9i69.x1c1uobl.x1hl2dhg.x16tdsg8.x1vvkbs.x1lliihq.x193iq5w.x6ikm8r.x10wlt62.xlyipyv.xuxw1ft{
            text-shadow: 0 0 2px #000, 0 0 10px #000, 0 0 1px #000,
                0 0 2px #000, 0 0 1px #000, 0 0 1px #000,
                0 0 5px #000, 0 0 1px #000;
        }
    `;

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

    // ─── Restaurar variables del tema de color ────────────────
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

    // ─── Restaurar color de texto del avatar ──────────────────
    function restoreTextColor() {
        chrome.storage.local.get('wlm_text_inverted', result => {
            const isInverted = result['wlm_text_inverted'] || false;
            const css = isInverted ? TEXT_INVERTED : TEXT_NORMAL;

            let el = document.getElementById('wlm-text-color');
            if (!el) {
                el = document.createElement('style');
                el.id = 'wlm-text-color';
                document.head.appendChild(el);
            }
            el.textContent = css;
        });
    }

    // ─── Restaurar escena de fondo seleccionada ───────────────
    function restoreSavedScene() {
        chrome.storage.local.get('wlm_scene_selected', result => {
            const url = result['wlm_scene_selected'];
            if (!url) return;

            const cls = '.x570efc.x9f619.x78zum5.x1okw0bk.x6s0dn4.x1peatla.x14ug900.x1280gxy.x889kno.x1a8lsjc.x106a9eq.x1xnnf8n';
            const css = `${cls} { background: url('${url}') no-repeat center / cover, var(--wlm-1) !important; }`;

            let attempts = 0;
            const tryInject = setInterval(() => {
                const el = document.getElementById('wlm-gradient-scene');
                if (el) {
                    el.textContent = css;
                    clearInterval(tryInject);
                }
                if (++attempts > 20) clearInterval(tryInject);
            }, 100);
        });
    }

    // ─── Inicializar ──────────────────────────────────────────
    function init() {
        injectThemeCSS();
        restoreSavedTheme();
        restoreTextColor();
        restoreSavedScene();
    }

    if (document.head) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
