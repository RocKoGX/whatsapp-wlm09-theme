// popup/popup.js — WhatsApp WLM
// Selector de temas + gestión del banner publicitario

// ─── Definición de temas ─────────────────────────────────────
// Cada tema redefine las variables CSS de wlm-theme.css
// Los hovers, menús y botones W7 son siempre iguales (hardcoded)

const WLM_THEMES = [
    {
        id:    'blue',
        name:  'Azul',
        label: 'Azul (predeterminado)',
        // Color representativo del swatch (tono medio del gradiente)
        swatch: 'linear-gradient(135deg, #78cff8, #2989d8)',
        vars: {
            '--wlm-1':       '#78cff8',
            '--wlm-2':       '#46b6ea',
            '--wlm-3':       '#37a7dc',
            '--wlm-4':       '#45addb',
            '--wlm-pale':    '#52c4f0',
            '--wlm-bg':      '#d5f0fb',
            '--wlm-body':    '#e0eaf4',
            '--wlm-body-2':  '#c9e2ec',
            '--wlm-body-3':  '#c3d9ef',
            '--wlm-body-4':  '#e1eaf6',
            '--wlm-aero':    '#4580c4',
            '--wlm-aero-2':  '#6c9dd5',
            '--wlm-check':   '#54daff',
            '--wlm-link':    '#14b9ce',
            '--wlm-shadow':  '#015c5f',
            '--wlm-input-bg':'#e2eff4',
            '--wlm-input-br':'#bed6e0',
            '--wlm-search-bg':'#edf3f6',
            '--wlm-search-br':'#ced9e5',
        }
    },
    {
        id:    'purple',
        name:  'Morado',
        label: 'Morado',
        swatch: 'linear-gradient(135deg, #c49af8, #6b3fa0)',
        vars: {
            '--wlm-1':       '#c49af8',
            '--wlm-2':       '#9b6de0',
            '--wlm-3':       '#8255cc',
            '--wlm-4':       '#9060d0',
            '--wlm-pale':    '#a870e8',
            '--wlm-bg':      '#ead5fb',
            '--wlm-body':    '#ecdff4',
            '--wlm-body-2':  '#d8c2ec',
            '--wlm-body-3':  '#cdb3e3',
            '--wlm-body-4':  '#e8d8f4',
            '--wlm-aero':    '#6b3fa0',
            '--wlm-aero-2':  '#8c62b8',
            '--wlm-check':   '#c87aff',
            '--wlm-link':    '#9040cc',
            '--wlm-shadow':  '#3d1060',
            '--wlm-input-bg':'#ede0f6',
            '--wlm-input-br':'#c8a8e0',
            '--wlm-search-bg':'#f0e8f8',
            '--wlm-search-br':'#cdb4e4',
        }
    },
    {
        id:    'green',
        name:  'Verde',
        label: 'Verde',
        swatch: 'linear-gradient(135deg, #80d89a, #2a7a4e)',
        vars: {
            '--wlm-1':       '#80d89a',
            '--wlm-2':       '#4aba6e',
            '--wlm-3':       '#3aaa5e',
            '--wlm-4':       '#48b46a',
            '--wlm-pale':    '#55c878',
            '--wlm-bg':      '#d5fbe0',
            '--wlm-body':    '#dff0e4',
            '--wlm-body-2':  '#c2e8cc',
            '--wlm-body-3':  '#b8dfc3',
            '--wlm-body-4':  '#daeee0',
            '--wlm-aero':    '#2a7a4e',
            '--wlm-aero-2':  '#4a9a6a',
            '--wlm-check':   '#54ffaa',
            '--wlm-link':    '#1a9960',
            '--wlm-shadow':  '#0a4020',
            '--wlm-input-bg':'#e2f0e6',
            '--wlm-input-br':'#b4d8be',
            '--wlm-search-bg':'#ecf6ee',
            '--wlm-search-br':'#bcd9c4',
        }
    },
    {
        id:    'yellow',
        name:  'Amarillo',
        label: 'Amarillo',
        swatch: 'linear-gradient(135deg, #ffe066, #c8960a)',
        vars: {
            '--wlm-1':       '#ffe580',
            '--wlm-2':       '#f5c832',
            '--wlm-3':       '#e0b020',
            '--wlm-4':       '#f0be28',
            '--wlm-pale':    '#ffd040',
            '--wlm-bg':      '#fff5c0',
            '--wlm-body':    '#f8f0d0',
            '--wlm-body-2':  '#eeded8',
            '--wlm-body-3':  '#e8d8b0',
            '--wlm-body-4':  '#f4eccc',
            '--wlm-aero':    '#b8880a',
            '--wlm-aero-2':  '#d4a030',
            '--wlm-check':   '#ffe020',
            '--wlm-link':    '#b87800',
            '--wlm-shadow':  '#604000',
            '--wlm-input-bg':'#f8f0d4',
            '--wlm-input-br':'#e0cc88',
            '--wlm-search-bg':'#faf4e0',
            '--wlm-search-br':'#e4d090',
        }
    },
    {
        id:    'orange',
        name:  'Naranja',
        label: 'Naranja',
        swatch: 'linear-gradient(135deg, #ffb060, #d4600a)',
        vars: {
            '--wlm-1':       '#ffb878',
            '--wlm-2':       '#f08040',
            '--wlm-3':       '#e07030',
            '--wlm-4':       '#ee7e38',
            '--wlm-pale':    '#ff9040',
            '--wlm-bg':      '#ffe5d0',
            '--wlm-body':    '#f4e0d4',
            '--wlm-body-2':  '#e8ccbc',
            '--wlm-body-3':  '#e0c0ac',
            '--wlm-body-4':  '#f0d8c8',
            '--wlm-aero':    '#c04800',
            '--wlm-aero-2':  '#d86828',
            '--wlm-check':   '#ffaa40',
            '--wlm-link':    '#c85000',
            '--wlm-shadow':  '#602000',
            '--wlm-input-bg':'#f4e4d8',
            '--wlm-input-br':'#ddbba0',
            '--wlm-search-bg':'#f8ece4',
            '--wlm-search-br':'#e0c0a8',
        }
    },
    {
        id:    'red',
        name:  'Rojo',
        label: 'Rojo',
        swatch: 'linear-gradient(135deg, #f08080, #c02a2a)',
        vars: {
            '--wlm-1':       '#f09090',
            '--wlm-2':       '#e05050',
            '--wlm-3':       '#cc3838',
            '--wlm-4':       '#de4848',
            '--wlm-pale':    '#e84040',
            '--wlm-bg':      '#ffd5d5',
            '--wlm-body':    '#f4dada',
            '--wlm-body-2':  '#e8c0c0',
            '--wlm-body-3':  '#e0b0b0',
            '--wlm-body-4':  '#f0d0d0',
            '--wlm-aero':    '#a01818',
            '--wlm-aero-2':  '#be3838',
            '--wlm-check':   '#ff6060',
            '--wlm-link':    '#cc2020',
            '--wlm-shadow':  '#600000',
            '--wlm-input-bg':'#f4e0e0',
            '--wlm-input-br':'#d8b0b0',
            '--wlm-search-bg':'#f8e8e8',
            '--wlm-search-br':'#dbb8b8',
        }
    },
    {
        id:    'pink',
        name:  'Rosado',
        label: 'Rosado',
        swatch: 'linear-gradient(135deg, #f8a0c0, #c0407a)',
        vars: {
            '--wlm-1':       '#f8b0cc',
            '--wlm-2':       '#e878a8',
            '--wlm-3':       '#d86898',
            '--wlm-4':       '#e070a2',
            '--wlm-pale':    '#f080b8',
            '--wlm-bg':      '#ffd5ea',
            '--wlm-body':    '#f4dae8',
            '--wlm-body-2':  '#e8c0d8',
            '--wlm-body-3':  '#e0b0cc',
            '--wlm-body-4':  '#f0d0e0',
            '--wlm-aero':    '#a0286a',
            '--wlm-aero-2':  '#c04888',
            '--wlm-check':   '#ff80c0',
            '--wlm-link':    '#c03080',
            '--wlm-shadow':  '#600030',
            '--wlm-input-bg':'#f4e0ec',
            '--wlm-input-br':'#d8b0cc',
            '--wlm-search-bg':'#f8e8f0',
            '--wlm-search-br':'#dbb8cc',
        }
    },
    {
        id:    'gray',
        name:  'Gris',
        label: 'Gris',
        swatch: 'linear-gradient(135deg, #aabbc8, #5a6a7a)',
        vars: {
            '--wlm-1':       '#b0c0cc',
            '--wlm-2':       '#889aaa',
            '--wlm-3':       '#788898',
            '--wlm-4':       '#8898a8',
            '--wlm-pale':    '#90a8bc',
            '--wlm-bg':      '#dde4ea',
            '--wlm-body':    '#e4e8ec',
            '--wlm-body-2':  '#ccd4da',
            '--wlm-body-3':  '#c4ccd2',
            '--wlm-body-4':  '#dce0e4',
            '--wlm-aero':    '#4a5a6a',
            '--wlm-aero-2':  '#6a7a8a',
            '--wlm-check':   '#88ccee',
            '--wlm-link':    '#507090',
            '--wlm-shadow':  '#203040',
            '--wlm-input-bg':'#e2e8ec',
            '--wlm-input-br':'#b8c4cc',
            '--wlm-search-bg':'#e8ecf0',
            '--wlm-search-br':'#bcc4ca',
        }
    },
];

