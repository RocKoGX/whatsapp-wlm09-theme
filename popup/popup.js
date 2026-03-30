// popup/popup.js — WhatsApp WLM

// ─── Claves de storage ────────────────────────────────────────
const KEY_THEME        = 'wlm_color_theme';
const KEY_THEME_CSS    = 'wlm_theme_css';
const KEY_ADS          = 'wlm_ads_images';
const KEY_SCENES       = 'wlm_scene_images';
const KEY_SCENE_SEL    = 'wlm_scene_selected';
const KEY_TEXT_INVERTED= 'wlm_text_inverted'; // true = blanco sobre oscuro

// ─── CSS de texto del avatar ──────────────────────────────────
const TEXT_NORMAL = `
    .wlm-username {
        color: black;
        text-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 1px #fff,
                     0 0 2px #fff, 0 0 1px #fff, 0 0 1px #fff,
                     0 0 5px #fff, 0 0 1px #fff;
    }
    .wlm-status {
        color: #000000;
    }
`;

const TEXT_INVERTED = `
    .wlm-username {
        color: white;
        text-shadow: 0 0 2px #000, 0 0 10px #000, 0 0 1px #000,
                     0 0 2px #000, 0 0 1px #000, 0 0 1px #000,
                     0 0 5px #000, 0 0 1px #000;
    }
    .wlm-status {
        color: #ffffff;
        text-shadow: 0 0 2px #000, 0 0 10px #000, 0 0 1px #000,
            0 0 2px #000, 0 0 1px #000, 0 0 1px #000,
            0 0 5px #000, 0 0 1px #000;
    }
`;

// ─── Paleta de temas ──────────────────────────────────────────
function mkTheme({ id, name, label, swatch, c1, c2, c3, c4, pale, bg, body, b2, b3, b4, aero, aero2, check, link, shadow, ibg, ibr, sbg, sbr }) {
    return { id, name, label: label || name, swatch, vars: {
        '--wlm-1': c1, '--wlm-2': c2, '--wlm-3': c3, '--wlm-4': c4,
        '--wlm-pale': pale, '--wlm-bg': bg,
        '--wlm-body': body, '--wlm-body-2': b2, '--wlm-body-3': b3, '--wlm-body-4': b4,
        '--wlm-aero': aero, '--wlm-aero-2': aero2,
        '--wlm-check': check, '--wlm-link': link, '--wlm-shadow': shadow,
        '--wlm-input-bg': ibg, '--wlm-input-br': ibr,
        '--wlm-search-bg': sbg, '--wlm-search-br': sbr,
    }};
}

