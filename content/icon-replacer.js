// content/icon-replacer.js
// Módulo de reemplazo de iconos y decoración visual WLM

const IconReplacer = (() => {

    // ─── Rutas de assets ────────────────────────────────────────────────────
    const ICONS = {
        msnLogo:              chrome.runtime.getURL('assets/icons/chat/WLM_Title.png'),
        addFriend:            chrome.runtime.getURL('assets/icons/menu/AddFriend.png'),
        showMenu:             chrome.runtime.getURL('assets/icons/menu/ShowMenu.png'),
        archived:             chrome.runtime.getURL('assets/icons/menu/Archived.png'),
        msnLoading:           chrome.runtime.getURL('assets/icons/chat/MSN_Loading.gif'),
        star:                 chrome.runtime.getURL('assets/icons/emoticons/Star.png'),
        clock:                chrome.runtime.getURL('assets/icons/emoticons/Clock.png'),
        typing:               chrome.runtime.getURL('assets/icons/chat/Typing.gif'),
        thumbsUp:             chrome.runtime.getURL('assets/icons/emoticons/ThumbsUp.png'),
        heart:                chrome.runtime.getURL('assets/icons/emoticons/Heart.png'),
        grin:                 chrome.runtime.getURL('assets/icons/emoticons/Grin.png'),
        surprise:             chrome.runtime.getURL('assets/icons/emoticons/Surprise.png'),
        sob:                  chrome.runtime.getURL('assets/icons/emoticons/Sob.png'),
        largeFrameOffline:    chrome.runtime.getURL('assets/icons/frames/LargeFrameOffline.png'),
        largeFrameActive:     chrome.runtime.getURL('assets/icons/frames/LargeFrameActive.png'),
        xlFrameOffline:       chrome.runtime.getURL('assets/icons/frames/XLFrameOffline.png'),
        wlmLogo:              chrome.runtime.getURL('assets/icons/chat/wlm_logo.png'),
        defaultScene:         chrome.runtime.getURL('assets/icons/chat/default-scene.png'),
        placeholderContact:   chrome.runtime.getURL('assets/icons/frames/placeholder-pfp-contact.png'),
        placeholderGroup:     chrome.runtime.getURL('assets/icons/frames/placeholder-pfp-group.jpg'),
        smile:                chrome.runtime.getURL('assets/icons/emoticons/Smile.png'),
        volMuted:             chrome.runtime.getURL('assets/icons/chat/vol_muted.png'),
        chat:                 chrome.runtime.getURL('assets/icons/W7Icons/Chat.png'),
        group:                chrome.runtime.getURL('assets/icons/W7Icons/Group.png'),
        status:               chrome.runtime.getURL('assets/icons/W7Icons/Status.png'),
        channels:             chrome.runtime.getURL('assets/icons/W7Icons/Channels.png'),
        image:                chrome.runtime.getURL('assets/icons/W7Icons/Image.png'),
        minimize:             chrome.runtime.getURL('assets/icons/Titlebar/Minimize.png'),
        maximize:             chrome.runtime.getURL('assets/icons/Titlebar/Maximize.png'),
        close:                chrome.runtime.getURL('assets/icons/Titlebar/Close.png'),

        principalBackground:  chrome.runtime.getURL('background/windows_7_2.jpg'),
    };

    // ─── Utilidad: crear y reemplazar SVG por imagen ─────────────────────────
    function svgToImg(svgElement, src, alt, width = '20px', height = '20px', extra = {}) {
        if (!svgElement || svgElement.parentElement.querySelector(`img[alt="${alt}"]`)) return;
        svgElement.style.display = 'none';
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.width = width;
        img.style.height = height;
        Object.entries(extra).forEach(([k, v]) => img.style[k] = v);
        svgElement.parentElement.appendChild(img);
    }

    // ─── Utilidad: inyectar CSS dinámico ─────────────────────────────────────
    const _injectedStyles = new Set();
    function injectCSS(id, css) {
        if (_injectedStyles.has(id)) return;
        const style = document.createElement('style');
        style.id = id;
        style.textContent = css;
        document.head.appendChild(style);
        _injectedStyles.add(id);
    }

    // ─── Reemplazos de iconos ────────────────────────────────────────────────

    function replaceProfileLogo() {
        // Ocultar el SVG animado de WhatsApp
        const svgContainer = document.querySelector(
            '.x1rjt51p.x16w0wmm.x1g83kfv.x3qq2k7.x2x8art.x1qor8vf.xl7twdi.xyo0t3i.xvg22vi.xb0esv5.x98l61r.xviac27.x1ua1l7f.xlese2p.x1j3ira4.xrdqr27.x9f619.xg7h5cd.x78zum5.xdt5ytf.x6s0dn4'
        );

        if (svgContainer && !svgContainer.classList.contains('wlm-replaced')) {
            svgContainer.style.display = 'none';

            const img = document.createElement('img');
            img.src = ICONS.msnLogo;
            img.alt = 'MSN Logo';
            img.style.display = 'block';
            img.style.margin = '0 auto';

            svgContainer.parentElement.insertBefore(img, svgContainer);
            svgContainer.classList.add('wlm-replaced');
        }
    }

    function replaceNewChatIcon() {
        const svg = document.querySelector('span[data-icon="new-chat-outline"] svg');
        svgToImg(svg, ICONS.addFriend, 'Nuevo chat');
    }

    function replaceMenuIcon() {
        document.querySelectorAll('span[data-icon="more-refreshed"] svg').forEach(svg => {
            svgToImg(svg, ICONS.showMenu, 'Menú');
        });
    }

    function replaceArchivedIcon() {
        const svg = document.querySelector('span[data-icon="archive-refreshed"] svg');
        svgToImg(svg, ICONS.archived, 'Archived', '38px', '38px', {
            display: 'block',
            margin: '0 auto'
        });
    }

    function replaceLoadingIcon() {
        const svg = document.querySelector('div._aqdy._alyr span svg');
        svgToImg(svg, ICONS.msnLoading, 'Loading', 'auto', 'auto', {
            display: 'block',
            margin: '0 auto'
        });
    }

    function replaceLoadingMessagesIcon() {
        const svg = document.querySelector('div[title="cargando mensajes…"] span svg');
        svgToImg(svg, ICONS.msnLoading, 'Cargando mensajes', 'auto', 'auto');
    }

    function replaceLoginLoadingIcon() {
        document.querySelectorAll('svg[viewBox="0 0 250 52"]').forEach(svg => {
            svgToImg(svg, ICONS.msnLoading, 'MSN Loading', '48px', '36px', {
                display: 'block',
                margin: '0 auto'
            });
        });
    }

    function replaceFavoritesIcon() {
        const svg = document.querySelector('div[title="Favoritos"] span[data-icon="panel-starred"] svg');
        svgToImg(svg, ICONS.star, 'Favoritos', '24px', '24px');
    }

    function replaceRecentIcon() {
        const svg = document.querySelector('div[title="Recientes"] span[data-icon="panel-recent"] svg');
        svgToImg(svg, ICONS.clock, 'Recientes', '24px', '24px');
    }

    function insertTypingIcon() {
        const typingText = document.querySelector('.x1iyjqo2.x1n2onr6.x1lliihq.x6ikm8r.x10wlt62.xk50ysn.x1v5yvga.xlyipyv.xuxw1ft._ao3e');
        const existingIcon = document.querySelector('img[alt="Typing"]');
        if (typingText && !existingIcon) {
            const img = document.createElement('img');
            img.src = ICONS.typing;
            img.alt = 'Typing';
            img.style.width = '20px';
            img.style.height = '20px';
            img.style.marginRight = '5px';
            typingText.parentElement.insertBefore(img, typingText);
        } else if (!typingText && existingIcon) {
            existingIcon.remove();
        }
    }

    function replaceSmileyIcon() {
        document.querySelectorAll('svg title').forEach(title => {
            if (title.textContent === 'wds-ic-sticker-smiley') {
                const svg = title.closest('svg');

                svgToImg(svg, ICONS.smile, 'Smiley', '24px', '24px');
            }
        });
    }

    function replaceMutedIcon() {
        document.querySelectorAll('svg title').forEach(title => {
            if (title.textContent === 'ic-notifications-off') {
                const svg = title.closest('svg');

                svgToImg(svg, ICONS.volMuted, 'Muted', '24px', '24px');
            }
        });
    }

    function replaceChatFilledIcon() {
        document.querySelectorAll(`
            span[data-icon="chat-filled-refreshed"] svg,
            span[data-icon="chat-refreshed"] svg
        `).forEach(svg => {
            svgToImg(svg, ICONS.chat, 'Chat', '24px', '24px');
        });
    }

    function replaceCommunityIcon() {
        document.querySelectorAll(`
            span[data-icon="community-refreshed-32"] svg,
            span[data-icon="community-refreshed-filled-32"] svg
        `).forEach(svg => {
            svgToImg(svg, ICONS.group, 'Community', '24px', '24px', {
                paddingLeft: '5px'
            });
        });
    }

    function replaceStatusIcon() {
        document.querySelectorAll(`
            span[data-icon="status-refreshed"] svg,
            span[data-icon="status-filled-refreshed"] svg
        `).forEach(svg => {
            svgToImg(svg, ICONS.status, 'Status', '24px', '24px');
        });
    }

    function replaceNewsletterIcon() {

        // ✔ caso 1: con data-icon
        document.querySelectorAll('span[data-icon="newsletter-tab"] svg')
        .forEach(svg => {
            svgToImg(svg, ICONS.channels, 'Newsletter', '24px', '24px');
        });

        // ✔ caso 2: sin data-icon → detectar por <title>
        document.querySelectorAll('svg').forEach(svg => {
            const title = svg.querySelector('title');

            if (title && title.textContent === 'wds-ic-channels') {
                svgToImg(svg, ICONS.channels, 'Newsletter', '24px', '24px');
            }
        });
    }

    function replaceAlbumIcon() {
        document.querySelectorAll('svg').forEach(svg => {
            const title = svg.querySelector('title');

            if (title && title.textContent === 'ic-filter') {
                svgToImg(svg, ICONS.image, 'Filter', '24px', '24px');
            }
        });
    }

    // ─── Emoticones ──────────────────────────────────────────────────────────

    const EMOTICON_MAP = [
        { alt: '👍', src: ICONS.thumbsUp,  label: 'ThumbsUp' },
        { alt: '❤️', src: ICONS.heart,     label: 'Heart'    },
        { alt: '😂', src: ICONS.grin,      label: 'Grin'     },
        { alt: '😮', src: ICONS.surprise,  label: 'Surprise' },
        { alt: '😢', src: ICONS.sob,       label: 'Sob'      },
    ];

    function replaceEmoticons() {
        EMOTICON_MAP.forEach(({ alt, src, label }) => {
            document.querySelectorAll(`div img[alt="${alt}"]`).forEach(img => {
                img.src = src;
                img.alt = label;
                img.style.width = '20px';
                img.style.height = '20px';
                img.style.display = 'inline';
            });
        });
    }

    // ─── Marcos y fondos ─────────────────────────────────────────────────────

    function replaceLargeFrameLeft() {
        document.querySelectorAll('._ak9p .x1y332i5.x1n2onr6.x6ikm8r.x10wlt62 ._ak8h').forEach(el => {
            el.style.backgroundImage = `url(${ICONS.largeFrameOffline})`;
            el.style.backgroundSize = '81.5px 81.5px';
            el.style.backgroundPosition = '-6px -1.6px';
        });
    }

    function replaceLargeFrameRight() {
        document.querySelectorAll('#pane-side.x1n2onr6.xyw6214.x78zum5.xdt5ytf.x1iyjqo2.x1odjw0f.x150wa6m ._ak8h').forEach(el => {
            el.style.backgroundImage = `url(${ICONS.largeFrameOffline})`;
            el.style.backgroundSize = '68.5px 68.5px';
            el.style.backgroundPosition = '-3.8px 2.4px';
        });
    }

    function moveProfileButtonToHeader() {
        const logo = document.querySelector('span[data-icon="wa-wordmark-refreshed"]');

        const container = document.querySelector('button[aria-label="Tú"]')?.closest('div.x1c4vz4f');

        if (!logo || !container) return;
        if (container.dataset.moved) return;

        const placeholder = document.createElement('div');
        placeholder.style.width = '28px';
        placeholder.style.height = '28px';

        container.parentElement.replaceChild(placeholder, container);

        container.style.transform = 'scale(1.7)';
        container.style.transformOrigin = 'left center';
        container.style.top = '7px';
        container.style.left = '-7px';

        // 🔥 mover el nodo REAL
        logo.replaceWith(container);

        // 👇 TEXTO AL LADO DEL AVATAR
        if (!container.querySelector('.wlm-userinfo')) {
            const userInfo = document.createElement('div');
            userInfo.className = 'wlm-userinfo';

            const name = document.createElement('div');
            name.className = 'wlm-username';
            name.textContent = 'RocKo24';

            const status = document.createElement('div');
            status.className = 'wlm-status';
            status.textContent = 'Disponible';

            userInfo.appendChild(name);
            userInfo.appendChild(status);

            container.appendChild(userInfo);
        }

        // ✅ 👇 AGREGA ESTA LÍNEA
        container.classList.add('wlm-avatar-frame');
        container.style.overflow = 'visible';

        container.dataset.moved = "true";
    }

    function keepAvatarFrame() {
        const observer = new MutationObserver(() => {
            const container = document.querySelector('button[aria-label="Tú"]')?.closest('div.x1c4vz4f');

            if (container && !container.classList.contains('wlm-avatar-frame')) {
                container.classList.add('wlm-avatar-frame');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function injectWLMTitleBar() {  // background: linear-gradient(to right, #ffffff66, #0000001a, #ffffff33), #4580c4; box-shadow: inset 0 0 0 1px #fff9; border: 1px solid #000000b3;
        injectCSS('wlm-titlebar', `
            .x9f619.x1n2onr6.xupqr0c.x5yr21d.x6ikm8r.x10wlt62.x17dzmu4.x1i1dayz.x2ipvbc.xjdofhw.xyyilfv.x1iyjqo2::before {
                content: 'Windows Live Messenger (Chat)';
                align-items: center;
                
                background-image: url('${ICONS.wlmLogo}'), linear-gradient(135deg,#fff5 70px,transparent 100px),
                                linear-gradient(225deg,#fff5 70px,transparent 100px),
                                linear-gradient(54deg,#0002 0 4%,#6661 6% 6%,#0002 8% 10%,#0002 15% 16%,#aaa1 17% 18%,#0002 23% 24%,#bbb2 25% 26%,#0002 31% 33%,#0002 34% 34.5%,#bbb2 36% 40%,#0002 41% 41.5%,#bbb2 44% 45%,#bbb2 46% 47%,#0002 48% 49%,#0002 50% 50.5%,#0002 56% 56.5%,#bbb2 57% 63%,#0002 67% 69%,#bbb2 69.5% 70%,#0002 73.5% 74%,#bbb2 74.5% 79%,#0002 80% 84%,#aaa2 85% 86%,#0002 87%,#bbb1 90%);
                background-repeat:
                    no-repeat,
                    no-repeat,
                    no-repeat,
                    no-repeat;

                background-position:
                    5px center,
                    0 0,
                    0 0,
                    left center;

                background-size:
                    16px 16px,
                    auto,
                    auto,
                    100vw 100vh;

                background-attachment:
                    scroll,
                    scroll,
                    scroll,
                    fixed;
                
                border-radius: 6px 6px 0 0;
                
                display: flex;
                font: 9pt "Segoe UI", "SegoeUI", "Noto Sans", sans-serif;
                justify-content: space-between;
                padding: 6px 6px 6px 28px;
                color: #000;
                line-height: 15px;
                text-shadow: 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff,
                             0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff;
                border-bottom: 0;
            }
        `);
    }

function injectWLMTitleBar2() {
    injectCSS('wlm-main-titlebar', `
        ._aigw._as6h.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.xjdofhw.x78zum5.xdt5ytf.x12xzxwr.x1plvlek.xryxfnj.x570efc.x18dvir5.xxljpkc.xwfak60.x18pi947::before {
            content: 'Windows Live Messenger';
            align-items: center;

            background-image: url('${ICONS.wlmLogo}'), linear-gradient(135deg,#fff5 70px,transparent 100px),
                                linear-gradient(225deg,#fff5 70px,transparent 100px),
                                linear-gradient(54deg,#0002 0 4%,#6661 6% 6%,#0002 8% 10%,#0002 15% 16%,#aaa1 17% 18%,#0002 23% 24%,#bbb2 25% 26%,#0002 31% 33%,#0002 34% 34.5%,#bbb2 36% 40%,#0002 41% 41.5%,#bbb2 44% 45%,#bbb2 46% 47%,#0002 48% 49%,#0002 50% 50.5%,#0002 56% 56.5%,#bbb2 57% 63%,#0002 67% 69%,#bbb2 69.5% 70%,#0002 73.5% 74%,#bbb2 74.5% 79%,#0002 80% 84%,#aaa2 85% 86%,#0002 87%,#bbb1 90%);
            background-repeat:
                no-repeat,
                no-repeat,
                no-repeat,
                no-repeat;

            background-position:
                5px center,
                0 0,
                0 0,
                left center;

            background-size:
                16px 16px,
                auto,
                auto,
                100vw 100vh;

            background-attachment:
                scroll,
                scroll,
                scroll,
                fixed;

            border-radius: 6px 6px 0 0;

            display: flex;
            font: 9pt "Segoe UI","SegoeUI","Noto Sans",sans-serif;
            justify-content: space-between;
            padding: 6px 6px 6px 28px;
            color: #000;
            letter-spacing: 0;
            line-height: 15px;
            text-shadow: 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff, 0 0 10px #fff;
            border-bottom: 0;
        }
    `);
}

    function injectFrutigerBackground() {
        injectCSS('wlm-frutiger-bg', `
            .x1h3rtpe::before {
                content: "";
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: url('${ICONS.principalBackground}') no-repeat;
                background-size: cover;
                z-index: -1;
            }
        `);
    }

    function injectGradientSceneBackground() {
        injectCSS('wlm-gradient-scene', `
            .x570efc.x9f619.x78zum5.x1okw0bk.x6s0dn4.x1peatla.x14ug900.x1280gxy.x889kno.x1a8lsjc.x106a9eq.x1xnnf8n {
                background:
                    url('${ICONS.defaultScene}') no-repeat center / cover,
                    var(--wlm-1);
            }
        `);
    }

    function injectDefaultProfilePictures() {
        injectCSS('wlm-placeholder-pfp', `
            .x10l6tqk.x13vifvy.x1o0tod.x78zum5.x6s0dn4.xl56j7k.xh8yej3.x5yr21d span[data-icon="default-contact-refreshed"] {
                background-image: url('${ICONS.placeholderContact}');
                background-size: cover;
            }
            .x10l6tqk.x13vifvy.x1o0tod.x78zum5.x6s0dn4.xl56j7k.xh8yej3.x5yr21d span[data-icon="default-contact-refreshed"] svg {
                visibility: hidden;
            }
            .x10l6tqk.x13vifvy.x1o0tod.x78zum5.x6s0dn4.xl56j7k.xh8yej3.x5yr21d span[data-icon="default-group-refreshed"], .x78zum5.x6s0dn4.xl56j7k.x1q0g3np.xh8yej3.x5yr21d.x6ikm8r.x10wlt62.xvs2etk.xg3wpu6.x1jwbhkm.xgg4q86.x1od0jb8 span[data-icon="default-group-refreshed"]{
                background-image: url('${ICONS.placeholderGroup}');
                background-size: cover;
            }
            .x10l6tqk.x13vifvy.x1o0tod.x78zum5.x6s0dn4.xl56j7k.xh8yej3.x5yr21d span[data-icon="default-group-refreshed"] svg, .x78zum5.x6s0dn4.xl56j7k.x1q0g3np.xh8yej3.x5yr21d.x6ikm8r.x10wlt62.xvs2etk.xg3wpu6.x1jwbhkm.xgg4q86.x1od0jb8 span[data-icon="default-group-refreshed"] svg {
                visibility: hidden;
            }
        `);
    }

    function injectAvatarFrame() {
        injectCSS('wlm-avatar-frame', `
            .wlm-avatar-frame {
                position: relative !important;
                display: inline-flex !important;
            }

            .wlm-avatar-frame::after {
                content: '';
                position: absolute;
                top: -2px;
                left: -3px;
                width: 45px;
                height: 46px;
                background: url('${ICONS.largeFrameActive}') no-repeat center;
                background-size: contain;
                pointer-events: none;
                z-index: 10;
            }
        `);
    }

    function injectAvatarNickname() {

        injectCSS('wlm-username-style', `
            .wlm-avatar-frame {
                display: flex !important;
                align-items: center !important;
                gap: 12px;
            }

            /* contenedor vertical */
            .wlm-userinfo {
                display: flex;
                flex-direction: column;
                justify-content: center;
                margin-left: 32px;
            }

            /* nombre */
            .wlm-username {
                font: 9pt "Segoe UI", sans-serif;
                color: black;
                text-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 1px #fff, 0 0 2px #fff, 0 0 1px #fff, 0 0 1px #fff, 0 0 5px #fff, 0 0 1px #fff;
            }

            /* estado */
            .wlm-status {
                font: 6pt "Segoe UI", sans-serif;
                color: black;
                text-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 1px #fff, 0 0 2px #fff, 0 0 1px #fff, 0 0 1px #fff, 0 0 5px #fff, 0 0 1px #fff;

            }
            `);
    }

    function injectWindowControlsStyles() {
    injectCSS('wlm-window-controls', `
        .title-bar-controls {
            position: absolute;
            right: 6px;
            background: #fff3;
            border: 1px solid #0000004d;
            border-radius: 0 0 5px 5px;
            border-top: 0;
            box-shadow: 0 1px 0 #fffa, 1px 0 0 #fffa, -1px 0 0 #fffa;
            display: flex;
            z-index: 20;
            border-color: #000000b3;
        }

        .title-bar-controls button {
            border: 0;
            border-radius: 0;
            border-right: 1px solid #0000004d;
            cursor: pointer;
            box-sizing: border-box;
            min-height: 19px;
            min-width: 29px;
            border-color: #000000b3;
            box-shadow: inset 0 0 0 1px #fffa;
        }

        .title-bar-controls button:first-child {
            border-bottom-left-radius: 5px;
        }

        .title-bar-controls button:last-child {
            border: 0;
            border-bottom-right-radius: 5px;
        }

        button[aria-label="Minimize"] {
            background:
                url('${ICONS.minimize}') no-repeat center 10px,
                linear-gradient(#ffffff80,#ffffff4d 45%,#0000001a 50%,#0000001a 75%,#ffffff80);
        }

        button[aria-label="Maximize"] {
            background:
                url('${ICONS.maximize}') no-repeat center,
                linear-gradient(#ffffff80,#ffffff4d 45%,#0000001a 50%,#0000001a 75%,#ffffff80);
        }

        button[aria-label="Close"] {
            background:
                url('${ICONS.close}') no-repeat center,
                linear-gradient(#ffffff80,#ffffff4d 45%,#0000001a 50%,#0000001a 75%,#ffffff80),
                radial-gradient(circle at -60% 50%,#0007 5% 10%,#0000 50%),
                radial-gradient(circle at 160% 50%,#0007 5% 10%,#0000 50%),
                linear-gradient(#e0a197e5,#cf796a 25% 50%,#d54f36 50%);
            box-shadow: inset 0 0 0 1px #fffa;
            min-width: 48px;
        }
    `);
}

    // ─── Inicialización única de estilos CSS ─────────────────────────────────
    // (se llaman una sola vez, no en cada mutación)
    function initStyles() {
        injectWLMTitleBar();
        injectWLMTitleBar2();
        injectFrutigerBackground();
        injectGradientSceneBackground();
        injectDefaultProfilePictures();
        injectAvatarFrame();
        keepAvatarFrame();
        injectAvatarNickname();
        injectWindowControlsStyles();
    }

    // ─── Función pública: ejecutar en cada mutación del DOM ──────────────────
    function run() {
        replaceProfileLogo();
        replaceNewChatIcon();
        replaceMenuIcon();
        replaceArchivedIcon();
        replaceLoadingIcon();
        replaceLoadingMessagesIcon();
        replaceLoginLoadingIcon();
        replaceFavoritesIcon();
        replaceRecentIcon();
        insertTypingIcon();
        replaceSmileyIcon();
        replaceMutedIcon();

        replaceChatFilledIcon();
        replaceCommunityIcon();
        replaceStatusIcon();
        replaceNewsletterIcon();
        replaceAlbumIcon()
        //replaceEmoticons();
        replaceLargeFrameLeft();
        replaceLargeFrameRight();
        moveProfileButtonToHeader();
    }

    return { run, initStyles };

})();