// content/main.js
// Punto de entrada y coordinador de módulos WLM

(() => {

    // ─── Inicialización única al cargar ──────────────────────────────────────
    function init() {
        // Estilos CSS dinámicos: se inyectan una sola vez
        IconReplacer.initStyles();

        // Cargar imágenes del banner desde storage
        AdBanner.loadImages();

        // Primera ejecución inmediata (antes del observer)
        IconReplacer.run();
        AdBanner.run();

        // Iniciar observer
        startObserver();
    }

    // ─── MutationObserver compartido ────────────────────────────────────────
    function startObserver() {
        const observer = new MutationObserver(() => {
            IconReplacer.run();
            AdBanner.run();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ─── Esperar a que el DOM esté listo ─────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();