const WLM_THEMES = [
    mkTheme({ id:'blue', name:'Azul', label:'Azul (predeterminado)', swatch:'linear-gradient(135deg,#78cff8,#2989d8)', c1:'#78cff8', c2:'#46b6ea', c3:'#37a7dc', c4:'#45addb', pale:'#52c4f0', bg:'#d5f0fb', body:'#e0eaf4', b2:'#c9e2ec', b3:'#c3d9ef', b4:'#e1eaf6', aero:'#4580c4', aero2:'#6c9dd5', check:'#54daff', link:'#14b9ce', shadow:'#015c5f', ibg:'#e2eff4', ibr:'#bed6e0', sbg:'#edf3f6', sbr:'#ced9e5' }),
    mkTheme({ id:'blue-light', name:'Azul claro', swatch:'linear-gradient(135deg,#b0e8ff,#5bbde8)', c1:'#b0e8ff', c2:'#7ad0f5', c3:'#60c0ec', c4:'#72caf0', pale:'#85d8f8', bg:'#e5f8ff', body:'#eef7fc', b2:'#d4eef8', b3:'#c8e8f5', b4:'#e8f4fb', aero:'#3a90cc', aero2:'#60aade', check:'#80e8ff', link:'#20aae0', shadow:'#005878', ibg:'#e8f4fb', ibr:'#a8d8ee', sbg:'#f0f8fd', sbr:'#b8ddf0' }),
    mkTheme({ id:'blue-dark', name:'Azul oscuro', swatch:'linear-gradient(135deg,#4878c0,#1a3880)', c1:'#5888d0', c2:'#3060a8', c3:'#204e94', c4:'#2e5ea0', pale:'#3870b8', bg:'#b0c8ee', body:'#c8d8f0', b2:'#a8bce0', b3:'#98aedc', b4:'#bccce8', aero:'#1a3880', aero2:'#2a5098', check:'#60aaff', link:'#3080d8', shadow:'#08204a', ibg:'#c8d8f0', ibr:'#88a8d4', sbg:'#d4e0f4', sbr:'#90aed8' }),
    mkTheme({ id:'purple', name:'Morado', swatch:'linear-gradient(135deg,#c49af8,#6b3fa0)', c1:'#c49af8', c2:'#9b6de0', c3:'#8255cc', c4:'#9060d0', pale:'#a870e8', bg:'#ead5fb', body:'#ecdff4', b2:'#d8c2ec', b3:'#cdb3e3', b4:'#e8d8f4', aero:'#6b3fa0', aero2:'#8c62b8', check:'#c87aff', link:'#9040cc', shadow:'#3d1060', ibg:'#ede0f6', ibr:'#c8a8e0', sbg:'#f0e8f8', sbr:'#cdb4e4' }),
    mkTheme({ id:'purple-light', name:'Morado claro', swatch:'linear-gradient(135deg,#e0b8ff,#a870d8)', c1:'#e0b8ff', c2:'#c090f0', c3:'#ae78e4', c4:'#b880ec', pale:'#cc98f8', bg:'#f2e4ff', body:'#f5edfb', b2:'#e8d4f8', b3:'#e0c8f4', b4:'#f0e4fa', aero:'#9050c0', aero2:'#b070d8', check:'#e090ff', link:'#a860d8', shadow:'#5a2880', ibg:'#f0e8fa', ibr:'#d4b8f0', sbg:'#f6f0fc', sbr:'#dcc0f4' }),
    mkTheme({ id:'green', name:'Verde', swatch:'linear-gradient(135deg,#80d89a,#2a7a4e)', c1:'#80d89a', c2:'#4aba6e', c3:'#3aaa5e', c4:'#48b46a', pale:'#55c878', bg:'#d5fbe0', body:'#dff0e4', b2:'#c2e8cc', b3:'#b8dfc3', b4:'#daeee0', aero:'#2a7a4e', aero2:'#4a9a6a', check:'#54ffaa', link:'#1a9960', shadow:'#0a4020', ibg:'#e2f0e6', ibr:'#b4d8be', sbg:'#ecf6ee', sbr:'#bcd9c4' }),
    mkTheme({ id:'green-light', name:'Verde claro', swatch:'linear-gradient(135deg,#b0f0c0,#60c880)', c1:'#b0f0c0', c2:'#7ad898', c3:'#62cc84', c4:'#72d490', pale:'#88e4a0', bg:'#e4fcea', body:'#eefaee', b2:'#d4f2da', b3:'#c8eece', b4:'#e4f8e8', aero:'#3aaa60', aero2:'#58c478', check:'#80ffb8', link:'#28cc78', shadow:'#106030', ibg:'#e8f8ec', ibr:'#aadcb8', sbg:'#f0faf2', sbr:'#b8e0c4' }),
    mkTheme({ id:'yellow', name:'Amarillo', swatch:'linear-gradient(135deg,#ffe066,#c8960a)', c1:'#ffe580', c2:'#f5c832', c3:'#e0b020', c4:'#f0be28', pale:'#ffd040', bg:'#fff5c0', body:'#f8f0d0', b2:'#eeded8', b3:'#e8d8b0', b4:'#f4eccc', aero:'#b8880a', aero2:'#d4a030', check:'#ffe020', link:'#b87800', shadow:'#604000', ibg:'#f8f0d4', ibr:'#e0cc88', sbg:'#faf4e0', sbr:'#e4d090' }),
    mkTheme({ id:'orange', name:'Naranja', swatch:'linear-gradient(135deg,#ffb060,#d4600a)', c1:'#ffb878', c2:'#f08040', c3:'#e07030', c4:'#ee7e38', pale:'#ff9040', bg:'#ffe5d0', body:'#f4e0d4', b2:'#e8ccbc', b3:'#e0c0ac', b4:'#f0d8c8', aero:'#c04800', aero2:'#d86828', check:'#ffaa40', link:'#c85000', shadow:'#602000', ibg:'#f4e4d8', ibr:'#ddbba0', sbg:'#f8ece4', sbr:'#e0c0a8' }),
    mkTheme({ id:'red', name:'Rojo', swatch:'linear-gradient(135deg,#f08080,#c02a2a)', c1:'#f09090', c2:'#e05050', c3:'#cc3838', c4:'#de4848', pale:'#e84040', bg:'#ffd5d5', body:'#f4dada', b2:'#e8c0c0', b3:'#e0b0b0', b4:'#f0d0d0', aero:'#a01818', aero2:'#be3838', check:'#ff6060', link:'#cc2020', shadow:'#600000', ibg:'#f4e0e0', ibr:'#d8b0b0', sbg:'#f8e8e8', sbr:'#dbb8b8' }),
    mkTheme({ id:'pink', name:'Rosado', swatch:'linear-gradient(135deg,#f8a0c0,#c0407a)', c1:'#f8b0cc', c2:'#e878a8', c3:'#d86898', c4:'#e070a2', pale:'#f080b8', bg:'#ffd5ea', body:'#f4dae8', b2:'#e8c0d8', b3:'#e0b0cc', b4:'#f0d0e0', aero:'#a0286a', aero2:'#c04888', check:'#ff80c0', link:'#c03080', shadow:'#600030', ibg:'#f4e0ec', ibr:'#d8b0cc', sbg:'#f8e8f0', sbr:'#dbb8cc' }),
    mkTheme({ id:'teal', name:'Turquesa', swatch:'linear-gradient(135deg,#70e0d8,#0a8888)', c1:'#70e0d8', c2:'#30c0b8', c3:'#20aaaa', c4:'#28b8b0', pale:'#40d0c8', bg:'#c8f8f4', body:'#d8f4f0', b2:'#b8e8e4', b3:'#a8e0dc', b4:'#ccf0ec', aero:'#0a7878', aero2:'#289898', check:'#50ffe8', link:'#10a8a0', shadow:'#004040', ibg:'#d8f0ec', ibr:'#88d0c8', sbg:'#e4f8f5', sbr:'#98d8d0' }),
    mkTheme({ id:'gray', name:'Gris', swatch:'linear-gradient(135deg,#aabbc8,#5a6a7a)', c1:'#b0c0cc', c2:'#889aaa', c3:'#788898', c4:'#8898a8', pale:'#90a8bc', bg:'#dde4ea', body:'#e4e8ec', b2:'#ccd4da', b3:'#c4ccd2', b4:'#dce0e4', aero:'#4a5a6a', aero2:'#6a7a8a', check:'#88ccee', link:'#507090', shadow:'#203040', ibg:'#e2e8ec', ibr:'#b8c4cc', sbg:'#e8ecf0', sbr:'#bcc4ca' }),
    mkTheme({ id:'brown', name:'Café', swatch:'linear-gradient(135deg,#c8a070,#7a4820)', c1:'#c8a070', c2:'#a07840', c3:'#8c6430', c4:'#a87838', pale:'#b88848', bg:'#f0dcc0', body:'#ede0cc', b2:'#ddc8a8', b3:'#d4bc98', b4:'#e8d8bc', aero:'#7a4820', aero2:'#9a6038', check:'#e0c070', link:'#8a5020', shadow:'#402000', ibg:'#ece0cc', ibr:'#ccaa80', sbg:'#f2e8d8', sbr:'#d4b488' }),
    mkTheme({ id:'black', name:'Negro', swatch:'linear-gradient(135deg,#707070,#202020)', c1:'#686868', c2:'#484848', c3:'#383838', c4:'#484848', pale:'#505050', bg:'#c0c0c0', body:'#d0d0d0', b2:'#b8b8b8', b3:'#b0b0b0', b4:'#c8c8c8', aero:'#282828', aero2:'#404040', check:'#a0a0a0', link:'#808080', shadow:'#080808', ibg:'#d0d0d0', ibr:'#989898', sbg:'#d8d8d8', sbr:'#a0a0a0' }),
];

