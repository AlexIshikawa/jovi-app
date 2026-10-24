/**
 * Modo de gestos personalizado
 *
 * 1. Na página Meus Gestos (initCustomGestureSave):
 *    o botão [data-save-custom-gesture] guarda o nome, a cor (radios name="gesture-color")
 *    e os modos de cada posição da roda, e abre a lockscreen personalizada.
 *    A cor é escolhida num seletor compacto ([data-color-picker]): uma bolinha com a
 *    cor atual que abre a paleta (initColorPicker, chamado pelo initCustomGestureSave).
 * 2. Na lockscreen personalizada (initCustomLockscreen):
 *    lê o que foi salvo e monta a tela: nome, cor, botão central e atalhos.
 *
 * 3. Na lista de Meus Gestos (initCustomGestureCard):
 *    se houver um gesto salvo, mostra um card dele ([data-custom-gesture-card]).
 *
 * No main.js, chame initCustomLockscreen() ANTES de initCameraMenu(),
 * para o menu encontrar os atalhos já preenchidos.
 */

const STORAGE_KEY = 'jovi:custom-gesture';
const CUSTOM_LOCKSCREEN = '/lockscreen/custom/index.html';

// Posições da roda, na mesma ordem e com os mesmos nomes do gesture-presets.js
const POSITIONS = ['Centro', 'Cima', 'Direita', 'Baixo', 'Esquerda'];
const DIRECTIONS = [null, 'up', 'right', 'down', 'left'];

// Atalhos que reaproveitam ações existentes do camera-menu.js
// (ex.: o Ask Mode toca o vídeo do Modo Viagem e abre o IA Guia)
const SHORTCUT_KEYS = { 'ask-mode': 'viagem' };

// Usado quando nada foi salvo ainda
const DEFAULT_GESTURE = {
    name: 'Meu modo',
    color: 'violet-400',
    slots: [
        { value: 'selfie', name: 'Selfie', icon: '' },
        { value: 'video', name: 'Vídeo', icon: '' },
        null,
        null,
        null,
    ],
};

// Só o que foi salvo de verdade (null quando nada foi salvo)
function readSavedGesture() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
        return null;
    }
}

// Texto digitado pela pessoa vira texto puro no HTML (sem virar código)
const escapeHtml = (text) =>
    String(text).replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

function readGesture() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? DEFAULT_GESTURE;
    } catch {
        return DEFAULT_GESTURE; // armazenamento indisponível ou dado corrompido
    }
}

/* ---------- Seletor de cor compacto ---------- */

function initColorPicker() {
    const picker = document.querySelector('[data-color-picker]');
    if (!picker) return;

    const toggle = picker.querySelector('[data-color-toggle]');
    const panel = picker.querySelector('[data-color-panel]');

    function setOpen(open) {
        panel.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        // Ao abrir, o foco vai para a cor marcada (as setas do teclado trocam a cor)
        if (open) panel.querySelector('input:checked')?.focus();
    }

    // A bolinha mostra a cor marcada: o JS copia a cor para --picked
    function syncPicked() {
        const checked = panel.querySelector('input:checked');
        if (!checked) return;
        picker.style.setProperty('--picked', `var(--color-${checked.value})`);
        const name = checked.closest('label').querySelector('span.sr-only')?.textContent ?? '';
        toggle.setAttribute('aria-label', `Cor do gesto: ${name}. Tocar para trocar`);
    }

    toggle.addEventListener('click', () => setOpen(panel.hidden));

    // Escolheu uma cor: atualiza a bolinha e fecha a paleta
    panel.addEventListener('change', () => {
        syncPicked();
        setOpen(false);
        toggle.focus();
    });

    // Toque fora fecha
    document.addEventListener('click', (event) => {
        if (!panel.hidden && !picker.contains(event.target)) setOpen(false);
    });

    // Esc fecha só a paleta (preventDefault avisa o atalho global de Esc para não trocar de página)
    picker.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || panel.hidden) return;
        event.preventDefault();
        setOpen(false);
        toggle.focus();
    });

    syncPicked();
}

/* ---------- 1. Salvar (página Meus Gestos) ---------- */

export function initCustomGestureSave() {
    initColorPicker();

    const saveButton = document.querySelector('[data-save-custom-gesture]');
    const picker = document.querySelector('[data-preset-picker]');
    if (!saveButton || !picker) return;

    // Lê a posição de cada modo direto dos cards ("Em uso: Cima"), que o
    // gesture-presets.js mantém atualizados: assim a ordem é exatamente a da roda
    function collectSlots() {
        const slots = Array(POSITIONS.length).fill(null);

        picker.querySelectorAll('[data-preset-option]').forEach((card) => {
            const label = card.querySelector('[data-slot-label]');
            if (!label || label.hidden) return;

            const index = POSITIONS.findIndex((position) => label.textContent.trim().endsWith(position));
            if (index === -1) return;

            const input = card.querySelector('input[type="checkbox"]');
            slots[index] = {
                value: input.value,
                name: input.dataset.name,
                icon: card.querySelector('app-icon svg')?.outerHTML ?? '',
                config: input.dataset.setupConfig ? JSON.parse(input.dataset.setupConfig) : null,
            };
        });

        return slots;
    }

    // Captura o clique antes do link interno do <app-button> navegar
    saveButton.addEventListener(
        'click',
        (event) => {
            event.preventDefault();

            const name = document.querySelector('#gesture-name')?.value.trim() || DEFAULT_GESTURE.name;
            const color =
                document.querySelector('input[name="gesture-color"]:checked')?.value ?? DEFAULT_GESTURE.color;

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ name, color, slots: collectSlots() }));
            } catch {
                // Sem armazenamento (ex.: modo privado restrito): segue para a tela com o padrão
            }

            window.location.href = CUSTOM_LOCKSCREEN;
        },
        { capture: true },
    );
}

