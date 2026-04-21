(function () {
    const SOUND_URL   = document.currentScript.getAttribute('data-sound');
    const WLM_LOGO    = document.currentScript.getAttribute('data-wlm-logo');
    const PLACEHOLDER = document.currentScript.getAttribute('data-placeholder');
    const FRAME       = document.currentScript.getAttribute('data-frame');

    // ── Audio ─────────────────────────────────────────────────────────────────
    function playSound() {
        const audio = new Audio(SOUND_URL);
        audio.volume = 1;
        audio.play().catch(() => {});
    }

    // ── Foco ──────────────────────────────────────────────────────────────────
    let isPageFocused = !document.hidden && document.hasFocus();

    document.addEventListener('visibilitychange', () => {
        isPageFocused = !document.hidden && document.hasFocus();
    });
    window.addEventListener('focus', () => { isPageFocused = true; });
    window.addEventListener('blur',  () => { isPageFocused = false; });

    // ── Detectar chat activo ──────────────────────────────────────────────────
    function getActiveChatName() {
        const header = document.querySelector('#main header span[dir="auto"]');
        return header ? header.textContent.trim() : null;
    }

    // ── Detectar remitente del mensaje entrante ───────────────────────────────
    function getMessageInfo(messageInNode) {
        // Texto — cualquier contenido de texto dentro del mensaje
        const copyable = messageInNode.querySelector('.copyable-text');
        const text = copyable
            ? copyable.textContent.trim().slice(0, 100)
            : '📎 Archivo';

        // Avatar
        const avatarEl = messageInNode.querySelector('img');
        const avatar   = avatarEl ? avatarEl.src : '';

        return { text, avatar };
    }

    // ── Buscar avatar en lista de chats por nombre ────────────────────────────
    function findAvatarByName(name) {
        const items = document.querySelectorAll('#pane-side [data-testid="cell-frame-container"]');
        for (const item of items) {
            const nameEl = item.querySelector('span[dir="auto"][title]');
            if (nameEl && nameEl.title === name) {
                const img = item.querySelector('img');
                if (img) return img.src;
            }
        }
        return '';
    }

    // ── Popup ─────────────────────────────────────────────────────────────────
    const POPUP_HEIGHT = 120;
    const POPUP_GAP    = 8;
    const popups       = [];

    // Inyectar estilos del popup
    const style = document.createElement('style');
    style.textContent = `
        .wlm-notif-popup {
            position: fixed;
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
            overflow: hidden;
            animation: wlm-slide-in 0.25s ease-out;
            transition: bottom 0.2s ease;
        }
        .wlm-notif-popup.hiding {
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
        .wlm-notif-header {
            display: flex; align-items: center; gap: 5px; padding: 4px 8px;
        }
        .wlm-notif-header img.wlm-logo {
            width: 14px; height: 14px; image-rendering: pixelated;
        }
        .wlm-notif-header span.wlm-title {
            font-size: 10px; color: #2a2a2a; flex: 1;
        }
        .wlm-notif-close {
            cursor: pointer; color: rgb(24 24 24 / 80%);
            font-size: 12px; line-height: 1; padding: 1px 3px; border-radius: 3px;
        }
        .wlm-notif-close:hover { color: #234e87; }
        .wlm-notif-body {
            display: flex; align-items: flex-start;
            gap: 10px; padding: 10px 12px; cursor: pointer; margin-left: 4px;
        }
        .wlm-notif-avatar-wrapper {
            position: relative; width: 48px; height: 48px; flex-shrink: 0;
        }
        .wlm-notif-avatar {
            width: 48px; height: 48px; border-radius: 4px;
            object-fit: cover; background: #ddeeff; display: block;
        }
        .wlm-notif-frame {
            position: absolute; top: -12px; left: -17px;
            width: 80px; height: 80px; pointer-events: none; z-index: 2;
        }
        .wlm-notif-text { flex: 1; overflow: hidden; margin-left: 8px; }
        .wlm-notif-name {
            font-weight: bold; font-size: 12px; color: #1a3a6a;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .wlm-notif-msg {
            font-size: 11px; color: #333; margin-top: 3px;
            display: -webkit-box; -webkit-line-clamp: 2;
            -webkit-box-orient: vertical; overflow: hidden;
        }
        .wlm-notif-footer {
            text-align: right; padding: 4px 10px 6px;
        }
        .wlm-notif-footer span {
            font-size: 10px; color: #0066cc; cursor: pointer;
        }
        .wlm-notif-footer span:hover { text-decoration: underline; }
    `;
    document.head.appendChild(style);

    function getBottomOffset(index) {
        return 20 + index * (POPUP_HEIGHT + POPUP_GAP);
    }

    function reposition() {
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
        popup.className = 'wlm-notif-popup';
        popup.style.bottom = `${getBottomOffset(popups.length)}px`;
        popup.innerHTML = `
            <div class="wlm-notif-header">
                <img class="wlm-logo" src="${WLM_LOGO}" alt="WLM" />
                <span class="wlm-title">Windows Live Messenger</span>
                <span class="wlm-notif-close">✕</span>
            </div>
            <div class="wlm-notif-body">
                <div class="wlm-notif-avatar-wrapper">
                    <img class="wlm-notif-avatar" src="${avatar}" alt="avatar"
                         onerror="this.src='${PLACEHOLDER}'" />
                    <img class="wlm-notif-frame" src="${FRAME}" alt="" />
                </div>
                <div class="wlm-notif-text">
                    <div class="wlm-notif-name">${name}</div>
                    <div class="wlm-notif-msg">${message}</div>
                </div>
            </div>
            <div class="wlm-notif-footer"><span>Options</span></div>
        `;

        document.body.appendChild(popup);

        const entry = { el: popup, dismissed: false, timer: null };
        entry.timer = setTimeout(() => dismiss(entry), 6000);
        popups.push(entry);

        popup.querySelector('.wlm-notif-close').addEventListener('click', (e) => {
            e.stopPropagation();
            dismiss(entry);
        });
        popup.querySelector('.wlm-notif-body').addEventListener('click', () => dismiss(entry));
    }

    // ── Lógica principal al detectar mensaje entrante ─────────────────────────
    function handleIncoming(messageInNode) {
        if (!isPageFocused) return; // sin foco: WhatsApp ya maneja la notificación nativa

        const activeChatName = getActiveChatName();
        const { text, avatar } = getMessageInfo(messageInNode);

        // Caso 1: mensaje en el chat activo → solo sonido
        // En chats individuales no hay nombre de remitente visible en el mensaje,
        // así que si hay un chat abierto y el mensaje viene de ese contenedor, es caso 1
        const isActiveChat = !!activeChatName &&
            messageInNode.closest('#main') !== null;

        // Distinguir si es el chat activo o un chat diferente:
        // Si el mensaje apareció en #main = chat abierto actualmente
        if (isActiveChat) {
            playSound();
            return;
        }

        // Caso 2: mensaje de otro chat → sonido + popup
        playSound();
        const avatarFallback = avatar || findAvatarByName(activeChatName || '');
        showPopup({
            name:    activeChatName || 'WhatsApp',
            message: text,
            avatar:  avatarFallback,
        });
    }

    // ── Verificar si el mensaje es realmente nuevo (al final del chat) ─────────
    function isAtBottom(messageInNode) {
        const container = document.querySelector('.x78zum5.xdt5ytf.x5yr21d.xyyilfv.xlkovuz.x1q80dvb') || document.querySelector('#main');
        if (!container) return true;

        const containerRect = container.getBoundingClientRect();
        const messageRect   = messageInNode.getBoundingClientRect();

        const containerMidpoint = containerRect.top + containerRect.height / 2;

        return messageRect.top >= containerMidpoint;
    }

    // ── Observer — una sola instancia, nunca se duplica ───────────────────────
    let messageObserver = null;
    let observerReady   = false;  // ← evita disparos durante carga inicial
    let lastSoundTime   = 0;      // ← cooldown anti-duplicado
    const SOUND_COOLDOWN_MS = 1000;

    function startObserver() {
        if (messageObserver) {
            messageObserver.disconnect();
            messageObserver = null;
        }

        observerReady = false; // bloquear mientras carga

        const container = document.querySelector('.x78zum5.xdt5ytf.x5yr21d.xyyilfv.xlkovuz.x1q80dvb') || document.querySelector('#main');
        if (!container) return;

        // Esperar 1.5s después de cambiar de chat antes de activar
        // Así los mensajes históricos ya se cargaron y no disparan el sonido
        setTimeout(() => { observerReady = true; }, 1500);

        messageObserver = new MutationObserver((mutations) => {
            if (!observerReady) return; // ignorar durante carga inicial

            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== 1) continue;

                    const messageIn = node.classList?.contains('message-in')
                        ? node
                        : node.querySelector?.('.message-in');

                    if (messageIn) {
                        if (!isAtBottom(messageIn)) break;
                        // Cooldown: ignorar si sonó hace menos de SOUND_COOLDOWN_MS
                        const now = Date.now();
                        if (now - lastSoundTime < SOUND_COOLDOWN_MS) break;
                        lastSoundTime = now;

                        handleIncoming(messageIn);
                        break;
                    }
                }
            }
        });

        messageObserver.observe(container, { childList: true, subtree: true });
    }

    // Reiniciar observer al cambiar de chat
    function watchChatChanges() {
        const app = document.querySelector('#app');
        if (!app) return;

        let lastChatName = null;

        new MutationObserver(() => {
            const currentChat = getActiveChatName();
            if (currentChat !== lastChatName) {
                lastChatName = currentChat;
                startObserver(); // reiniciar con nuevo contenedor
            }
        }).observe(app, { childList: true, subtree: true });
    }

    // ── Observer de #pane-side para mensajes de otros chats ───────────────────
    let paneObserver = null;

    function getChatNameFromItem(chatItem) {
        const nameEl = chatItem.querySelector('span[dir="auto"][title]');
        return nameEl ? nameEl.title.trim() : null;
    }

    function getChatAvatarFromItem(chatItem) {
        const img = chatItem.querySelector('img._ao3e');
        return img ? img.src : '';
    }

    function startPaneObserver() {
        if (paneObserver) { paneObserver.disconnect(); paneObserver = null; }

        const pane = document.querySelector('#pane-side');
        if (!pane) return;

        const badgeState = new Map();

        // Inicializar el estado actual de todos los badges SIN disparar nada
        // Esto evita que chats con mensajes viejos no leídos disparen al cargar
        function initBadgeState() {
            const chatItems = pane.querySelectorAll('[role="row"]');
            chatItems.forEach(item => {
                const badge = item.querySelector('[aria-label*="mensaje"], [aria-label*="unread"]');
                if (!badge) return;
                const chatName = getChatNameFromItem(item);
                if (!chatName) return;
                const countEl = badge.querySelector('span[style]');
                const count   = parseInt(countEl?.textContent?.trim() || '0', 10);
                badgeState.set(chatName, count); // guardar estado inicial sin disparar
            });
        }

        initBadgeState();

        // Cooldown propio para el pane observer, independiente del de mensajes
        let lastPaneSoundTime = 0;
        const PANE_COOLDOWN_MS = 2000;

        paneObserver = new MutationObserver(() => {
            if (!isPageFocused) return;

            const activeChatName = getActiveChatName();

            const chatItems = pane.querySelectorAll('[role="row"]');
            chatItems.forEach(item => {
                const badge = item.querySelector('[aria-label*="mensaje"], [aria-label*="unread"]');
                const chatName = getChatNameFromItem(item);
                if (!chatName) return;

                if (!badge) {
                    badgeState.set(chatName, 0);
                    return;
                }

                if (chatName === activeChatName) return;

                const countEl = badge.querySelector('span[style]');
                const count   = parseInt(countEl?.textContent?.trim() || '0', 10);
                const prev    = badgeState.get(chatName) ?? count;

                const alreadyTracked = badgeState.has(chatName);
                badgeState.set(chatName, count);

                if (!alreadyTracked || count <= prev) return;

                // Cooldown
                const now = Date.now();
                if (now - lastPaneSoundTime < PANE_COOLDOWN_MS) return;
                lastPaneSoundTime = now;

                // Obtener texto del último mensaje si está visible
                const msgEl = item.querySelector('span[dir="ltr"], span[dir="auto"]._ao3e');
                const msgText = msgEl ? msgEl.textContent.trim().slice(0, 80) : '💬 Nuevo mensaje';

                playSound();
                showPopup({
                    name:    chatName,
                    message: msgText,
                    avatar:  getChatAvatarFromItem(item),
                });
            });
        });

        paneObserver.observe(pane, {
            childList: true,
            subtree:   true,
        });
    }

    // ── Arranque ──────────────────────────────────────────────────────────────
    function init() {
        const interval = setInterval(() => {
            if (document.querySelector('#app')) {
                clearInterval(interval);
                startObserver();
                watchChatChanges();
                startPaneObserver();
            }
        }, 1000);
    }

    init();

})();