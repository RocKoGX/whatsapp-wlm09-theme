// popup/popup.js — WhatsApp WLM

// ─── Claves de storage ────────────────────────────────────────
const KEY_THEME        = 'wlm_color_theme';
const KEY_THEME_CSS    = 'wlm_theme_css';
const KEY_THEME_AUTO   = 'wlm_theme_auto';
const KEY_SCENE_SEL    = 'wlm_scene_selected';
const KEY_AD_SEL       = 'wlm_ad_selected';
const KEY_TEXT_INVERTED= 'wlm_text_inverted';
const KEY_BG_SEL       = 'wlm_bg_selected'; // nombre de archivo o null = predeterminado

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

    .x140p0ai.x1gufx9m.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1lliihq.x1fj9vlw.x14ug900.x1hx0egp.x1aueamr.xjb2p0i.xo1l8bm.xladpa3.x1ic7a3i {
        color: black;
        text-shadow: 0 0 2px #fff, 0 0 10px #fff, 0 0 1px #fff,
                     0 0 2px #fff, 0 0 1px #fff, 0 0 1px #fff,
                     0 0 5px #fff, 0 0 1px #fff;
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

    .x140p0ai.x1gufx9m.x1s928wv.xhkezso.x1gmr53x.x1cpjm7i.x1fgarty.x1943h6x.x193iq5w.xeuugli.x13faqbe.x1vvkbs.x1lliihq.x1fj9vlw.x14ug900.x1hx0egp.x1aueamr.xjb2p0i.xo1l8bm.xladpa3.x1ic7a3i {
        color: white;
        text-shadow: 0 0 2px #000, 0 0 10px #000, 0 0 1px #000,
                     0 0 2px #000, 0 0 1px #000, 0 0 1px #000,
                     0 0 5px #000, 0 0 1px #000;
    }
`;

// ─── Paleta de temas manuales ─────────────────────────────────
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
    mkTheme({ id:'blue',         name:'Azul',         label:'Azul (predeterminado)', swatch:'linear-gradient(135deg,#78cff8,#2989d8)', c1:'#78cff8', c2:'#46b6ea', c3:'#37a7dc', c4:'#45addb', pale:'#52c4f0', bg:'#d5f0fb', body:'#e0eaf4', b2:'#c9e2ec', b3:'#c3d9ef', b4:'#e1eaf6', aero:'#4580c4', aero2:'#6c9dd5', check:'#54daff', link:'#14b9ce', shadow:'#015c5f', ibg:'#e2eff4', ibr:'#bed6e0', sbg:'#edf3f6', sbr:'#ced9e5' }),
    mkTheme({ id:'blue-light',   name:'Azul claro',   swatch:'linear-gradient(135deg,#b0e8ff,#5bbde8)', c1:'#b0e8ff', c2:'#7ad0f5', c3:'#60c0ec', c4:'#72caf0', pale:'#85d8f8', bg:'#e5f8ff', body:'#eef7fc', b2:'#d4eef8', b3:'#c8e8f5', b4:'#e8f4fb', aero:'#3a90cc', aero2:'#60aade', check:'#80e8ff', link:'#20aae0', shadow:'#005878', ibg:'#e8f4fb', ibr:'#a8d8ee', sbg:'#f0f8fd', sbr:'#b8ddf0' }),
    mkTheme({ id:'blue-dark',    name:'Azul oscuro',  swatch:'linear-gradient(135deg,#4878c0,#1a3880)', c1:'#5888d0', c2:'#3060a8', c3:'#204e94', c4:'#2e5ea0', pale:'#3870b8', bg:'#b0c8ee', body:'#c8d8f0', b2:'#a8bce0', b3:'#98aedc', b4:'#bccce8', aero:'#1a3880', aero2:'#2a5098', check:'#60aaff', link:'#3080d8', shadow:'#08204a', ibg:'#c8d8f0', ibr:'#88a8d4', sbg:'#d4e0f4', sbr:'#90aed8' }),
    mkTheme({ id:'purple',       name:'Morado',       swatch:'linear-gradient(135deg,#c49af8,#6b3fa0)', c1:'#c49af8', c2:'#9b6de0', c3:'#8255cc', c4:'#9060d0', pale:'#a870e8', bg:'#ead5fb', body:'#ecdff4', b2:'#d8c2ec', b3:'#cdb3e3', b4:'#e8d8f4', aero:'#6b3fa0', aero2:'#8c62b8', check:'#c87aff', link:'#9040cc', shadow:'#3d1060', ibg:'#ede0f6', ibr:'#c8a8e0', sbg:'#f0e8f8', sbr:'#cdb4e4' }),
    mkTheme({ id:'purple-light', name:'Morado claro', swatch:'linear-gradient(135deg,#e0b8ff,#a870d8)', c1:'#e0b8ff', c2:'#c090f0', c3:'#ae78e4', c4:'#b880ec', pale:'#cc98f8', bg:'#f2e4ff', body:'#f5edfb', b2:'#e8d4f8', b3:'#e0c8f4', b4:'#f0e4fa', aero:'#9050c0', aero2:'#b070d8', check:'#e090ff', link:'#a860d8', shadow:'#5a2880', ibg:'#f0e8fa', ibr:'#d4b8f0', sbg:'#f6f0fc', sbr:'#dcc0f4' }),
    mkTheme({ id:'green',        name:'Verde',        swatch:'linear-gradient(135deg,#80d89a,#2a7a4e)', c1:'#80d89a', c2:'#4aba6e', c3:'#3aaa5e', c4:'#48b46a', pale:'#55c878', bg:'#d5fbe0', body:'#dff0e4', b2:'#c2e8cc', b3:'#b8dfc3', b4:'#daeee0', aero:'#2a7a4e', aero2:'#4a9a6a', check:'#54ffaa', link:'#1a9960', shadow:'#0a4020', ibg:'#e2f0e6', ibr:'#b4d8be', sbg:'#ecf6ee', sbr:'#bcd9c4' }),
    mkTheme({ id:'green-light',  name:'Verde claro',  swatch:'linear-gradient(135deg,#b0f0c0,#60c880)', c1:'#b0f0c0', c2:'#7ad898', c3:'#62cc84', c4:'#72d490', pale:'#88e4a0', bg:'#e4fcea', body:'#eefaee', b2:'#d4f2da', b3:'#c8eece', b4:'#e4f8e8', aero:'#3aaa60', aero2:'#58c478', check:'#80ffb8', link:'#28cc78', shadow:'#106030', ibg:'#e8f8ec', ibr:'#aadcb8', sbg:'#f0faf2', sbr:'#b8e0c4' }),
    mkTheme({ id:'yellow',       name:'Amarillo',     swatch:'linear-gradient(135deg,#ffe066,#c8960a)', c1:'#ffe580', c2:'#f5c832', c3:'#e0b020', c4:'#f0be28', pale:'#ffd040', bg:'#fff5c0', body:'#f8f0d0', b2:'#eeded8', b3:'#e8d8b0', b4:'#f4eccc', aero:'#b8880a', aero2:'#d4a030', check:'#ffe020', link:'#b87800', shadow:'#604000', ibg:'#f8f0d4', ibr:'#e0cc88', sbg:'#faf4e0', sbr:'#e4d090' }),
    mkTheme({ id:'orange',       name:'Naranja',      swatch:'linear-gradient(135deg,#ffb060,#d4600a)', c1:'#ffb878', c2:'#f08040', c3:'#e07030', c4:'#ee7e38', pale:'#ff9040', bg:'#ffe5d0', body:'#f4e0d4', b2:'#e8ccbc', b3:'#e0c0ac', b4:'#f0d8c8', aero:'#c04800', aero2:'#d86828', check:'#ffaa40', link:'#c85000', shadow:'#602000', ibg:'#f4e4d8', ibr:'#ddbba0', sbg:'#f8ece4', sbr:'#e0c0a8' }),
    mkTheme({ id:'red',          name:'Rojo',         swatch:'linear-gradient(135deg,#f08080,#c02a2a)', c1:'#f09090', c2:'#e05050', c3:'#cc3838', c4:'#de4848', pale:'#e84040', bg:'#ffd5d5', body:'#f4dada', b2:'#e8c0c0', b3:'#e0b0b0', b4:'#f0d0d0', aero:'#a01818', aero2:'#be3838', check:'#ff6060', link:'#cc2020', shadow:'#600000', ibg:'#f4e0e0', ibr:'#d8b0b0', sbg:'#f8e8e8', sbr:'#dbb8b8' }),
    mkTheme({ id:'pink',         name:'Rosado',       swatch:'linear-gradient(135deg,#f8a0c0,#c0407a)', c1:'#f8b0cc', c2:'#e878a8', c3:'#d86898', c4:'#e070a2', pale:'#f080b8', bg:'#ffd5ea', body:'#f4dae8', b2:'#e8c0d8', b3:'#e0b0cc', b4:'#f0d0e0', aero:'#a0286a', aero2:'#c04888', check:'#ff80c0', link:'#c03080', shadow:'#600030', ibg:'#f4e0ec', ibr:'#d8b0cc', sbg:'#f8e8f0', sbr:'#dbb8cc' }),
    mkTheme({ id:'teal',         name:'Turquesa',     swatch:'linear-gradient(135deg,#70e0d8,#0a8888)', c1:'#70e0d8', c2:'#30c0b8', c3:'#20aaaa', c4:'#28b8b0', pale:'#40d0c8', bg:'#c8f8f4', body:'#d8f4f0', b2:'#b8e8e4', b3:'#a8e0dc', b4:'#ccf0ec', aero:'#0a7878', aero2:'#289898', check:'#50ffe8', link:'#10a8a0', shadow:'#004040', ibg:'#d8f0ec', ibr:'#88d0c8', sbg:'#e4f8f5', sbr:'#98d8d0' }),
    mkTheme({ id:'gray',         name:'Gris',         swatch:'linear-gradient(135deg,#aabbc8,#5a6a7a)', c1:'#b0c0cc', c2:'#889aaa', c3:'#788898', c4:'#8898a8', pale:'#90a8bc', bg:'#dde4ea', body:'#e4e8ec', b2:'#ccd4da', b3:'#c4ccd2', b4:'#dce0e4', aero:'#4a5a6a', aero2:'#6a7a8a', check:'#88ccee', link:'#507090', shadow:'#203040', ibg:'#e2e8ec', ibr:'#b8c4cc', sbg:'#e8ecf0', sbr:'#bcc4ca' }),
    mkTheme({ id:'brown',        name:'Café',         swatch:'linear-gradient(135deg,#c8a070,#7a4820)', c1:'#c8a070', c2:'#a07840', c3:'#8c6430', c4:'#a87838', pale:'#b88848', bg:'#f0dcc0', body:'#ede0cc', b2:'#ddc8a8', b3:'#d4bc98', b4:'#e8d8bc', aero:'#7a4820', aero2:'#9a6038', check:'#e0c070', link:'#8a5020', shadow:'#402000', ibg:'#ece0cc', ibr:'#ccaa80', sbg:'#f2e8d8', sbr:'#d4b488' }),
    mkTheme({ id:'black',        name:'Negro',        swatch:'linear-gradient(135deg,#707070,#202020)', c1:'#686868', c2:'#484848', c3:'#383838', c4:'#484848', pale:'#505050', bg:'#c0c0c0', body:'#d0d0d0', b2:'#b8b8b8', b3:'#b0b0b0', b4:'#c8c8c8', aero:'#282828', aero2:'#404040', check:'#a0a0a0', link:'#808080', shadow:'#080808', ibg:'#d0d0d0', ibr:'#989898', sbg:'#d8d8d8', sbr:'#a0a0a0' }),
];

// ══════════════════════════════════════════════════════════════
//   GENERADOR DE TEMA AUTOMÁTICO
// ══════════════════════════════════════════════════════════════

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g-b)/d + (g<b?6:0)) / 6; break;
            case g: h = ((b-r)/d + 2) / 6; break;
            case b: h = ((r-g)/d + 4) / 6; break;
        }
    }
    return [h*360, s*100, l*100];
}

function hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1/6) return p + (q-p)*6*t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q-p)*(2/3-t)*6;
            return p;
        };
        const q = l < 0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
        r = hue2rgb(p,q,h+1/3); g = hue2rgb(p,q,h); b = hue2rgb(p,q,h-1/3);
    }
    const toHex = x => Math.round(x*255).toString(16).padStart(2,'0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustHsl(h, s, l, ds=0, dl=0) {
    return hslToHex(h, Math.max(0,Math.min(100,s+ds)), Math.max(0,Math.min(100,l+dl)));
}

function getDominantColor(imgUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.getElementById('colorCanvas');
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 50, 50);
            const data = ctx.getImageData(0,0,50,50).data;
            let r=0,g=0,b=0,count=0;
            for (let i=0; i<data.length; i+=4*4) {
                const pr=data[i],pg=data[i+1],pb=data[i+2];
                const br=(pr+pg+pb)/3;
                if (br<25||br>230) continue;
                r+=pr; g+=pg; b+=pb; count++;
            }
            if (count===0) { resolve([100,160,220]); return; }
            resolve([Math.round(r/count), Math.round(g/count), Math.round(b/count)]);
        };
        img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
        img.src = imgUrl;
    });
}

function generateThemeVars(r, g, b) {
    const [h, s, l] = rgbToHsl(r, g, b);
    const sBase = Math.max(s, 25);
    const lBase = Math.max(45, Math.min(65, l));
    return {
        '--wlm-1':        adjustHsl(h, sBase,       lBase + 16),
        '--wlm-2':        adjustHsl(h, sBase,       lBase),
        '--wlm-3':        adjustHsl(h, sBase + 5,   lBase - 8),
        '--wlm-4':        adjustHsl(h, sBase,       lBase - 4),
        '--wlm-pale':     adjustHsl(h, sBase - 5,   lBase + 10),
        '--wlm-bg':       adjustHsl(h, sBase - 20,  85),
        '--wlm-body':     adjustHsl(h, sBase - 25,  88),
        '--wlm-body-2':   adjustHsl(h, sBase - 15,  78),
        '--wlm-body-3':   adjustHsl(h, sBase - 12,  74),
        '--wlm-body-4':   adjustHsl(h, sBase - 22,  85),
        '--wlm-aero':     adjustHsl(h, sBase + 10,  lBase - 20),
        '--wlm-aero-2':   adjustHsl(h, sBase + 5,   lBase - 10),
        '--wlm-check':    adjustHsl(h, sBase + 15,  lBase + 25),
        '--wlm-link':     adjustHsl(h, sBase + 10,  lBase - 5),
        '--wlm-shadow':   adjustHsl(h, sBase + 20,  lBase - 35),
        '--wlm-input-bg': adjustHsl(h, sBase - 30,  90),
        '--wlm-input-br': adjustHsl(h, sBase - 20,  75),
        '--wlm-search-bg':adjustHsl(h, sBase - 32,  92),
        '--wlm-search-br':adjustHsl(h, sBase - 22,  78),
    };
}

function buildThemeCss(vars) {
    return `:root { ${Object.entries(vars).map(([k,v])=>`${k}:${v};`).join(' ')} }`;
}

async function autoDetectAndApply(imageUrl) {
    autoDesc.textContent = 'Analizando...';
    try {
        const [r,g,b] = await getDominantColor(imageUrl);
        const [h,s,l] = rgbToHsl(r,g,b);
        const detectedHex = hslToHex(h, Math.max(s,25), Math.max(45,Math.min(65,l)));
        swatchAutoCircle.style.background = `conic-gradient(${detectedHex} 0deg 360deg)`;
        autoDesc.textContent = 'Color detectado';
        const vars = generateThemeVars(r,g,b);
        const css  = buildThemeCss(vars);
        chrome.storage.local.set({ [KEY_THEME_CSS]: css });
        applyToTab(injectThemeVars, [css]);
        themeActiveLabel.textContent = `Auto: rgb(${r},${g},${b})`;
    } catch { autoDesc.textContent = 'Error al analizar'; }
}

function resetAutoSwatchToRainbow() {
    swatchAutoCircle.style.background = `conic-gradient(
        #f09090 0deg 40deg, #f0be28 40deg 80deg, #80d89a 80deg 130deg,
        #78cff8 130deg 200deg, #c49af8 200deg 270deg, #f8b0cc 270deg 320deg,
        #f09090 320deg 360deg)`;
}

// ══════════════════════════════════════════════════════════════
//   REFERENCIAS DOM
// ══════════════════════════════════════════════════════════════
const themeGrid        = document.getElementById('themeGrid');
const themeActiveLabel = document.getElementById('themeActiveLabel');
const swatchAuto       = document.getElementById('swatchAuto');
const swatchAutoCircle = swatchAuto.querySelector('.theme-swatch__circle--auto');
const autoDesc         = document.getElementById('autoDesc');
const textColorToggle  = document.getElementById('textColorToggle');
const textColorDesc    = document.getElementById('textColorDesc');

const sceneList        = document.getElementById('sceneList');
const scenePreviewImg  = document.getElementById('scenePreviewImg');
const scenePlaceholder = document.getElementById('scenePlaceholder');
const sceneBadge       = document.getElementById('sceneBadge');

const adList           = document.getElementById('adList');
const bannerPreviewImg = document.getElementById('bannerPreviewImg');
const bannerPlaceholder= document.getElementById('bannerPlaceholder');
const bannerBadge      = document.getElementById('bannerBadge');

const bgList           = document.getElementById('bgList');
const bgPreviewImg     = document.getElementById('bgPreviewImg');
const bgPlaceholder    = document.getElementById('bgPlaceholder');
const bgBadge          = document.getElementById('bgBadge');
const bgReset          = document.getElementById('bgReset');

let isAutoMode = false;

// ══════════════════════════════════════════════════════════════
//   TABS
// ══════════════════════════════════════════════════════════════
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
        document.querySelectorAll('.tab-panel').forEach(p =>
            p.classList.toggle('active', p.id === `panel-${target}`)
        );
    });
});

