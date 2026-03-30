// content/ad-banner.js
// Módulo de banner publicitario estilo WLM

const AdBanner = (() => {

    // ─── Selector del elemento banner en WhatsApp Web ────────────────────────
    const BANNER_SELECTOR = '.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.xl56j7k.x1q0g3np.x6s0dn4.x2kejxg.x3nfvp2';

    // ─── Clave de storage ────────────────────────────────────────────────────
    const STORAGE_KEY = 'wlm_ads_images';

    // ─── Estado interno ──────────────────────────────────────────────────────
    let isApplied = false;
    let currentImages = [];

    // ─── Cargar imágenes desde storage al iniciar ────────────────────────────
    function loadImages() {
        chrome.storage.local.get(STORAGE_KEY, (result) => {
            currentImages = result[STORAGE_KEY] || [];
        });
    }

    // ─── Aplicar imagen aleatoria al banner ──────────────────────────────────
    function applyBanner() {
        if (currentImages.length === 0) return;

        const target = document.querySelector(BANNER_SELECTOR);
        if (!target) return;

        const randomImage = currentImages[Math.floor(Math.random() * currentImages.length)];

        target.style.setProperty('background', `url(${randomImage}) no-repeat`, 'important');
        target.style.setProperty('background-size', '230px 60px', 'important');
        target.style.setProperty('background-position', 'center', 'important');
        target.style.setProperty('height', '60px', 'important');
        target.style.setProperty('width', '230px', 'important');

        isApplied = true;
    }

    // ─── Función pública: ejecutar en cada mutación del DOM ──────────────────
    function run() {
        const target = document.querySelector(BANNER_SELECTOR);

        if (target && !isApplied) {
            applyBanner();
        }

        if (!target) {
            isApplied = false;
        }
    }

    // ─── Escuchar cambios en storage (cuando el popup agrega/borra imágenes) ─
    chrome.storage.onChanged.addListener((changes, area) => {
        if (area === 'local' && changes[STORAGE_KEY]) {
            currentImages = changes[STORAGE_KEY].newValue || [];
            isApplied = false; // forzar re-aplicación con nueva lista
        }
    });

    return { run, loadImages };

})();