// ─── Claves de storage ────────────────────────────────────────
const STORAGE_KEY_ADS   = 'wlm_ads_images';
const STORAGE_KEY_THEME = 'wlm_color_theme';

// ─── Referencias DOM ──────────────────────────────────────────
const themeGrid         = document.getElementById('themeGrid');
const themeActiveLabel  = document.getElementById('themeActiveLabel');
const imageInput        = document.getElementById('imageInput');
const imageList         = document.getElementById('imageList');
const deleteToggle      = document.getElementById('deleteToggle');
const confirmDelete     = document.getElementById('confirmDelete');
const bannerPreviewImg  = document.getElementById('bannerPreviewImg');
const bannerPlaceholder = document.getElementById('bannerPlaceholder');

let isSelecting = false;

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    buildThemeGrid();
    loadSavedTheme();
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
        swatch.title = theme.name;

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

    // Actualizar UI del popup
    document.querySelectorAll('.theme-swatch').forEach(s => {
        s.classList.toggle('active', s.dataset.id === themeId);
    });
    themeActiveLabel.textContent = theme.label;

    // Guardar ID y CSS completo (para que style-injector.js lo restaure al recargar)
    const cssVarsForStorage = Object.entries(theme.vars)
        .map(([k, v]) => `${k}: ${v};`)
        .join(' ');
    chrome.storage.local.set({
        [STORAGE_KEY_THEME]: themeId,
        'wlm_theme_css': `:root { ${cssVarsForStorage} }`,
    });

    // Aplicar en la pestaña activa de WhatsApp Web
    applyThemeToTab(theme);
}