// ══════════════════════════════════════════════════════════════
//   INIT
// ══════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
    buildThemeGrid();
    loadSavedTheme();
    loadTextColorToggle();
    loadScenes();
    loadAds();
    loadBackgrounds();
});

// ══════════════════════════════════════════════════════════════
//   SELECTOR DE TEMAS
// ══════════════════════════════════════════════════════════════
function buildThemeGrid() {
    WLM_THEMES.forEach(theme => {
        const swatch = document.createElement('div');
        swatch.classList.add('theme-swatch'); swatch.dataset.id = theme.id; swatch.title = theme.label;
        const circle = document.createElement('div');
        circle.classList.add('theme-swatch__circle'); circle.style.background = theme.swatch;
        const name = document.createElement('span');
        name.classList.add('theme-swatch__name'); name.textContent = theme.name;
        swatch.appendChild(circle); swatch.appendChild(name);
        swatch.addEventListener('click', () => { if (isAutoMode) deactivateAutoMode(); selectTheme(theme.id); });
        themeGrid.appendChild(swatch);
    });
}

function selectTheme(themeId) {
    const theme = WLM_THEMES.find(t => t.id === themeId);
    if (!theme) return;
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.toggle('active', s.dataset.id === themeId));
    themeActiveLabel.textContent = theme.label;
    const css = buildThemeCss(theme.vars);
    chrome.storage.local.set({ [KEY_THEME]: themeId, [KEY_THEME_CSS]: css });
    applyToTab(injectThemeVars, [css]);
}