// ─── Referencias DOM ──────────────────────────────────────────
const themeGrid         = document.getElementById('themeGrid');
const themeActiveLabel  = document.getElementById('themeActiveLabel');
const textColorToggle   = document.getElementById('textColorToggle');
const textColorDesc     = document.getElementById('textColorDesc');

const scenePreviewImg   = document.getElementById('scenePreviewImg');
const scenePlaceholder  = document.getElementById('scenePlaceholder');
const sceneBadge        = document.getElementById('sceneBadge');
const sceneList         = document.getElementById('sceneList');
const sceneInput        = document.getElementById('sceneInput');
const sceneDeleteToggle = document.getElementById('sceneDeleteToggle');
const sceneConfirmDel   = document.getElementById('sceneConfirmDelete');

const imageInput        = document.getElementById('imageInput');
const imageList         = document.getElementById('imageList');
const deleteToggle      = document.getElementById('deleteToggle');
const confirmDelete     = document.getElementById('confirmDelete');
const bannerPreviewImg  = document.getElementById('bannerPreviewImg');
const bannerPlaceholder = document.getElementById('bannerPlaceholder');

let isDeletingScenes = false;
let isDeletingBanner = false;

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    buildThemeGrid();
    loadSavedTheme();
    loadTextColorToggle();
    loadScenes();
    loadImages();
});

