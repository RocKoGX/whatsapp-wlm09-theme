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

            const { x, y } = getTranslateValues(ventana.style.transform);

            currentX = x;
            currentY = y;

            initialX = currentX;
            initialY = currentY;

            isDragging = true;

            startX = e.clientX;
            startY = e.clientY;

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

            ventana.dataset.prevTransform = ventana.style.transform || '';
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

        const [minBtn, maxBtn, closeBtn] = controls.querySelectorAll('button');

        // =========================
        // MAXIMIZE
        // =========================
        maxBtn.addEventListener('click', () => {

            const isMaximized = ventana.dataset.maximized === "true";

            if (!isMaximized) {

                if (!ventana.dataset.prevTransform) {
                    ventana.dataset.prevTransform = ventana.style.transform || '';
                }

                // MAXIMIZAR
                ventana.style.transform = 'translate(0px, 0px)';
                ventana.style.marginLeft = "0%";
                ventana.style.marginRight = "0%";
                ventana.style.marginTop = "0%";
                ventana.style.height = "100%";

                ventana.dataset.maximized = "true";

            } else {

                // RESTAURAR
                ventana.style.transform = ventana.dataset.prevTransform || '';

                if (ventana.classList.contains('_aigw')) {
                    ventana.style.marginLeft = "0.2%";
                    ventana.style.marginTop = "0%";
                    ventana.style.height = "96%";
                } else {
                    ventana.style.marginLeft = "2.5%";
                    ventana.style.marginRight = "2.5%";
                    ventana.style.marginTop = "0%";
                    ventana.style.height = "85%";
                }

                ventana.dataset.maximized = "false";
            }
        });

    }

    function getTranslateValues(transform) {
        if (!transform || transform === 'none') return { x: 0, y: 0 };

        const match = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (!match) return { x: 0, y: 0 };

        return {
            x: parseFloat(match[1]),
            y: parseFloat(match[2])
        };
    }

    function swapZIndex(a, b) {
        a.style.zIndex = 199;
        b.style.zIndex = 100;
    }

    return { init };

})();