function loadSavedTheme() {
    chrome.storage.local.get([KEY_THEME, KEY_THEME_AUTO], result => {
        isAutoMode = result[KEY_THEME_AUTO] || false;
        if (isAutoMode) {
            activateAutoModeUI();
            chrome.storage.local.get(KEY_SCENE_SEL, r => {
                if (r[KEY_SCENE_SEL]) autoDetectAndApply(chrome.runtime.getURL(`assets/scenes/${r[KEY_SCENE_SEL]}`));
                else autoDesc.textContent = 'Selecciona una escena';
            });
        } else {
            const themeId = result[KEY_THEME] || 'blue';
            const theme = WLM_THEMES.find(t => t.id === themeId) || WLM_THEMES[0];
            document.querySelectorAll('.theme-swatch').forEach(s => s.classList.toggle('active', s.dataset.id === themeId));
            themeActiveLabel.textContent = theme.label;
        }
    });
}

swatchAuto.addEventListener('click', () => { isAutoMode ? deactivateAutoMode() : activateAutoMode(); });

function activateAutoMode() {
    isAutoMode = true;
    chrome.storage.local.set({ [KEY_THEME_AUTO]: true });
    activateAutoModeUI();
    chrome.storage.local.get(KEY_SCENE_SEL, result => {
        if (result[KEY_SCENE_SEL]) autoDetectAndApply(chrome.runtime.getURL(`assets/scenes/${result[KEY_SCENE_SEL]}`));
        else autoDesc.textContent = 'Selecciona una escena';
    });
}