// ══════════════════════════════════════════════════════════════
//   SELECTOR DE TEMAS
// ══════════════════════════════════════════════════════════════

function buildThemeGrid() {
    WLM_THEMES.forEach(theme => {
        const swatch = document.createElement('div');
        swatch.classList.add('theme-swatch');
        swatch.dataset.id = theme.id;
        swatch.title = theme.label;

        const circle = document.createElement('div');
        circle.classList.add('theme-swatch__circle');
        circle.style.background = theme.swatch;

        const name = document.createElement('span');
        name.classList.add('theme-swatch__name');
        name.textContent = theme.name;

        swatch.appendChild(circle);
        swatch.appendChild(name);
        swatch.addEventListener('click', () => selectTheme(theme.id));
        themeGrid.appendChild(swatch);
    });
}

function selectTheme(themeId) {
    const theme = WLM_THEMES.find(t => t.id === themeId);
    if (!theme) return;

    document.querySelectorAll('.theme-swatch').forEach(s =>
        s.classList.toggle('active', s.dataset.id === themeId)
    );
    themeActiveLabel.textContent = theme.label;

    const cssVars = Object.entries(theme.vars).map(([k, v]) => `${k}:${v};`).join(' ');
    const css = `:root { ${cssVars} }`;
    chrome.storage.local.set({ [KEY_THEME]: themeId, [KEY_THEME_CSS]: css });
    applyToTab(injectThemeVars, [css]);
}

function loadSavedTheme() {
    chrome.storage.local.get(KEY_THEME, result => {
        const themeId = result[KEY_THEME] || 'blue';
        const theme = WLM_THEMES.find(t => t.id === themeId) || WLM_THEMES[0];
        document.querySelectorAll('.theme-swatch').forEach(s =>
            s.classList.toggle('active', s.dataset.id === themeId)
        );
        themeActiveLabel.textContent = theme.label;
    });
}

// ══════════════════════════════════════════════════════════════
//   TOGGLE: COLOR DE TEXTO DEL AVATAR
// ══════════════════════════════════════════════════════════════

function loadTextColorToggle() {
    chrome.storage.local.get(KEY_TEXT_INVERTED, result => {
        const isInverted = result[KEY_TEXT_INVERTED] || false;
        setTextColorUI(isInverted);
    });
}

function setTextColorUI(isInverted) {
    if (isInverted) {
        textColorToggle.classList.add('on');
        textColorDesc.textContent = 'Blanco sobre oscuro';
    } else {
        textColorToggle.classList.remove('on');
        textColorDesc.textContent = 'Negro sobre claro';
    }
}

textColorToggle.addEventListener('click', () => {
    const isCurrentlyOn = textColorToggle.classList.contains('on');
    const newState = !isCurrentlyOn;

    setTextColorUI(newState);
    chrome.storage.local.set({ [KEY_TEXT_INVERTED]: newState });

    // Aplicar en la pestaña activa
    const css = newState ? TEXT_INVERTED : TEXT_NORMAL;
    applyToTab(injectAvatarTextColor, [css]);
});

