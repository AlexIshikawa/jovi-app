/**
 * Menu radial da câmera (Jovi)
 *
 * Gesto: segurar o botão central, arrastar na direção de um atalho
 * e soltar para ativá-lo. Um toque rápido no centro abre a câmera.
 *
 * Também funciona com mouse (hover + clique nos atalhos)
 * e com teclado (Tab até o botão ou atalho + Enter).
 */

// Distância mínima (px) do centro para considerar que houve arraste
const DRAG_THRESHOLD = 28;

// Tempo máximo (ms) para um pressionar ser considerado "toque rápido"
const TAP_MAX_MS = 300;

// Tempo (ms) que o aviso fica na tela
const TOAST_MS = 1500;

export function initCameraMenu() {
    const menu = document.querySelector('[data-camera-menu]');
    if (!menu) return;

    const trigger = menu.querySelector('[data-camera-trigger]');
    const shortcuts = [...menu.querySelectorAll('[data-shortcut]')];
    const toast = document.getElementById('toast');

    // { up: <button>, right: <button>, ... }
    const shortcutByDirection = Object.fromEntries(
        shortcuts.map((el) => [el.dataset.direction, el]),
    );

    let activePointerId = null;
    let origin = { x: 0, y: 0 };
    let pressStartedAt = 0;
    let selected = null;
    let toastTimer = null;

    /* ---------- Estado visual ---------- */

    function openMenu() {
        menu.dataset.open = '';
    }

    function closeMenu() {
        delete menu.dataset.open;
        select(null);
    }

    function select(shortcut) {
        if (shortcut === selected) return;

        selected?.removeAttribute('data-selected');
        selected = shortcut;

        if (selected) {
            selected.dataset.selected = '';
            navigator.vibrate?.(10); // vibração curta em celulares Android
        }
    }

    /* ---------- Cálculo da direção ---------- */

    function directionFrom(dx, dy) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return null;

        // O eixo com maior deslocamento define a direção
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        }
        return dy > 0 ? 'down' : 'up';
    }

    /* ---------- Ação ---------- */

    function activate(action, label) {
        // Evento personalizado: outras partes do projeto podem escutar
        // menu.addEventListener('camera:shortcut', (e) => e.detail.action)
        menu.dispatchEvent(
            new CustomEvent('camera:shortcut', { detail: { action }, bubbles: true }),
        );

        showToast(`Abrindo ${label}`);
    }

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.dataset.visible = '';

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            delete toast.dataset.visible;
        }, TOAST_MS);
    }

    /* ---------- Gesto: segurar, arrastar e soltar ---------- */

    trigger.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return; // só botão principal / dedo

        activePointerId = event.pointerId;

        // Continua recebendo pointermove mesmo quando o dedo sai do botão
        trigger.setPointerCapture(activePointerId);

        const rect = trigger.getBoundingClientRect();
        origin = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        pressStartedAt = performance.now();
        openMenu();
    });

    trigger.addEventListener('pointermove', (event) => {
        if (event.pointerId !== activePointerId) return;

        const direction = directionFrom(
            event.clientX - origin.x,
            event.clientY - origin.y,
        );

        select(direction ? shortcutByDirection[direction] : null);
    });

    trigger.addEventListener('pointerup', (event) => {
        if (event.pointerId !== activePointerId) return;

        const chosen = selected;
        const wasQuickTap = performance.now() - pressStartedAt < TAP_MAX_MS;

        endGesture();

        if (chosen) {
            activate(chosen.dataset.shortcut, chosen.dataset.label);
        } else if (wasQuickTap) {
            activate('camera', 'Câmera');
        }
        // Segurou e soltou no centro sem escolher: apenas fecha
    });

    // O sistema pode cancelar o gesto (ex.: notificação, troca de app)
    trigger.addEventListener('pointercancel', endGesture);

    function endGesture() {
        activePointerId = null;
        closeMenu();
    }

    /* ---------- Teclado e mouse ---------- */

    // Enter/Espaço no botão central disparam "click" com detail === 0.
    // Cliques de mouse/toque já foram tratados no pointerup.
    trigger.addEventListener('click', (event) => {
        if (event.detail === 0) activate('camera', 'Câmera');
    });

    shortcuts.forEach((shortcut) => {
        shortcut.addEventListener('click', () => {
            activate(shortcut.dataset.shortcut, shortcut.dataset.label);
        });
    });

    // Evita o menu de contexto do pressionar longo
    trigger.addEventListener('contextmenu', (event) => event.preventDefault());
}