/* ---------- 2. Montar a lockscreen personalizada ---------- */

export function initCustomLockscreen() {
    const screen = document.querySelector('[data-custom-lockscreen]');
    if (!screen) return;

    const gesture = readGesture();

    // Cor: vira a variável --accent, usada por todas as classes da tela
    screen.style.setProperty('--accent', `var(--color-${gesture.color})`);

    document.title = `JOVI AI CAMERA • ${gesture.name}`;
    document.querySelectorAll('[data-custom-name]').forEach((el) => {
        el.textContent = gesture.name;
    });

    const filled = gesture.slots.filter(Boolean).length;
    const count = screen.querySelector('[data-custom-count]');
    if (count) count.textContent = `${filled} ${filled === 1 ? 'gesto configurado' : 'gestos configurados'} do seu jeito.`;

    /* Centro: o 1º modo escolhido vira o toque rápido */
    const center = gesture.slots[0];
    const trigger = screen.querySelector('[data-camera-trigger]');
    if (trigger && center) {
        trigger.dataset.tapAction = SHORTCUT_KEYS[center.value] ?? center.value;
        trigger.dataset.tapLabel = center.name;
        trigger.setAttribute('aria-label', `${center.name} (segure e arraste para outros modos)`);
        if (center.icon) trigger.querySelector('[data-icon]').innerHTML = center.icon;
    }

    // Ícone do modo também no seletor da barra superior
    const modeIcon = screen.querySelector('[data-custom-mode-icon]');
    if (modeIcon && center?.icon) modeIcon.innerHTML = center.icon;

    /* Atalhos: cima, direita, baixo e esquerda */
    DIRECTIONS.forEach((direction, index) => {
        if (!direction) return;

        const button = screen.querySelector(`[data-direction="${direction}"]`);
        if (!button) return;

        const slot = gesture.slots[index];

        // Posição vazia: remove o atalho (e a seta dele), para o menu não oferecê-lo
        if (!slot) {
            screen.querySelector(`[data-arrow="${direction}"]`)?.remove();
            button.remove();
            return;
        }

        button.dataset.shortcut = SHORTCUT_KEYS[slot.value] ?? slot.value;
        button.dataset.label = slot.name;
        button.querySelector('[data-sat-label]').textContent = slot.name;
        if (slot.icon) button.querySelector('[data-icon]').innerHTML = slot.icon;
    });
}

/* ---------- 3. Card do gesto salvo (lista de Meus Gestos) ---------- */

export function initCustomGestureCard() {
    const container = document.querySelector('[data-custom-gesture-card]');
    if (!container) return;

    const gesture = readSavedGesture();
    if (!gesture) return; // nada salvo: o espaço continua escondido

    const name = escapeHtml(gesture.name);
    const center = gesture.slots[0];

    // Modos do gesto, na ordem da roda, com a posição de cada um
    const modes = gesture.slots
        .map((slot, index) => (slot ? { ...slot, position: POSITIONS[index] } : null))
        .filter(Boolean)
        .map(
            (slot) => `
        <li class="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3">
          <span class="flex size-7 shrink-0 items-center justify-center rounded-full border border-(--accent)/60 text-(--accent)">
            <span class="size-4 [&>svg]:size-full" aria-hidden="true">${slot.icon}</span>
          </span>
          <span class="flex flex-col">
            <span class="text-xs font-medium leading-tight">${escapeHtml(slot.name)}</span>
            <span class="text-[10px] leading-tight text-white/50">${slot.position}</span>
          </span>
        </li>`,
        )
        .join('');

    const content = container.querySelector('[data-custom-gesture-content]') ?? container;
    content.innerHTML = `
    <label style="--accent: var(--color-${escapeHtml(gesture.color)})"
      class="group/preset block rounded-2xl border border-white/10 bg-white/[0.03] p-4 cursor-pointer transition-[border-color,background-color,box-shadow] duration-300 has-checked:border-(--accent) has-checked:bg-(--accent)/5 has-checked:shadow-[0_0_32px_-8px_var(--accent)] has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-white [-webkit-tap-highlight-color:transparent]">
      <input type="radio" name="gesture-preset" value="custom" class="sr-only">

      <span class="flex items-start gap-4">
        <span class="flex size-14 shrink-0 items-center justify-center rounded-full border-2 border-(--accent) bg-(--accent)/10 text-(--accent)">
          <span class="size-7 [&>svg]:size-full" aria-hidden="true">${center?.icon ?? ''}</span>
        </span>

        <span class="flex min-w-0 flex-1 flex-col gap-1">
          <span class="flex flex-wrap items-center gap-2">
            <span class="truncate text-lg font-semibold">${name}</span>
            <span class="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-xs text-white/70">Personalizado</span>
            <span class="hidden items-center gap-1 rounded-full border border-(--accent)/60 bg-(--accent)/15 px-2 py-0.5 text-xs group-has-checked/preset:inline-flex">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 text-(--accent)" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
              Selecionado
            </span>
          </span>
          <span class="text-sm leading-snug text-white/65">Este é apenas um gesto customizado, criado por você com os modos que preferir.</span>
        </span>

        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5 shrink-0 self-center text-white/60" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
      </span>

      <!-- Modos do gesto: só aparecem quando ele está selecionado -->
      <ul class="mt-4 hidden flex-wrap gap-2 group-has-checked/preset:flex">${modes}</ul>
    </label>`;

    container.hidden = false;
}