// ══════════════════════════════════════════════════════════════
//   ESCENA DE FONDO
// ══════════════════════════════════════════════════════════════

function loadScenes() {
    chrome.storage.local.get([KEY_SCENES, KEY_SCENE_SEL], result => {
        const scenes   = result[KEY_SCENES]   || [];
        const selected = result[KEY_SCENE_SEL] || null;
        sceneList.innerHTML = '';
        scenes.forEach(url => addSceneToGrid(url, selected));
        updateScenePreview(selected);
    });
}

function addSceneToGrid(url, selectedUrl) {
    const item = document.createElement('div');
    item.classList.add('image-item');
    item.dataset.url = url;
    if (url === selectedUrl) item.classList.add('scene-active');

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Escena';
    item.appendChild(img);

    item.addEventListener('click', () => {
        if (isDeletingScenes) {
            item.classList.toggle('selected');
            toggleSceneConfirm();
        } else {
            selectScene(url);
        }
    });

    sceneList.appendChild(item);
}

function selectScene(url) {
    document.querySelectorAll('#sceneList .image-item').forEach(el =>
        el.classList.toggle('scene-active', el.dataset.url === url)
    );
    chrome.storage.local.set({ [KEY_SCENE_SEL]: url });
    updateScenePreview(url);
    applyToTab(injectSceneBackground, [url]);
}

function updateScenePreview(url) {
    if (!url) {
        scenePreviewImg.classList.remove('visible');
        scenePlaceholder.style.display = '';
        sceneBadge.classList.remove('visible');
    } else {
        scenePreviewImg.src = url;
        scenePreviewImg.classList.add('visible');
        scenePlaceholder.style.display = 'none';
        sceneBadge.textContent = 'activa';
        sceneBadge.classList.add('visible');
    }
}

sceneInput.addEventListener('change', () => {
    const files = Array.from(sceneInput.files);
    if (!files.length) return;

    chrome.storage.local.get([KEY_SCENES, KEY_SCENE_SEL], result => {
        const scenes   = result[KEY_SCENES]   || [];
        const selected = result[KEY_SCENE_SEL] || null;
        let loaded = 0;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                scenes.push(reader.result);
                addSceneToGrid(reader.result, selected);
                loaded++;
                if (loaded === files.length)
                    chrome.storage.local.set({ [KEY_SCENES]: scenes });
            };
            reader.readAsDataURL(file);
        });
    });
    sceneInput.value = '';
});

sceneDeleteToggle.addEventListener('click', () => {
    isDeletingScenes = !isDeletingScenes;
    sceneDeleteToggle.textContent = isDeletingScenes
        ? 'Cancelar selección'
        : 'Seleccionar para borrar';
    if (!isDeletingScenes) clearSceneSelections();
});

sceneConfirmDel.addEventListener('click', () => {
    const selected = document.querySelectorAll('#sceneList .image-item.selected');
    const urlsToDelete = Array.from(selected).map(el => el.dataset.url);

    chrome.storage.local.get([KEY_SCENES, KEY_SCENE_SEL], result => {
        const scenes = (result[KEY_SCENES] || []).filter(u => !urlsToDelete.includes(u));
        let sel_url  = result[KEY_SCENE_SEL] || null;

        if (urlsToDelete.includes(sel_url)) {
            sel_url = null;
            updateScenePreview(null);
            applyToTab(injectSceneBackground, [null]);
        }

        chrome.storage.local.set({ [KEY_SCENES]: scenes, [KEY_SCENE_SEL]: sel_url }, () => {
            selected.forEach(el => el.remove());
            sceneConfirmDel.classList.add('hidden');
            sceneDeleteToggle.textContent = 'Seleccionar para borrar';
            isDeletingScenes = false;
        });
    });
});

function toggleSceneConfirm() {
    const any = document.querySelectorAll('#sceneList .image-item.selected').length > 0;
    sceneConfirmDel.classList.toggle('hidden', !any);
}

function clearSceneSelections() {
    document.querySelectorAll('#sceneList .image-item.selected').forEach(el =>
        el.classList.remove('selected')
    );
    sceneConfirmDel.classList.add('hidden');
}

// ══════════════════════════════════════════════════════════════
//   BANNER PUBLICITARIO
// ══════════════════════════════════════════════════════════════

