/**
 * Estudos gerados a partir do study-data.js
 *
 * - Lista de matérias:  <ul data-study-subjects>      (+ [data-study-summary])
 * - Página da matéria:  <section data-study-subject>   lê ?materia=ID do endereço
 *
 * No main.js, chame initStudyGallery() ANTES de initGalleryFilter().
 */

import { STUDY_SUBJECTS, getSubject, getSubjectTotals } from './study-data.js';
import { renderDays, formatDayLabel } from './album-grid.js';

// Endereços das telas (ajuste aqui se mudar as pastas)
export const STUDY_PATHS = {
    subject: '/memorias/galeria/estudos/materia/index.html',
    detail: '/memorias/galeria/estudos/photo-detail/',
};

// Ícones das matérias (o "icon" do study-data.js escolhe um destes)
const ICONS = {
    math: '<path d="M18 4H6l6 8-6 8h12" />',
    atom: '<circle cx="12" cy="12" r="1.5" /><ellipse cx="12" cy="12" rx="9" ry="3.8" /><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />',
    flask: '<path d="M9 3h6M10 3v6l-5.5 9.5A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-2.5L14 9V3" /><path d="M7.5 15h9" />',
    dna: '<path d="M7 3c0 6 10 6 10 12 0 3-2.5 4.5-5 6M17 3c0 6-10 6-10 12 0 3 2.5 4.5 5 6" /><path d="M8.5 7h7M8.5 17h7" />',
    landmark: '<path d="M3 9l9-5.5L21 9" /><path d="M5 9v9M9.5 9v9M14.5 9v9M19 9v9" /><path d="M3 21h18M4 18h16" />',
    book: '<path d="M3 5.5A1.5 1.5 0 0 1 4.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4.5A1.5 1.5 0 0 1 3 16.5z" /><path d="M21 5.5A1.5 1.5 0 0 0 19.5 4H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h5.5a1.5 1.5 0 0 0 1.5-1.5z" />',
};

const icon = (name, cls, width = '1.8') =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${ICONS[name] ?? ICONS.book}</svg>`;

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const totalsText = ({ documents, summaries }) =>
    `${plural(documents, 'documento', 'documentos')} • ${plural(summaries, 'resumo', 'resumos')}`;

// A cor da matéria vira a variável --accent; as classes usam var(--accent)
const accentStyle = (subject) => `--accent: var(--color-${subject.color})`;

// Link de um item: anotações abrem o detalhe; resumos abrem a anotação relacionada
export function studyHref(subjectId, item) {
    const photoId = item.kind === 'summary' ? item.relatedPhoto : item.id;
    return photoId ? `${STUDY_PATHS.detail}?materia=${subjectId}&foto=${photoId}` : '#';
}

/* ---------- Lista de matérias ---------- */

function subjectCard(subject) {
    return `
    <li class="relative">
      <a href="${STUDY_PATHS.subject}?materia=${subject.id}" data-subject="${subject.id}" style="${accentStyle(subject)}"
        class="group relative block aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-(--accent)/30 via-(--accent)/[0.08] to-white/[0.02] transition-[border-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:border-(--accent)/60 [-webkit-tap-highlight-color:transparent]">
        <span aria-hidden="true" class="absolute -right-5 top-3 text-(--accent)/25 transition-transform duration-300 -rotate-12 group-active:scale-105">
          ${icon(subject.icon, 'size-32', '1.4')}
        </span>
        <span class="absolute inset-x-0 bottom-0 flex items-center gap-1.5 p-2 pr-8">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-lg bg-(--accent)/20 text-(--accent) ring-1 ring-(--accent)/30">
            ${icon(subject.icon, 'size-4')}
          </span>
          <span class="flex min-w-0 flex-col">
            <span class="text-[13px] font-semibold leading-tight">${subject.title}</span>
            <span class="text-[10px] leading-snug text-white/70">${totalsText(getSubjectTotals(subject))}</span>
          </span>
        </span>
      </a>
      <button type="button" aria-label="Opções da matéria ${subject.title}"
        class="absolute bottom-3 right-1.5 flex size-7 items-center justify-center rounded-full text-white/85 transition-colors active:bg-white/15 focus-visible:outline-2 focus-visible:outline-white cursor-pointer [-webkit-tap-highlight-color:transparent]">
        <svg viewBox="0 0 24 24" fill="currentColor" class="size-4" aria-hidden="true">
          <circle cx="12" cy="5" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="12" cy="19" r="1.6" />
        </svg>
      </button>
    </li>`;
}

function initSubjectList() {
    const list = document.querySelector('[data-study-subjects]');
    if (!list) return;

    list.innerHTML = STUDY_SUBJECTS.map(subjectCard).join('');

    const sum = STUDY_SUBJECTS.map(getSubjectTotals).reduce(
        (total, item) => ({ documents: total.documents + item.documents, summaries: total.summaries + item.summaries }),
        { documents: 0, summaries: 0 },
    );
    const summary = document.querySelector('[data-study-summary]');
    if (summary) {
        summary.textContent = `${plural(STUDY_SUBJECTS.length, 'matéria', 'matérias')} • ${totalsText(sum)}`;
    }
}

/* ---------- Página da matéria ---------- */

function initSubjectPage() {
    const grid = document.querySelector('[data-study-subject]');
    if (!grid) return;

    const subject = getSubject(new URLSearchParams(window.location.search).get('materia'));

    document.title = subject.title;
    document.querySelectorAll('[data-subject-title]').forEach((el) => { el.textContent = subject.title; });
    document.querySelectorAll('[data-subject-cover]').forEach((img) => { img.src = subject.cover; });

    // Selo com o ícone e a cor da matéria
    document.querySelectorAll('[data-subject-icon]').forEach((badge) => {
        badge.style.cssText = accentStyle(subject);
        badge.innerHTML = icon(subject.icon, 'size-5');
    });

    const sorted = renderDays(grid, subject.items, (item) => studyHref(subject.id, item));

    const count = document.querySelector('[data-subject-count]');
    if (count) count.textContent = totalsText(getSubjectTotals(subject));

    // "Atualizado em": data do item mais recente
    const updated = document.querySelector('[data-subject-updated]');
    if (updated) updated.textContent = sorted[0] ? `Atualizado em ${formatDayLabel(sorted[0].datetime)}` : '';

    const empty = document.querySelector('[data-subject-empty]');
    if (empty) empty.hidden = subject.items.length > 0;
}

export function initStudyGallery() {
    initSubjectList();
    initSubjectPage();
}