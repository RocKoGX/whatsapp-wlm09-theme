// content/ad-banner.js
// Módulo de banner publicitario estilo WLM
// Lee imágenes desde assets/ads/ via ads-index.json
// Rota el banner aleatoriamente cada 20 segundos

const AdBanner = (() => {

    const BANNER_SELECTOR = '.x1c4vz4f.xs83m0k.xdl72j9.x1g77sc7.xozqiw3.x1oa3qoh.x12fk4p8.xeuugli.x2lwn1j.xl56j7k.x1q0g3np.x6s0dn4.x2kejxg.x3nfvp2';
    const ROTATION_MS     = 90_000; // 90 segundos

    let adUrls      = [];
    let isApplied   = false;
    let currentIdx  = -1;  // índice del banner actualmente mostrado
    let rotateTimer = null;

    // ─── Cargar índice de archivos ────────────────────────────
    function loadAds() {
        fetch(chrome.runtime.getURL('manifest-assets.json'))
            .then(r => r.json())
            .then(manifest => {
                const adsObj = manifest.ads || {};
                // Aplanar todas las subcarpetas en una lista de URLs
                adUrls = Object.entries(adsObj).flatMap(([cat, files]) =>
                    files.map(f => chrome.runtime.getURL(`assets/ads/${cat}/${f}`))
                );
                if (adUrls.length > 0) startRotation();
            })
            .catch(() => { adUrls = []; });
    }

    // ─── Elegir índice aleatorio distinto al actual ───────────
    function nextRandomIdx() {
        if (adUrls.length === 1) return 0;
        let idx;
        do { idx = Math.floor(Math.random() * adUrls.length); }
        while (idx === currentIdx); // evitar repetir el mismo banner dos veces seguidas
        return idx;
    }

    // ─── Aplicar banner al elemento del DOM ──────────────────
    function applyBanner(url) {
        const target = document.querySelector(BANNER_SELECTOR);
        if (!target) return false;

        target.style.setProperty('background',          `url(${url}) no-repeat`, 'important');
        target.style.setProperty('background-size',     '230px 60px',            'important');
        target.style.setProperty('background-position', 'center',                'important');
        target.style.setProperty('height',              '60px',                  'important');
        target.style.setProperty('width',               '230px',                 'important');

        return true;
    }

    // ─── Mostrar el siguiente banner ─────────────────────────
    function showNext() {
        if (!adUrls.length) return;
        currentIdx = nextRandomIdx();
        isApplied = applyBanner(adUrls[currentIdx]);
    }

    // ─── Iniciar rotación automática ─────────────────────────
    function startRotation() {
        // Mostrar el primero inmediatamente
        showNext();

        // Luego rotar cada ROTATION_MS
        if (rotateTimer) clearInterval(rotateTimer);
        rotateTimer = setInterval(() => {
            const target = document.querySelector(BANNER_SELECTOR);
            if (target) showNext();
        }, ROTATION_MS);
    }

    // ─── Ejecutar en cada mutación del DOM ───────────────────
    // Si el elemento desapareció y vuelve a aparecer, reaplicar sin
    // esperar al próximo tick del timer
    function run() {
        const target = document.querySelector(BANNER_SELECTOR);

        if (target && !isApplied) {
            if (currentIdx >= 0 && adUrls.length > 0) {
                isApplied = applyBanner(adUrls[currentIdx]);
            }
        }

        if (!target) {
            isApplied = false;
        }
    }

    return { run, loadAds };

})();
