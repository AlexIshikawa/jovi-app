/**
 * Controles rápidos da tela de bloqueio (barra superior)
 *
 * - Flash: botão [data-flash-toggle] que liga/desliga (aria-pressed) e avisa no #toast.
 * O seletor de modo usa a Popover API (HTML puro) e não precisa de JS.
 */

const TOAST_MS = 1500;

export function initQuickControls() {
    const flash = document.querySelector('[data-flash-toggle]');
    if (!flash) return; // página sem controles rápidos

    const toast = document.getElementById('toast');
    let toastTimer = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.dataset.visible = '';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => delete toast.dataset.visible, TOAST_MS);
    }

    flash.addEventListener('click', () => {
        const isOn = flash.getAttribute('aria-pressed') === 'true';
        flash.setAttribute('aria-pressed', String(!isOn));
        showToast(isOn ? 'Flash desligado' : 'Flash ligado');
    });
}