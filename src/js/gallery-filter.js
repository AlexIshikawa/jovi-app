/**
 * Filtro da galeria
 *
 * Combina dois filtros sobre os itens com data-tags:
 *  - busca por texto (campo [data-search-input]): todas as palavras precisam estar nas tags;
 *  - tipo (radios name="tipo"): all | photo | video | favorite.
 *
 * Também atualiza a contagem de cada dia ([data-day] / [data-day-count])
 * e esconde os dias que ficam sem nenhum item visível.
 */

// Palavras que não ajudam a filtrar e são ignoradas na busca
const STOPWORDS = new Set([
    'a', 'o', 'as', 'os', 'e', 'em', 'com', 'um', 'uma',
    'de', 'da', 'do', 'das', 'dos', 'no', 'na', 'nos', 'nas',
    'foto', 'fotos', 'imagem', 'imagens', 'meu', 'meus', 'minha', 'minhas',
]);

// "Pôr do Sol" -> "por do sol"
function normalize(text) {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function toKeywords(query) {
    return normalize(query)
        .split(/\s+/)
        .filter((word) => word && !STOPWORDS.has(word));
}

function plural(total) {
    return total === 1 ? '1 item' : `${total} itens`;
}

export function initGalleryFilter() {
    const items = [...document.querySelectorAll('[data-tags]')];
    if (items.length === 0) return; // página sem itens filtráveis

    const input = document.querySelector('[data-search-input]');
    const typeRadios = [...document.querySelectorAll('input[name="tipo"]')];
    const days = [...document.querySelectorAll('[data-day]')];
    const countEl = document.querySelector('[data-results-count]');
    const emptyEl = document.querySelector('[data-results-empty]');

    // Normaliza as tags uma única vez, em vez de a cada tecla
    const searchable = items.map((item) => ({
        item,
        text: normalize(item.dataset.tags),
        kind: item.dataset.kind ?? 'photo',
        favorite: item.hasAttribute('data-favorite'),
    }));

    function matchesType({ kind, favorite }, type) {
        if (type === 'photo') return kind === 'photo';
        if (type === 'video') return kind === 'video';
        if (type === 'favorite') return favorite;
        return true; // "all"
    }

    function filter() {
        const keywords = toKeywords(input?.value ?? '');
        const type = typeRadios.find((radio) => radio.checked)?.value ?? 'all';
        let visible = 0;

        searchable.forEach((entry) => {
            const matches =
                matchesType(entry, type) &&
                keywords.every((word) => entry.text.includes(word));

            entry.item.hidden = !matches;
            if (matches) visible += 1;
        });

        // Cada dia mostra quantos itens sobraram; dias vazios somem
        days.forEach((day) => {
            const total = day.querySelectorAll('[data-tags]:not([hidden])').length;
            day.hidden = total === 0;

            const dayCount = day.querySelector('[data-day-count]');
            if (dayCount) dayCount.textContent = plural(total);
        });

        if (countEl) {
            countEl.textContent = visible === 0 ? 'Nenhum item encontrado' : `${plural(visible)} encontrados`;
        }
        if (emptyEl) emptyEl.hidden = visible > 0;
    }

    // "input": cada letra digitada, apagada ou colada (e o "x" de limpar)
    input?.addEventListener('input', filter);
    // "change": troca de filtro (Todas, Fotos, Vídeos, Favoritas)
    typeRadios.forEach((radio) => radio.addEventListener('change', filter));

    filter(); // contagens iniciais corretas
}