function loadSavedTheme() {
    chrome.storage.local.get(STORAGE_KEY_THEME, result => {
        const themeId = result[STORAGE_KEY_THEME] || 'blue';
        const theme = WLM_THEMES.find(t => t.id === themeId) || WLM_THEMES[0];

        document.querySelectorAll('.theme-swatch').forEach(s => {
            s.classList.toggle('active', s.dataset.id === themeId);
        });
        themeActiveLabel.textContent = theme.label;
    });
}

function applyThemeToTab(theme) {
    // Construye el CSS con las variables del tema
    const cssVars = Object.entries(theme.vars)
        .map(([k, v]) => `${k}: ${v};`)
        .join(' ');

    const css = `:root { ${cssVars} }`;

    // Inyecta mediante content script en la pestaña activa
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs[0]) return;
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: injectThemeVars,
            args: [css],
        });
    });
}

// Esta función se ejecuta en el contexto de la página (no del popup)
function injectThemeVars(css) {
    let el = document.getElementById('wlm-color-theme');
    if (!el) {
        el = document.createElement('style');
        el.id = 'wlm-color-theme';
        document.head.appendChild(el);
    }
    el.textContent = css;
}

// ══════════════════════════════════════════════════════════════
//   BANNER PUBLICITARIO
// ══════════════════════════════════════════════════════════════

function loadImages() {
    chrome.storage.local.get(STORAGE_KEY_ADS, result => {
        const images = result[STORAGE_KEY_ADS] || [];
        imageList.innerHTML = '';
        images.forEach(url => addImageToGrid(url));
        updateBannerPreview(images);
    });
}

imageInput.addEventListener('change', () => {
    const files = Array.from(imageInput.files);
    if (!files.length) return;

    chrome.storage.local.get(STORAGE_KEY_ADS, result => {
        const images = result[STORAGE_KEY_ADS] || [];
        let loaded = 0;

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                images.push(reader.result);
                addImageToGrid(reader.result);
                loaded++;
                if (loaded === files.length) {
                    chrome.storage.local.set({ [STORAGE_KEY_ADS]: images });
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
        if (!isSelecting) return;
        item.classList.toggle('selected');
        toggleConfirmButton();
    });

    imageList.appendChild(item);
}

function updateBannerPreview(images) {
    if (images.length === 0) {
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
    isSelecting = !isSelecting;
    deleteToggle.textContent = isSelecting
        ? 'Cancelar selección'
        : 'Seleccionar para borrar';
    if (!isSelecting) clearSelections();
});

confirmDelete.addEventListener('click', () => {
    const selected = document.querySelectorAll('.image-item.selected');
    const urlsToDelete = Array.from(selected).map(el => el.dataset.url);

    chrome.storage.local.get(STORAGE_KEY_ADS, result => {
        const images = (result[STORAGE_KEY_ADS] || []).filter(url => !urlsToDelete.includes(url));
        chrome.storage.local.set({ [STORAGE_KEY_ADS]: images }, () => {
            selected.forEach(el => el.remove());
            confirmDelete.classList.add('hidden');
            deleteToggle.textContent = 'Seleccionar para borrar';
            isSelecting = false;
            updateBannerPreview(images);
        });
    });
});

function toggleConfirmButton() {
    const any = document.querySelectorAll('.image-item.selected').length > 0;
    confirmDelete.classList.toggle('hidden', !any);
}

function clearSelections() {
    document.querySelectorAll('.image-item.selected').forEach(el => el.classList.remove('selected'));
    confirmDelete.classList.add('hidden');
}
