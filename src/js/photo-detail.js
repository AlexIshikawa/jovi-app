/**
 * Detalhe da foto (uma página para todas as fotos)
 *
 * Lê o id da foto no endereço (/foto/?foto=cristo), busca os dados em photos.js
 * e preenche a página. Também cuida de:
 * - tela cheia num <dialog> ([data-viewer-open] / [data-viewer-close]);
 * - favoritar ([data-favorite-toggle]);
 * - compartilhar ([data-share="native" | "copy" | "whatsapp" | "facebook" | "instagram" | "tiktok"]).
 */

import { PHOTOS } from './photos.js';

const TOAST_MS = 1800;

// "18 de agosto de 2024" e "18:24", no padrão brasileiro
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
});

// Atalho para preencher o texto de um elemento, se ele existir
function setText(selector, text) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
}

function renderPhoto(photo, index) {
    const date = new Date(photo.datetime);
    const nextPhoto = PHOTOS[(index + 1) % PHOTOS.length]; // depois da última, volta à primeira

    document.title = photo.title;

    // Imagens (página e tela cheia)
    document.querySelectorAll('[data-photo-img]').forEach((img) => {
        img.src = photo.src;
        img.alt = photo.alt;
    });

    // Textos
    setText('[data-photo-title]', photo.title);
    setText('[data-photo-location]', photo.location);
    setText('[data-photo-counter]', `${index + 1} / ${PHOTOS.length}`);
    setText('[data-photo-ask]', photo.ask);

    const time = document.querySelector('[data-photo-date]');
    if (time) {
        time.dateTime = photo.datetime;
        time.textContent = `${dateFormatter.format(date)} • ${timeFormatter.format(date)}`;
    }

    // Dados da câmera: cada <dd data-spec="model"> recebe photo.camera.model, etc.
    document.querySelectorAll('[data-spec]').forEach((element) => {
        element.textContent = photo.camera[element.dataset.spec] ?? '—';
    });

    // Selo de vídeo
    document.querySelectorAll('[data-video-badge]').forEach((badge) => {
        badge.hidden = photo.kind !== 'video';
    });

    // Próxima foto e link do Ask Mode
    const next = document.querySelector('[data-photo-next]');
    if (next) {
        next.href = `?foto=${nextPhoto.id}`;
        next.setAttribute('aria-label', `Próxima foto: ${nextPhoto.title}`);
    }

    const askLink = document.querySelector('[data-photo-ask-link]');
    if (askLink && photo.askHref) askLink.href = photo.askHref;

    // Favorito inicial
    document
        .querySelector('[data-favorite-toggle]')
        ?.setAttribute('aria-pressed', String(Boolean(photo.favorite)));
}

export function initPhotoDetail() {
    const viewer = document.querySelector('[data-viewer]');
    if (!viewer) return; // página sem detalhe de foto

    /* ---------- Qual foto mostrar ---------- */

    // ?foto=cristo -> "cristo"; sem parâmetro ou id desconhecido, mostra a primeira
    const id = new URLSearchParams(window.location.search).get('foto');
    const index = Math.max(0, PHOTOS.findIndex((photo) => photo.id === id));
    renderPhoto(PHOTOS[index], index);

    const toast = document.getElementById('toast');
    let toastTimer = null;

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.dataset.visible = '';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => delete toast.dataset.visible, TOAST_MS);
    }

    /* ---------- Tela cheia ---------- */

    document.querySelectorAll('[data-viewer-open]').forEach((button) => {
        // showModal(): fica por cima de tudo, prende o foco e fecha com Esc
        button.addEventListener('click', () => viewer.showModal());
    });

    viewer.querySelectorAll('[data-viewer-close]').forEach((button) => {
        button.addEventListener('click', () => viewer.close());
    });

    /* ---------- Favoritar ---------- */

    document.querySelectorAll('[data-favorite-toggle]').forEach((button) => {
        button.addEventListener('click', () => {
            const isFavorite = button.getAttribute('aria-pressed') === 'true';
            button.setAttribute('aria-pressed', String(!isFavorite));
            showToast(isFavorite ? 'Removida das favoritas' : 'Adicionada às favoritas');
        });
    });

    /* ---------- Compartilhar ---------- */

    const shareData = {
        title: document.title,
        text: 'Olha essa foto que tirei com a JOVI!',
        url: window.location.href,
    };

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(shareData.url);
            showToast('Link copiado');
        } catch {
            showToast('Não foi possível copiar o link');
        }
    }

    // Menu de compartilhamento do próprio celular; sem suporte, copia o link
    async function nativeShare() {
        if (!navigator.share) return copyLink();
        try {
            await navigator.share(shareData);
        } catch {
            // A pessoa fechou o menu: não é um erro
        }
    }

    const encoded = encodeURIComponent(shareData.url);
    const encodedText = encodeURIComponent(`${shareData.text} ${shareData.url}`);

    const SHARE_ACTIONS = {
        native: nativeShare,
        copy: copyLink,
        whatsapp: () => window.open(`https://wa.me/?text=${encodedText}`, '_blank', 'noopener'),
        facebook: () =>
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encoded}`, '_blank', 'noopener'),
        // Instagram e TikTok não têm link de compartilhamento na web: usa o menu do celular
        instagram: nativeShare,
        tiktok: nativeShare,
    };

    document.querySelectorAll('[data-share]').forEach((button) => {
        button.addEventListener('click', () => SHARE_ACTIONS[button.dataset.share]?.());
    });
}