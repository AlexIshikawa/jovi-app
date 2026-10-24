/**
 * Telas do Ask Mode: IA Guia (viagens) e descrição do conteúdo (estudos)
 *
 * - ?album=ID&foto=ID   -> foto do travel-data.js, conteúdo do campo "guide"
 * - ?materia=ID&foto=ID -> anotação do study-data.js, conteúdo do campo "explanation"
 * Preenche a imagem, o título, o subtítulo e os parágrafos. Sem parâmetros, mostra o Cristo Redentor.
 *
 * No main.js, chame initTravelGuide() ANTES de initTypewriter(),
 * para a digitação encontrar os parágrafos já na página.
 */

import { getAlbum, findPhoto } from './travel-data.js';
import { detailHref } from './travel-gallery.js';
import { getSubject, getSubjectPhotos, findStudyItem } from './study-data.js';
import { studyHref } from './study-gallery.js';

// Escapa o texto e converte **negrito** em <strong>
function richText(text) {
    const escaped = text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
    return escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

// Descobre de onde vem o conteúdo (viagem ou estudo) e devolve tudo o que a tela precisa
function resolveContent(params) {
    const photoId = params.get('foto');

    // Estudos: ?materia=ID ou uma anotação encontrada só pelo id
    const studyFound = params.get('album') ? null : findStudyItem(photoId);
    if (params.get('materia') || (!params.get('album') && studyFound && !findPhoto(photoId))) {
        const subject = studyFound?.subject ?? getSubject(params.get('materia'));
        const item = getSubjectPhotos(subject).find((entry) => entry.id === photoId) ?? getSubjectPhotos(subject)[0];
        if (!item) return null;
        return {
            photo: item,
            subtitle: item.explanation?.subtitle ?? subject.title,
            paragraphs: item.explanation?.paragraphs ?? ['A JOVI ainda está analisando esta anotação. Volte em breve!'],
            saveHref: studyHref(subject.id, item),
        };
    }

    // Viagens: ?album=ID, ou a foto encontrada só pelo id
    const found = params.get('album') ? null : findPhoto(photoId);
    const album = found?.album ?? getAlbum(params.get('album'));
    const photo = found?.photo ?? album.photos.find((item) => item.id === photoId) ?? album.photos[0];
    if (!photo) return null;
    return {
        photo,
        subtitle: photo.guide?.place ?? photo.location ?? '',
        paragraphs: photo.guide?.paragraphs ?? ['A JOVI ainda está preparando o guia deste lugar. Volte em breve!'],
        saveHref: detailHref(album.id, photo.id),
    };
}

export function initTravelGuide() {
    const body = document.querySelector('[data-guide-body]');
    if (!body) return; // não é uma tela de Ask Mode

    const content = resolveContent(new URLSearchParams(window.location.search));
    if (!content) return;
    const { photo, subtitle, paragraphs, saveHref } = content;

    document.querySelectorAll('[data-guide-img]').forEach((img) => {
        img.src = photo.src;
        img.alt = photo.alt;
    });

    const title = document.querySelector('[data-guide-title]');
    if (title) title.textContent = photo.title;

    const place = document.querySelector('[data-guide-place]');
    if (place) place.textContent = subtitle;

    // Um parágrafo para cada item; data-type faz cada um ser "digitado"
    body.insertAdjacentHTML(
        'beforeend',
        paragraphs.map((text) => `<p class="card-paragraph" data-type>${richText(text)}</p>`).join(''),
    );

    // "Salvar" abre o detalhe desta foto/anotação
    document.querySelectorAll('[data-guide-save]').forEach((button) => {
        button.setAttribute('href', saveHref);
        // Componentes como <app-button> podem já ter criado um <a> interno
        button.querySelector('a')?.setAttribute('href', saveHref);
    });
}