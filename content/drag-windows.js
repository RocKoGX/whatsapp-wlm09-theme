const DragWindow = (() => {

    let isDragging = false;
    let startX = 0;
    let startY = 0;

    let currentX = 0;
    let currentY = 0;

    let initialX = 0;
    let initialY = 0;

    let zIndexCounter = 1000;

    const TITLEBAR_HEIGHT = 32;

    function init() {

        // 1ra ventana 
        const ventanaDraggable = document.querySelector(
            '.x9f619.x1n2onr6.xupqr0c.x5yr21d.x6ikm8r.x10wlt62.x17dzmu4.x1i1dayz.x2ipvbc.xjdofhw.xyyilfv.x1iyjqo2'
        );

        if (ventanaDraggable && !ventanaDraggable.dataset.dragInitialized) {
            makeDraggable(ventanaDraggable);
            injectWindowControls(ventanaDraggable);
            ventanaDraggable.dataset.dragInitialized = "true";
        }

        // 2da ventana  
        const ventanaSecundaria = document.querySelector(
            '._aigw._as6h.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.xjdofhw.x78zum5.xdt5ytf.x12xzxwr.x1plvlek.xryxfnj.x570efc.x18dvir5.xxljpkc.xwfak60.x18pi947'
        );

        if (ventanaSecundaria && !ventanaSecundaria.dataset.dragInitialized) {
            makeDraggable(ventanaSecundaria);
            injectWindowControls(ventanaSecundaria);
            ventanaSecundaria.dataset.dragInitialized = "true";
        }
    }

    function makeDraggable(ventana) {

        let isDragging = false;

        let startX = 0;
        let startY = 0;

        let currentX = 0;
        let currentY = 0;

        let initialX = 0;
        let initialY = 0;

        ventana.addEventListener('mousedown', (e) => {

            if (e.target.closest('.title-bar-controls')) return;

            // detectar la otra ventana
            const otraVentana = document.querySelector(
                ventana.classList.contains('_aigw')
                    ? '.x9f619.x1n2onr6.xupqr0c.x5yr21d.x6ikm8r.x10wlt62.x17dzmu4.x1i1dayz.x2ipvbc.xjdofhw.xyyilfv.x1iyjqo2'
                    : '._aigw._as6h.x9f619.x1n2onr6.x5yr21d.x17dzmu4.x1i1dayz.x2ipvbc.xjdofhw.x78zum5.xdt5ytf.x12xzxwr.x1plvlek.xryxfnj.x570efc.x18dvir5.xxljpkc.xwfak60.x18pi947'
            );

            if (otraVentana) {
                swapZIndex(ventana, otraVentana);
            }

            const rect = ventana.getBoundingClientRect();
            const clickY = e.clientY - rect.top;

            if (clickY > TITLEBAR_HEIGHT) return;

            isDragging = true;

            startX = e.clientX;
            startY = e.clientY;

            initialX = currentX;
            initialY = currentY;

            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            let dx = e.clientX - startX;
            let dy = e.clientY - startY;

            currentX = initialX + dx;
            currentY = initialY + dy;

            ventana.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    }

    function injectWindowControls(ventana) {

        if (!ventana) return;

        if (ventana.querySelector('.title-bar-controls')) return;

        const controls = document.createElement('div');
        controls.className = 'title-bar-controls';

        controls.innerHTML = `
            <button aria-label="Minimize"></button>
            <button aria-label="Maximize"></button>
            <button aria-label="Close"></button>
        `;

        ventana.appendChild(controls);
    }

    function swapZIndex(a, b) {
        a.style.zIndex = 199;
        b.style.zIndex = 100;
    }

    return { init };

})();