/**
 * Grade do álbum gerada a partir dos dados
 *
 * <section data-album-grid data-photo-set="selfies" data-detail-path="photo-detail/">
 * - lê a lista de fotos do conjunto (mesmos arquivos usados pelo photo-detail);
 * - agrupa por dia, do mais recente para o mais antigo, e monta o mosaico;
 * - preenche a capa ([data-album-cover]), a contagem ([data-album-count])
 *   e o período ([data-album-dates]).
 *
 * Importante: chame initAlbumGrid() ANTES de initGalleryFilter() no main.js,
 * para o filtro encontrar as fotos já desenhadas.
 */

import { PHOTOS } from './photos.js';
import { STUDY_PHOTOS } from './study-photos.js';
import { SELFIE_PHOTOS } from './selfie-photo.js';

const PHOTO_SETS = {
    viagens: PHOTOS,
    estudos: STUDY_PHOTOS,
    selfies: SELFIE_PHOTOS,
};

// Formato da grade: a posição de cada foto no dia define o tamanho dela (repete a cada 6)
const MOSAIC = ['col-span-2 row-span-2', '', '', 'col-span-3', 'col-span-2 row-span-2', 'row-span-2'];

// "18 de ago. de 2024" -> "18 de ago de 2024"
const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
const formatDay = (date) => dayFormatter.format(date).replace('.', '');

const HEART = '<path d="M12 20s-7-4.4-8.8-8.6C1.9 8.3 3.7 5 7 4.7c2-.2 3.8.9 5 2.6 1.2-1.7 3-2.8 5-2.6 3.3.3 5.1 3.6 3.8 6.7C19 15.6 12 20 12 20z" />';
const DOTS = '<circle cx="5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="19" cy="12" r="1.6" />';
const CHEVRON = '<path d="M6 9l6 6 6-6" />';
const SMALL_BUTTON =
    'absolute bottom-2 flex size-7 items-center justify-center rounded-full bg-black/45 ring-1 ring-white/10 backdrop-blur-sm cursor-pointer active:scale-90 transition-transform';

function tile(photo, span, detailPath) {
    // Tags para a busca: título, descrição e local (a busca normaliza acentos sozinha)
    const tags = photo.tags ?? `${photo.title} ${photo.alt} ${photo.location ?? ''}`;
    const favorite = Boolean(photo.favorite);

    return `
    <li data-tags="${tags}" data-kind="${photo.kind ?? 'photo'}"${favorite ? ' data-favorite' : ''} class="relative ${span}">
      <a href="${detailPath}?foto=${photo.id}" data-photo="${photo.id}" aria-label="Abrir ${photo.title}"
        class="group block size-full overflow-hidden rounded-2xl bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]">
        <img src="${photo.src}" alt="" loading="lazy" decoding="async"
          class="size-full object-cover transition-transform duration-300 group-active:scale-[1.03]" />
      </a>
      <button type="button" aria-label="Favoritar ${photo.title}" aria-pressed="${favorite}"
        class="group/fav left-2 ${SMALL_BUTTON}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="size-3.5 group-aria-pressed/fav:fill-current group-aria-pressed/fav:text-pink-400" aria-hidden="true">${HEART}</svg>
      </button>
      <button type="button" aria-label="Mais opções de ${photo.title}" class="right-2 ${SMALL_BUTTON}">
        <svg viewBox="0 0 24 24" fill="currentColor" class="size-3.5" aria-hidden="true">${DOTS}</svg>
      </button>
    </li>`;
}

function day(label, photos, detailPath) {
    // Um dia com uma foto só: ela ocupa a largura toda
    const tiles = photos
        .map((photo, i) => tile(photo, photos.length === 1 ? 'col-span-3 row-span-2' : MOSAIC[i % MOSAIC.length], detailPath))
        .join('');

    return `
    <details open data-day class="group/day">
      <summary class="mb-3 flex cursor-pointer list-none items-center justify-between rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
        <h2 class="text-lg font-semibold">${label}</h2>
        <span class="flex items-center gap-1.5 text-sm text-white/60">
          <span data-day-count></span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="size-4 -rotate-90 transition-transform duration-200 group-open/day:rotate-0" aria-hidden="true">${CHEVRON}</svg>
        </span>
      </summary>
      <ul class="grid grid-flow-dense grid-cols-3 auto-rows-[7.5rem] gap-1.5">${tiles}
      </ul>
    </details>`;
}

export function initAlbumGrid() {
    const grid = document.querySelector('[data-album-grid]');
    if (!grid) return; // página sem grade gerada

    const photos = PHOTO_SETS[grid.dataset.photoSet] ?? [];
    const detailPath = grid.dataset.detailPath ?? 'photo-detail/';
    if (photos.length === 0) return;

    // Mais recentes primeiro
    const sorted = [...photos].sort((a, b) => b.datetime.localeCompare(a.datetime));

    // Agrupa por dia: "2024-08-18T18:24" -> chave "2024-08-18"
    const byDay = new Map();
    sorted.forEach((photo) => {
        const key = photo.datetime.slice(0, 10);
        if (!byDay.has(key)) byDay.set(key, []);
        byDay.get(key).push(photo);
    });

    const html = [...byDay.values()]
        .map((dayPhotos) => day(formatDay(new Date(dayPhotos[0].datetime)), dayPhotos, detailPath))
        .join('');

    // Insere antes da mensagem de "nada encontrado", que já está no HTML
    grid.insertAdjacentHTML('afterbegin', html);

    /* ---------- Capa e resumo ---------- */

    const cover = document.querySelector('[data-album-cover]');
    if (cover) cover.src = (sorted.find((photo) => photo.favorite) ?? sorted[0]).src;

    const count = document.querySelector('[data-album-count]');
    if (count) count.textContent = sorted.length === 1 ? '1 foto' : `${sorted.length} fotos`;

    const dates = document.querySelector('[data-album-dates]');
    if (dates) {
        const newest = new Date(sorted[0].datetime);
        const oldest = new Date(sorted.at(-1).datetime);

        // formatRange junta o que se repete: "16 – 18 de ago. de 2024" -> "16 a 18 de ago de 2024"
        dates.textContent = dayFormatter
            .formatRange(oldest, newest)
            .replace(/\s*–\s*/, ' a ')
            .replaceAll('.', '');
    }
}