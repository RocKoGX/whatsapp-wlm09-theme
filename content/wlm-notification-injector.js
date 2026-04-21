(function () {
    const WLM_LOGO    = document.currentScript.getAttribute('data-wlm-logo');
    const PLACEHOLDER = document.currentScript.getAttribute('data-placeholder');
    const FRAME = document.currentScript.getAttribute('data-frame');

    // ── Estilos ──────────────────────────────────────────────────────────────
    const style = document.createElement('style');
    style.textContent = `
        #wlm-notif-popup {
            position: fixed;

            transition: bottom 0.2s ease;
            right: 20px;
            width: 240px;
            z-index: 999999;
            font-family: 'Segoe UI', 'Tahoma', sans-serif;
            font-size: 11px;
            color: #1a1a2e;
            background: linear-gradient(to bottom, #c6def9, #e9f6fd 70%, #e9f6fd 30%, #dff0fe);
            border-left:   1.5px solid #eff5fe;
            border-top:    1.5px solid #eff5fe;
            border-bottom: 1.5px solid #5ed1f3;
            border-right:  1.5px solid #5ed1f3;
            box-shadow: inset 0 0 0 1px #ffffff80, 0 0 14px #010101;
            border-radius: 8px;
            animation: wlm-slide-in 0.25s ease-out;
            overflow: hidden;
        }
        #wlm-notif-popup.hiding {
            animation: wlm-slide-out 0.3s ease-in forwards;
        }
        @keyframes wlm-slide-in {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes wlm-slide-out {
            from { opacity: 1; transform: translateY(0); }
            to   { opacity: 0; transform: translateY(20px); }
        }
        #wlm-notif-header {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 4px 8px;
        }
        #wlm-notif-header img.wlm-logo {
            width: 14px; height: 14px; image-rendering: pixelated;
        }
        #wlm-notif-header span.wlm-title {
            font-size: 10px; color: #2a2a2a;
            flex: 1;
        }
        #wlm-notif-close {
            cursor: pointer; color: rgb(24 24 24 / 80%);
            font-size: 12px; line-height: 1; padding: 1px 3px;
            border-radius: 3px; transition: background 0.1s;
        }
        #wlm-notif-close:hover { background: rgb(255 255 255 / 0%); color: #234e87; }
        #wlm-notif-body {
            display: flex; align-items: flex-start;
            gap: 10px; padding: 10px 12px; cursor: pointer;
            margin-left: 4px;
        }
        #wlm-notif-avatar {
            width: 48px; height: 48px; border-radius: 4px;
            border: 1px solid rgba(0,0,0,0.15);
            object-fit: cover; flex-shrink: 0; background: #ddeeff;
        }
        #wlm-notif-text { flex: 1; overflow: hidden; margin-left: 8px; }
        #wlm-notif-name {
            font-weight: bold; font-size: 12px; color: #1a3a6a;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        #wlm-notif-msg {
            font-size: 11px; color: #333; margin-top: 3px;
            display: -webkit-box; -webkit-line-clamp: 2;
            -webkit-box-orient: vertical; overflow: hidden;
        }
        #wlm-notif-footer {
            text-align: right; padding: 4px 10px 6px;
        }
        #wlm-notif-footer span {
            font-size: 10px; color: #0066cc; cursor: pointer;
        }
        #wlm-notif-footer span:hover { text-decoration: underline; }

        #wlm-notif-avatar-wrapper {
            position: relative;
            width: 48px;
            height: 48px;
            flex-shrink: 0;
        }
        #wlm-notif-avatar {
            width: 48px;
            height: 48px;
            border-radius: 4px;
            object-fit: cover;
            background: #ddeeff;
            display: block;
        }
        #wlm-notif-frame {
            position: absolute;
            top: -12px;
            left: -17px;
            width: 80px;
            height: 80px;
            pointer-events: none;
            z-index: 2;
        }
    `;
    document.head.appendChild(style);

    // ── Estado ───────────────────────────────────────────────────────────────
    const POPUP_HEIGHT = 120; // altura aproximada de cada popup en px
    const POPUP_GAP    = 8;   // espacio entre popups
    const popups       = [];  // lista de popups activos

    function getBottomOffset(index) {
        // Calcula la posición bottom de cada popup según su índice en la pila
        return 20 + index * (POPUP_HEIGHT + POPUP_GAP);
    }

    function reposition() {
        // Recoloca todos los popups después de cerrar uno
        popups.forEach((entry, i) => {
            entry.el.style.bottom = `${getBottomOffset(i)}px`;
        });
    }

    function dismiss(entry) {
        if (!entry || entry.dismissed) return;
        entry.dismissed = true;
        clearTimeout(entry.timer);

        entry.el.classList.add('hiding');
        setTimeout(() => {
            entry.el.remove();
            const idx = popups.indexOf(entry);
            if (idx !== -1) popups.splice(idx, 1);
            reposition();
        }, 300);
    }

    function showPopup({ name, message, avatar }) {
        const popup = document.createElement('div');
        popup.id = 'wlm-notif-popup';
        popup.style.bottom = `${getBottomOffset(popups.length)}px`;
        popup.innerHTML = `
            <div id="wlm-notif-header">
                <img class="wlm-logo" src="${WLM_LOGO}" alt="WLM" />
                <span class="wlm-title">Windows Live Messenger</span>
                <span id="wlm-notif-close">✕</span>
            </div>
            <div id="wlm-notif-body">
                <div id="wlm-notif-avatar-wrapper">
                    <img id="wlm-notif-avatar" src="${avatar}" alt="avatar" />
                    <img id="wlm-notif-frame" src="${FRAME}" alt="" />
                </div>
                <div id="wlm-notif-text">
                    <div id="wlm-notif-name">${name}</div>
                    <div id="wlm-notif-msg">${message}</div>
                </div>
            </div>
            <div id="wlm-notif-footer"><span>Options</span></div>
        `;

        popup.querySelector('#wlm-notif-avatar').onerror = function () {
            this.src = PLACEHOLDER;
        };

        document.body.appendChild(popup);

        const entry = {
            el:        popup,
            dismissed: false,
            timer:     null,
        };

        entry.timer = setTimeout(() => dismiss(entry), 6000);
        popups.push(entry);

        popup.querySelector('#wlm-notif-close').addEventListener('click', (e) => {
            e.stopPropagation();
            dismiss(entry);
        });

        popup.querySelector('#wlm-notif-body').addEventListener('click', () => {
            dismiss(entry);
        });
    }

    // ── Interceptar Notification ─────────────────────────────────────────────
    const OriginalNotification = window.Notification;

    window.Notification = function(title, options = {}) {
        // Mostrar popup WLM
        showPopup({
            name:    title || 'WhatsApp',
            message: options.body  || '',
            avatar:  options.icon  || '',
        });

        // Notificación del SO solo si WhatsApp NO está en foco
        if (document.hidden || !document.hasFocus()) {
            return new OriginalNotification(title, options);
        }

        return {
            close: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        };
    };

    window.Notification.permission        = OriginalNotification.permission;
    window.Notification.requestPermission = OriginalNotification.requestPermission.bind(OriginalNotification);

})();