// content/wlm-notification.js
// Intercepta notificaciones de WhatsApp y muestra popup estilo WLM 2009

const WLMNotification = (() => {

    const WLM_LOGO = chrome.runtime.getURL('assets/icons/chat/wlm_logo.png');
    let activePopup = null;
    let hideTimer = null;

    // ─── Inyectar estilos del popup ──────────────────────────────────────────
    function injectStyles() {
        if (document.getElementById('wlm-notif-style')) return;
        const style = document.createElement('style');
        style.id = 'wlm-notif-style';
        style.textContent = `
            #wlm-notif-popup {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 280px;
                z-index: 999999;
                font-family: 'Segoe UI', 'Tahoma', sans-serif;
                font-size: 11px;
                color: #1a1a2e;

                background: linear-gradient(to bottom, #c6def9, #e9f6fd 70%, #e9f6fd 30%, #dff0fe);
                border-left:   1.5px solid #eff5fe;
                border-top:    1.5px solid #eff5fe;
                border-bottom: 1.5px solid #5ed1f3;
                border-right:  1.5px solid #5ed1f3;
                box-shadow: inset 0 0 0 1px #ffffff80, 0 0 16px #000000b8;
                border-radius: 10px;

                animation: wlm-slide-in 0.25s ease-out;
                overflow: hidden;
            }

            #wlm-notif-popup.hiding {
                animation: wlm-slide-out 0.3s ease-in forwards;
            }

            @keyframes wlm-slide-in {
                from { opacity: 0; transform: translateY(20px); }
                to   { opacity: 1; transform: translateY(0);    }
            }

            @keyframes wlm-slide-out {
                from { opacity: 1; transform: translateY(0);    }
                to   { opacity: 0; transform: translateY(20px); }
            }

            /* ── Header ── */
            #wlm-notif-header {
                display: flex;
                align-items: center;
                gap: 5px;
                padding: 4px 8px;
                background: linear-gradient(to right,
                    #4a90d9, #5ba3e8 40%, #7ec0f5 70%, #4a90d9);
                border-radius: 8px 8px 0 0;
                border-bottom: 1px solid #2a6bbf;
            }

            #wlm-notif-header img {
                width: 14px;
                height: 14px;
                image-rendering: pixelated;
            }

            #wlm-notif-header span {
                font-size: 10px;
                font-weight: bold;
                color: white;
                text-shadow: 0 1px 2px rgba(0,0,0,0.4);
                flex: 1;
            }

            #wlm-notif-close {
                cursor: pointer;
                color: rgba(255,255,255,0.8);
                font-size: 12px;
                line-height: 1;
                padding: 1px 3px;
                border-radius: 3px;
                transition: background 0.1s;
            }

            #wlm-notif-close:hover {
                background: rgba(255,255,255,0.25);
                color: white;
            }

            /* ── Body ── */
            #wlm-notif-body {
                display: flex;
                align-items: flex-start;
                gap: 10px;
                padding: 10px 12px;
            }

            #wlm-notif-avatar {
                width: 48px;
                height: 48px;
                border-radius: 4px;
                border: 1px solid rgba(0,0,0,0.15);
                object-fit: cover;
                flex-shrink: 0;
                background: #ddeeff;
            }

            #wlm-notif-text {
                flex: 1;
                overflow: hidden;
            }

            #wlm-notif-name {
                font-weight: bold;
                font-size: 12px;
                color: #1a3a6a;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            #wlm-notif-msg {
                font-size: 11px;
                color: #333;
                margin-top: 3px;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            /* ── Footer ── */
            #wlm-notif-footer {
                text-align: right;
                padding: 4px 10px 6px;
                border-top: 1px solid rgba(100,160,220,0.3);
            }

            #wlm-notif-footer a {
                font-size: 10px;
                color: #0066cc;
                text-decoration: none;
                cursor: pointer;
            }

            #wlm-notif-footer a:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);
    }

    // ─── Crear y mostrar el popup ─────────────────────────────────────────────
    function showPopup({ name, message, avatar }) {
        // Si ya hay uno visible, quitarlo inmediatamente
        if (activePopup) {
            activePopup.remove();
            activePopup = null;
            clearTimeout(hideTimer);
        }

        const popup = document.createElement('div');
        popup.id = 'wlm-notif-popup';
        popup.innerHTML = `
            <div id="wlm-notif-header">
                <img src="${WLM_LOGO}" alt="WLM" />
                <span>Windows Live Messenger</span>
                <span id="wlm-notif-close">✕</span>
            </div>
            <div id="wlm-notif-body">
                <img id="wlm-notif-avatar" src="${avatar}" alt="avatar"
                     onerror="this.src='${chrome.runtime.getURL('assets/icons/frames/placeholder-pfp-contact.png')}'" />
                <div id="wlm-notif-text">
                    <div id="wlm-notif-name">${name}</div>
                    <div id="wlm-notif-msg">${message}</div>
                </div>
            </div>
            <div id="wlm-notif-footer">
                <a id="wlm-notif-options">Options</a>
            </div>
        `;

        document.body.appendChild(popup);
        activePopup = popup;

        // Cerrar al hacer click en X
        popup.querySelector('#wlm-notif-close').addEventListener('click', () => dismiss());

        // Cerrar al hacer click en el cuerpo (abre el chat)
        popup.querySelector('#wlm-notif-body').addEventListener('click', () => dismiss());

        // Auto-cerrar después de 6 segundos
        hideTimer = setTimeout(() => dismiss(), 6000);
    }

    function dismiss() {
        if (!activePopup) return;
        activePopup.classList.add('hiding');
        setTimeout(() => {
            if (activePopup) { activePopup.remove(); activePopup = null; }
        }, 300);
        clearTimeout(hideTimer);
    }

    // ─── Interceptar la API de Notification ──────────────────────────────────
    function interceptNotifications() {
        const OriginalNotification = window.Notification;

        // Sobreescribir el constructor
        window.Notification = function(title, options = {}) {
            // Mostrar nuestro popup WLM
            showPopup({
                name:    title || 'WhatsApp',
                message: options.body || '',
                avatar:  options.icon || '',
            });

            // Devolver un objeto fake para que WhatsApp no rompa
            return {
                close: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
            };
        };

        // Copiar propiedades estáticas necesarias
        window.Notification.permission       = OriginalNotification.permission;
        window.Notification.requestPermission = OriginalNotification.requestPermission.bind(OriginalNotification);
    }

    function init() {
        injectStyles();
        interceptNotifications();
    }

    return { init };

})();