function deactivateAutoMode() {
    isAutoMode = false;
    chrome.storage.local.set({ [KEY_THEME_AUTO]: false });
    swatchAuto.classList.remove('active');
    themeGrid.classList.remove('auto-active');
    resetAutoSwatchToRainbow();
    autoDesc.textContent = 'Tema fijo';
}

function activateAutoModeUI() {
    swatchAuto.classList.add('active');
    themeGrid.classList.add('auto-active');
    document.querySelectorAll('.theme-swatch').forEach(s => s.classList.remove('active'));
    themeActiveLabel.textContent = 'Automático';
    resetAutoSwatchToRainbow();
}

// ══════════════════════════════════════════════════════════════
//   TOGGLE TEXTO DEL AVATAR
// ══════════════════════════════════════════════════════════════
function loadTextColorToggle() {
    chrome.storage.local.get(KEY_TEXT_INVERTED, result => setTextColorUI(result[KEY_TEXT_INVERTED] || false));
}
function setTextColorUI(isInverted) {
    textColorToggle.classList.toggle('on', isInverted);
    textColorDesc.textContent = isInverted ? 'Blanco sobre oscuro' : 'Negro sobre claro';
}
textColorToggle.addEventListener('click', () => {
    const newState = !textColorToggle.classList.contains('on');
    setTextColorUI(newState);
    chrome.storage.local.set({ [KEY_TEXT_INVERTED]: newState });
    applyToTab(injectAvatarTextColor, [newState ? TEXT_INVERTED : TEXT_NORMAL]);
});

