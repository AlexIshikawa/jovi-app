/**
 * Galeria de viagens gerada a partir do travel-data.js
 *
 * - Lista de álbuns:  <ul data-travel-albums>   (+ [data-travel-summary])
 * - Página do álbum:  <section data-travel-album> lê ?album=ID do endereço
 *
 * No main.js, chame initTravelGallery() ANTES de initGalleryFilter().
 */

import { TRAVEL_ALBUMS, getAlbum, getAlbumTotals } from './travel-data.js';
import { renderDays, formatPeriod } from './album-grid.js';

// Endereços das telas (ajuste aqui se mudar as pastas)
export const TRAVEL_PATHS = {
    album: '/memorias/galeria/index.html',
    detail: '/memorias/galeria/photo-detail/',
    guide: '/modo-viagem/ia-guia/index.html',
};

// Ícones dos álbuns (o "icon" do travel-data.js escolhe um destes)
const ICONS = {
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.5" />',
    leaf: '<path d="M12 3l1.6 3.6L17 5.2l-.8 4.1 3.8.9-2.8 2.9 1.2 3.4-4.1-.9-.8 3.3h-3.2l-.8-3.3-4.1.9 1.2-3.4L4 10.2l3.8-.9L7 5.2l3.4 1.4z" /><path d="M12 15v6" />',
    pine: '<path d="M12 3L7 10h3l-4 6h12l-4-6h3z" /><path d="M12 16v5" />',
    torii: '<path d="M3 5.5c6 1.3 12 1.3 18 0" /><path d="M5 9.5h14" /><path d="M7 6.5V21M17 6.5V21" /><path d="M12 7v2.5" />',
    columns: '<path d="M3 9l9-5.5L21 9" /><path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" /><path d="M3 21h18M4 18h16" />',
    palm: '<path d="M13 21c0-5-.8-8.5-2-11.5" /><path d="M11 9.5C9 6.5 6 5.5 3 6.5c3 .8 5 2 6.3 4" /><path d="M11 9.5c1-3.2 4-5 8-4.3-3 .8-5 2.6-6 4.8" /><path d="M11 9.5c-2.4-.6-4.6.6-5.6 2.8" /><path d="M11 9.5c2.4-.6 4.6.6 5.6 2.8" />',
};

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// "142 fotos • 12 vídeos" (omite os vídeos quando não há)
function totalsText({ photos, videos }) {
    const parts = [plural(photos, 'foto', 'fotos')];
    if (videos > 0) parts.push(plural(videos, 'vídeo', 'vídeos'));
    return parts.join(' • ');
}

// Link de detalhe de uma foto de um álbum
export function detailHref(albumId, photoId) {
    return `${TRAVEL_PATHS.detail}?album=${albumId}&foto=${photoId}`;
}

/* ---------- Lista de álbuns ---------- */

function albumCard(album) {
    return `
    <li class="relative">
      <a href="${TRAVEL_PATHS.album}?album=${album.id}" data-album="${album.id}"
        class="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [-webkit-tap-highlight-color:transparent]">
        <img src="${album.cover}" alt="" loading="lazy" decoding="async"
          class="absolute inset-0 size-full object-cover transition-transform duration-300 group-active:scale-[1.03]" />
        <span aria-hidden="true" class="absolute inset-0 bg-linear-to-t from-black/80 via-black/15 to-transparent"></span>
        <span class="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2 pr-8">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-black/35 ring-1 ring-white/15 backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              stroke-linejoin="round" class="size-4" aria-hidden="true">${ICONS[album.icon] ?? ICONS.pin}</svg>
          </span>
          <span class="flex min-w-0 flex-col">
            <span class="text-[13px] font-semibold leading-tight">${album.title}</span>
            <span class="text-[10px] leading-snug text-white/70">${totalsText(getAlbumTotals(album))}</span>
          </span>
        </span>
      </a>
      <button type="button" aria-label="Opções do álbum ${album.title}"
        class="absolute bottom-3 right-1.5 flex size-7 items-center justify-center rounded-full text-white/85 transition-colors active:bg-white/15 focus-visible:outline-2 focus-visible:outline-white cursor-pointer [-webkit-tap-highlight-color:transparent]">
        <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
          <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>
    </li>`;
}

function initAlbumList() {
    const list = document.querySelector('[data-travel-albums]');
    if (!list) return;

    list.innerHTML = TRAVEL_ALBUMS.map(albumCard).join('');

    // Resumo: soma de todos os álbuns
    const sum = TRAVEL_ALBUMS.map(getAlbumTotals).reduce(
        (total, item) => ({ photos: total.photos + item.photos, videos: total.videos + item.videos }),
        { photos: 0, videos: 0 },
    );
    const summary = document.querySelector('[data-travel-summary]');
    if (summary) {
        summary.textContent = `${plural(TRAVEL_ALBUMS.length, 'álbum', 'álbuns')} • ${totalsText(sum)}`;
    }
}

/* ---------- Página do álbum ---------- */

function initAlbumPage() {
    const grid = document.querySelector('[data-travel-album]');
    if (!grid) return;

    const album = getAlbum(new URLSearchParams(window.location.search).get('album'));

    document.title = album.title;
    document.querySelectorAll('[data-album-title]').forEach((el) => { el.textContent = album.title; });
    document.querySelectorAll('[data-album-cover]').forEach((img) => { img.src = album.cover; });

    const sorted = renderDays(grid, album.photos, (photo) => detailHref(album.id, photo.id));

    const count = document.querySelector('[data-album-count]');
    if (count) count.textContent = totalsText(getAlbumTotals(album));

    const dates = document.querySelector('[data-album-dates]');
    if (dates) dates.textContent = formatPeriod(sorted);

    // Álbum ainda sem fotos cadastradas: mostra a mensagem própria
    const empty = document.querySelector('[data-album-empty]');
    if (empty) empty.hidden = album.photos.length > 0;
}

export function initTravelGallery() {
    initAlbumList();
    initAlbumPage();
}