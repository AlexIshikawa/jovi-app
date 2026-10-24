
import { PHOTOS } from './photos.js';
import { SELFIE_PHOTOS } from './selfie-photo.js';
import { getAlbum, findPhoto } from './travel-data.js';
import { getSubject, getSubjectPhotos, findStudyItem } from './study-data.js';

// Telas do Ask Mode: guia de viagem e descrição do conteúdo dos estudos
const GUIDE_PATH = '/modo-viagem/ia-guia/index.html';
const STUDY_ASK_PATH = '/ask/index.html';

// Conjuntos de fotos disponíveis: a página escolhe com data-photo-set no <body>
const PHOTO_SETS = {
    viagens: PHOTOS,
    estudos: getSubjectPhotos(getSubject('matematica')),
    selfies: SELFIE_PHOTOS,
};

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

function renderPhoto(photos, index) {
    const photo = photos[index];
    const date = new Date(photo.datetime);
    const nextPhoto = photos[(index + 1) % photos.length]; // depois da última, volta à primeira

    document.title = photo.title;

    // Imagens (página e tela cheia)
    document.querySelectorAll('[data-photo-img]').forEach((img) => {
        img.src = photo.src;
        img.alt = photo.alt;
    });

    // Miniaturas dos estilos: a mesma foto, cada uma com o seu filtro
    document.querySelectorAll('[data-photo-thumb]').forEach((img) => {
        img.src = photo.src;
    });

    // Textos
    setText('[data-photo-title]', photo.title);
    setText('[data-photo-location]', photo.location);
    setText('[data-photo-counter]', `${index + 1} / ${photos.length}`);
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
        // Mantém os outros parâmetros do endereço (ex.: ?album=...) e troca só a foto
        const nextParams = new URLSearchParams(window.location.search);
        nextParams.set('foto', nextPhoto.id);
        next.href = `?${nextParams}`;
        next.setAttribute('aria-label', `Próxima foto: ${nextPhoto.title}`);
    }

    // Ask Mode: estudos abrem a "descrição do conteúdo"; viagens abrem o IA Guia.
    // Funciona mesmo sem ?materia= ou ?album= no endereço: o item é procurado nos dados.
    const askLink = document.querySelector('[data-photo-ask-link]');
    if (askLink) {
        const params = new URLSearchParams(window.location.search);
        const isStudy = params.has('materia') || document.body.dataset.photoSet === 'estudos';
        const subjectId = params.get('materia') ?? findStudyItem(photo.id)?.subject.id;
        const albumId = params.get('album') ?? findPhoto(photo.id)?.album.id;

        if (photo.askHref) {
            askLink.href = photo.askHref; // endereço próprio definido nos dados
        } else if (isStudy && subjectId) {
            askLink.href = `${STUDY_ASK_PATH}?materia=${subjectId}&foto=${photo.id}`;
        } else if (albumId) {
            askLink.href = `${GUIDE_PATH}?album=${albumId}&foto=${photo.id}`;
        }
    }

    // Texto da anotação: sem texto, o card de "Extrair texto" some
    setText('[data-photo-text]', photo.text ?? '');
    document.querySelectorAll('[data-extract-card]').forEach((card) => {
        card.hidden = !photo.text;
    });

    // Favorito inicial
    document
        .querySelector('[data-favorite-toggle]')
        ?.setAttribute('aria-pressed', String(Boolean(photo.favorite)));
}

export function initPhotoDetail() {
    const viewer = document.querySelector('[data-viewer]');
    if (!viewer) return; // página sem detalhe de foto

    /* ---------- Qual foto mostrar ---------- */

    // ?album=ID: fotos do álbum; ?materia=ID: anotações da matéria; senão, a lista do <body>
    const params = new URLSearchParams(window.location.search);
    const albumId = params.get('album');
    const subjectId = params.get('materia');

    let photos;
    if (albumId) photos = getAlbum(albumId).photos;
    else if (subjectId) photos = getSubjectPhotos(getSubject(subjectId));
    else photos = PHOTO_SETS[document.body.dataset.photoSet] ?? PHOTOS;
    if (photos.length === 0) return; // álbum sem fotos cadastradas

    // ?foto=cristo -> "cristo"; sem parâmetro ou id desconhecido, mostra a primeira
    const id = new URLSearchParams(window.location.search).get('foto');
    const index = Math.max(0, photos.findIndex((photo) => photo.id === id));
    renderPhoto(photos, index);

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

    /* ---------- Extrair texto ---------- */

    const textSheet = document.querySelector('[data-text-sheet]');

    document.querySelectorAll('[data-extract-open]').forEach((button) => {
        button.addEventListener('click', () => textSheet?.showModal());
    });

    // Toque no fundo escuro fecha o painel
    textSheet?.addEventListener('click', (event) => {
        if (event.target === textSheet) textSheet.close();
    });

    document.querySelectorAll('[data-copy-text]').forEach((button) => {
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(photos[index].text ?? '');
                showToast('Texto copiado');
            } catch {
                showToast('Não foi possível copiar o texto');
            }
        });
    });

    /* ---------- Salvar em (simulação) ---------- */

    document.querySelectorAll('[data-save-to]').forEach((button) => {
        button.addEventListener('click', () => showToast(`Salvo em ${button.dataset.saveTo}`));
    });

    /* ---------- Estilos da foto ---------- */

    // Cada estilo define o próprio filtro em --filter no <label>; o escolhido vai para
    // --photo-filter no <body>, que a foto principal e a tela cheia usam
    document.querySelectorAll('input[name="photo-filter"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            const filter = getComputedStyle(radio.closest('label')).getPropertyValue('--filter').trim();
            document.body.style.setProperty('--photo-filter', filter || 'none');
        });
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