// ══════════════════════════════════════════════════════════════
//   ESCENAS DE FONDO
// ══════════════════════════════════════════════════════════════
function loadScenes() {
    fetch(chrome.runtime.getURL('assets/scenes/scenes-index.json'))
        .then(r => r.json())
        .then(files => {
            chrome.storage.local.get(KEY_SCENE_SEL, result => {
                const sel = result[KEY_SCENE_SEL] || null;
                if (!files.length) { scenePlaceholder.textContent = 'No hay escenas en assets/scenes/'; return; }
                scenePlaceholder.style.display = 'none';
                files.forEach(f => addAssetItem(sceneList, f, chrome.runtime.getURL(`assets/scenes/${f}`), sel, 'scene'));
                updateAssetPreview(sel, 'assets/scenes/', scenePreviewImg, scenePlaceholder, sceneBadge);
            });
        })
        .catch(() => { scenePlaceholder.textContent = 'No se encontró scenes-index.json'; });
}

// ══════════════════════════════════════════════════════════════
//   BANNERS PUBLICITARIOS
// ══════════════════════════════════════════════════════════════
function loadAds() {
    fetch(chrome.runtime.getURL('assets/ads/ads-index.json'))
        .then(r => r.json())
        .then(files => {
            chrome.storage.local.get(KEY_AD_SEL, result => {
                const sel = result[KEY_AD_SEL] || null;
                if (!files.length) { bannerPlaceholder.textContent = 'No hay banners en assets/ads/'; return; }
                bannerPlaceholder.style.display = 'none';
                files.forEach(f => addAssetItem(adList, f, chrome.runtime.getURL(`assets/ads/${f}`), sel, 'ad'));
                updateAssetPreview(sel || files[0], 'assets/ads/', bannerPreviewImg, bannerPlaceholder, bannerBadge,
                    sel ? `fijo: ${sel}` : 'aleatorio');
            });
        })
        .catch(() => { bannerPlaceholder.textContent = 'No se encontró ads-index.json'; });
}

