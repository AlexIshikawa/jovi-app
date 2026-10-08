/**
 * Filtro da galeria
 *
 * Escuta o campo de busca e mostra só as fotos cujas tags
 * (atributo data-tags) contêm todas as palavras digitadas.
 * Ignora acentos, maiúsculas e palavras genéricas ("foto", "da", "no"...).
 */

// Palavras que não ajudam a filtrar e seriam ignoradas na busca
const STOPWORDS = new Set([
    'a', 'o', 'as', 'os', 'e', 'em', 'com', 'um', 'uma',
    'de', 'da', 'do', 'das', 'dos', 'no', 'na', 'nos', 'nas',
    'foto', 'fotos', 'imagem', 'imagens', 'meu', 'meus', 'minha', 'minhas',
]);

// "Pôr do Sol" -> "por do sol"
function normalize(text) {
    return text
        .normalize('NFD')                 // separa letras e acentos: "ô" -> "o" + "^"
        .replace(/[\u0300-\u036f]/g, '')  // remove os acentos
        .toLowerCase()
        .trim();
}

function toKeywords(query) {
    return normalize(query)
        .split(/\s+/)
        .filter((word) => word && !STOPWORDS.has(word));
}

export function initGalleryFilter() {
    const input = document.querySelector('[data-search-input]');
    const items = [...document.querySelectorAll('[data-tags]')];
    if (!input || items.length === 0) return; // página sem filtro

    const countEl = document.querySelector('[data-results-count]');
    const emptyEl = document.querySelector('[data-results-empty]');

    // Normaliza as tags uma única vez, em vez de a cada tecla
    const searchable = items.map((item) => ({
        item,
        text: normalize(item.dataset.tags),
    }));

    function updateCount(total) {
        if (!countEl) return;

        if (total === 0) countEl.textContent = 'Nenhum item encontrado';
        else if (total === 1) countEl.textContent = '1 item encontrado';
        else countEl.textContent = `${total} itens encontrados`;
    }

    function filter() {
        const keywords = toKeywords(input.value);
        let visible = 0;

        searchable.forEach(({ item, text }) => {
            // Sem palavras-chave, mostra tudo; com elas, todas precisam aparecer
            const matches = keywords.every((word) => text.includes(word));
            item.hidden = !matches;
            if (matches) visible += 1;
        });

        updateCount(visible);
        if (emptyEl) emptyEl.hidden = visible > 0;
    }

    // "input" dispara a cada letra digitada, apagada ou colada,
    // e também quando o "x" limpa o campo
    input.addEventListener('input', filter);
}