function loadImages() {
    chrome.storage.local.get(KEY_ADS, result => {
        const images = result[KEY_ADS] || [];
        imageList.innerHTML = '';
        images.forEach(url => addImageToGrid(url));
        updateBannerPreview(images);
    });
}

imageInput.addEventListener('change', () => {
    const files = Array.from(imageInput.files);
    if (!files.length) return;

    chrome.storage.local.get(KEY_ADS, result => {
        const images = result[KEY_ADS] || [];
        let loaded = 0;
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                images.push(reader.result);
                addImageToGrid(reader.result);
                loaded++;
                if (loaded === files.length) {
                    chrome.storage.local.set({ [KEY_ADS]: images });
                    updateBannerPreview(images);
                }
            };
            reader.readAsDataURL(file);
        });
    });
    imageInput.value = '';
});

function addImageToGrid(url) {
    const item = document.createElement('div');
    item.classList.add('image-item');
    item.dataset.url = url;

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Banner';
    item.appendChild(img);

    item.addEventListener('click', () => {
        if (!isDeletingBanner) return;
        item.classList.toggle('selected');
        toggleBannerConfirm();
    });

    imageList.appendChild(item);
}

function updateBannerPreview(images) {
    if (!images.length) {
        bannerPreviewImg.classList.remove('visible');
        bannerPlaceholder.style.display = '';
        return;
    }
    const random = images[Math.floor(Math.random() * images.length)];
    bannerPreviewImg.src = random;
    bannerPreviewImg.classList.add('visible');
    bannerPlaceholder.style.display = 'none';
}

deleteToggle.addEventListener('click', () => {
    isDeletingBanner = !isDeletingBanner;
    deleteToggle.textContent = isDeletingBanner
        ? 'Cancelar selección'
        : 'Seleccionar para borrar';
    if (!isDeletingBanner) clearBannerSelections();
});

confirmDelete.addEventListener('click', () => {
    const selected = document.querySelectorAll('#imageList .image-item.selected');
    const urlsToDelete = Array.from(selected).map(el => el.dataset.url);

    chrome.storage.local.get(KEY_ADS, result => {
        const images = (result[KEY_ADS] || []).filter(u => !urlsToDelete.includes(u));
        chrome.storage.local.set({ [KEY_ADS]: images }, () => {
            selected.forEach(el => el.remove());
            confirmDelete.classList.add('hidden');
            deleteToggle.textContent = 'Seleccionar para borrar';
            isDeletingBanner = false;
            updateBannerPreview(images);
        });
    });
});

function toggleBannerConfirm() {
    const any = document.querySelectorAll('#imageList .image-item.selected').length > 0;
    confirmDelete.classList.toggle('hidden', !any);
}

function clearBannerSelections() {
    document.querySelectorAll('#imageList .image-item.selected').forEach(el =>
        el.classList.remove('selected')
    );
    confirmDelete.classList.add('hidden');
}

// ══════════════════════════════════════════════════════════════
//   FUNCIONES EJECUTADAS EN CONTEXTO DE LA PÁGINA
// ══════════════════════════════════════════════════════════════

function injectThemeVars(css) {
    let el = document.getElementById('wlm-color-theme');
    if (!el) {
        el = document.createElement('style');
        el.id = 'wlm-color-theme';
        document.head.appendChild(el);
    }
    el.textContent = css;
}

function injectAvatarTextColor(css) {
    let el = document.getElementById('wlm-text-color');
    if (!el) {
        el = document.createElement('style');
        el.id = 'wlm-text-color';
        document.head.appendChild(el);
    }
    el.textContent = css;
}

function injectSceneBackground(imageUrl) {
    const el = document.getElementById('wlm-gradient-scene');
    if (!el) return;
    const cls = '.x570efc.x9f619.x78zum5.x1okw0bk.x6s0dn4.x1peatla.x14ug900.x1280gxy.x889kno.x1a8lsjc.x106a9eq.x1xnnf8n';
    if (imageUrl) {
        el.textContent = `${cls} { background: url('${imageUrl}') no-repeat center / cover, var(--wlm-1) !important; }`;
    } else {
        el.textContent = '';
    }
}

function applyToTab(fn, args) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs[0]) return;
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, func: fn, args });
    });
}