// ══════════════════════════════════════════════════════════════
//   FONDO DE PANTALLA
// ══════════════════════════════════════════════════════════════
function loadBackgrounds() {
    fetch(chrome.runtime.getURL('background/backgrounds-index.json'))
        .then(r => r.json())
        .then(files => {
            chrome.storage.local.get(KEY_BG_SEL, result => {
                const sel = result[KEY_BG_SEL] || null;
                if (!files.length) { bgPlaceholder.textContent = 'No hay fondos en background/'; return; }
                bgPlaceholder.style.display = 'none';
                files.forEach(f => addAssetItem(bgList, f, chrome.runtime.getURL(`background/${f}`), sel, 'bg'));
                updateAssetPreview(sel, 'background/', bgPreviewImg, bgPlaceholder, bgBadge);
            });
        })
        .catch(() => { bgPlaceholder.textContent = 'No se encontró backgrounds-index.json'; });
}

// Restaurar fondo predeterminado
bgReset.addEventListener('click', () => {
    document.querySelectorAll('#bgList .image-item').forEach(el => el.classList.remove('active'));
    chrome.storage.local.set({ [KEY_BG_SEL]: null });
    bgPreviewImg.classList.remove('visible');
    bgPlaceholder.textContent = 'Fondo predeterminado activo';
    bgPlaceholder.style.display = '';
    bgBadge.classList.remove('visible');
    applyToTab(injectPrincipalBackground, [null]);
});

