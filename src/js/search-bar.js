/**
 * Barra de busca da galeria
 *
 * A lupa do cabeçalho abre e fecha o campo de busca.
 * O "x" limpa o texto; Esc limpa e, se já estiver vazio, fecha.
 */

export function initSearchBar() {
    const toggle = document.querySelector('[data-search-toggle]');
    const panel = document.querySelector('[data-search-panel]');
    if (!toggle || !panel) return; // página sem busca: não faz nada

    const form = panel.querySelector('form');
    const input = panel.querySelector('[data-search-input]');
    const clearButton = panel.querySelector('[data-search-clear]');

    function isOpen() {
        return panel.hasAttribute('data-open');
    }

    function open() {
        panel.dataset.open = '';
        panel.inert = false; // volta a ser clicável e acessível pelo Tab
        toggle.setAttribute('aria-expanded', 'true');
        input.focus({ preventScroll: true }); // já abre pronto para digitar
    }

    function close() {
        const focusWasInside = panel.contains(document.activeElement);

        delete panel.dataset.open;
        panel.inert = true; // escondido: fora do Tab e dos leitores de tela
        toggle.setAttribute('aria-expanded', 'false');

        // Devolve o foco para a lupa, para o teclado não se perder
        if (focusWasInside) toggle.focus();
    }

    function clear() {
        input.value = '';
        // Avisa quem estiver escutando o campo (ex.: um filtro futuro)
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
    }

    toggle.addEventListener('click', () => {
        isOpen() ? close() : open();
    });

    clearButton.addEventListener('click', clear);

    input.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        event.preventDefault();
        input.value ? clear() : close();
    });

    // Ainda não há busca de verdade: evita recarregar a página no Enter
    // e dispara um evento com o termo, para ser usado depois
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        document.dispatchEvent(
            new CustomEvent('gallery:search', {
                detail: { query: input.value.trim() },
            }),
        );
    });
}