// ─── Ítem de asset genérico ───────────────────────────────────
function addAssetItem(grid, filename, url, selectedFilename, type) {
    const item = document.createElement('div');
    item.classList.add('image-item'); item.dataset.filename = filename;
    if (filename === selectedFilename) item.classList.add('active');
    const img = document.createElement('img'); img.src = url; img.alt = filename;
    item.appendChild(img);
    item.addEventListener('click', () => {
        if (type === 'scene') selectScene(filename, url);
        if (type === 'ad')    selectAd(filename);
        if (type === 'bg')    selectBackground(filename, url);
    });
    grid.appendChild(item);
}

function selectScene(filename, url) {
    document.querySelectorAll('#sceneList .image-item').forEach(el =>
        el.classList.toggle('active', el.dataset.filename === filename)
    );
    chrome.storage.local.set({ [KEY_SCENE_SEL]: filename });
    updateAssetPreview(filename, 'assets/scenes/', scenePreviewImg, scenePlaceholder, sceneBadge, 'activa');
    applyToTab(injectSceneBackground, [url]);
    if (isAutoMode) autoDetectAndApply(url);
}

function selectAd(filename) {
    chrome.storage.local.get(KEY_AD_SEL, result => {
        const current = result[KEY_AD_SEL] || null;
        const url = chrome.runtime.getURL(`assets/ads/${filename}`);
        if (current === filename) {
            document.querySelectorAll('#adList .image-item').forEach(el => el.classList.remove('active'));
            chrome.storage.local.set({ [KEY_AD_SEL]: null });
            updateAssetPreview(filename, 'assets/ads/', bannerPreviewImg, bannerPlaceholder, bannerBadge, 'aleatorio');
        } else {
            document.querySelectorAll('#adList .image-item').forEach(el =>
                el.classList.toggle('active', el.dataset.filename === filename)
            );
            chrome.storage.local.set({ [KEY_AD_SEL]: filename });
            updateAssetPreview(filename, 'assets/ads/', bannerPreviewImg, bannerPlaceholder, bannerBadge, `fijo: ${filename}`);
        }
    });
}

function selectBackground(filename, url) {
    document.querySelectorAll('#bgList .image-item').forEach(el =>
        el.classList.toggle('active', el.dataset.filename === filename)
    );
    chrome.storage.local.set({ [KEY_BG_SEL]: filename });
    updateAssetPreview(filename, 'background/', bgPreviewImg, bgPlaceholder, bgBadge, 'activo');
    applyToTab(injectPrincipalBackground, [url]);
}

function updateAssetPreview(filename, folder, imgEl, placeholderEl, badgeEl, badgeText = 'activa') {
    if (!filename) {
        imgEl.classList.remove('visible'); placeholderEl.style.display = ''; badgeEl.classList.remove('visible');
        return;
    }
    imgEl.src = chrome.runtime.getURL(`${folder}${filename}`);
    imgEl.classList.add('visible'); placeholderEl.style.display = 'none';
    badgeEl.textContent = badgeText; badgeEl.classList.add('visible');
}

// ══════════════════════════════════════════════════════════════
//   FUNCIONES EN CONTEXTO DE LA PÁGINA
// ══════════════════════════════════════════════════════════════
function injectThemeVars(css) {
    let el = document.getElementById('wlm-color-theme');
    if (!el) { el = document.createElement('style'); el.id = 'wlm-color-theme'; document.head.appendChild(el); }
    el.textContent = css;
}

function injectAvatarTextColor(css) {
    let el = document.getElementById('wlm-text-color');
    if (!el) { el = document.createElement('style'); el.id = 'wlm-text-color'; document.head.appendChild(el); }
    el.textContent = css;
}

function injectSceneBackground(imageUrl) {
    const el = document.getElementById('wlm-gradient-scene');
    if (!el) return;
    const cls = '.x570efc.x9f619.x78zum5.x1okw0bk.x6s0dn4.x1peatla.x14ug900.x1280gxy.x889kno.x1a8lsjc.x106a9eq.x1xnnf8n';
    el.textContent = `${cls} { background: url('${imageUrl}') no-repeat center / cover, var(--wlm-1) !important; }`;
}

// Inyecta el fondo de pantalla principal (la imagen de fondo del sidebar izquierdo)
function injectPrincipalBackground(imageUrl) {
    let el = document.getElementById('wlm-principal-bg');
    if (!el) { el = document.createElement('style'); el.id = 'wlm-principal-bg'; document.head.appendChild(el); }

    if (!imageUrl) {
        // Sin URL → vaciar el override, icon-replacer.js retoma el control con su valor predeterminado
        el.textContent = '';
        return;
    }

    // El fondo principal se aplica al ::before de .x1h3rtpe (barra lateral izquierda)
    el.textContent = `
        .x1h3rtpe::before {
            background: url('${imageUrl}') no-repeat !important;
            background-size: cover !important;
        }
    `;
}

function applyToTab(fn, args) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs[0]) return;
        chrome.scripting.executeScript({ target: { tabId: tabs[0].id }, func: fn, args });
    });
}
