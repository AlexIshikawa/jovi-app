const POSITIONS = ['Centro', 'Cima', 'Direita', 'Baixo', 'Esquerda'];
const MAX_SLOTS = POSITIONS.length;

// Ícone de câmera do centro enquanto nenhum modo foi escolhido
const CAMERA_ICON = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.6l1.2-1.8A1.5 1.5 0 0 1 10.55 3.5h2.9a1.5 1.5 0 0 1 1.25.7L15.9 6h1.6A2.5 2.5 0 0 1 20 8.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5z" />
    <circle cx="12" cy="12.5" r="3.5" />
  </svg>`;

// Posição de cada satélite sobre o anel externo (centro do círculo no anel)
const SATELLITE_POSITIONS = [
    'left-1/2 top-[11%]', // cima
    'left-[89%] top-1/2', // direita
    'left-1/2 top-[89%]', // baixo
    'left-[11%] top-1/2', // esquerda
];

class AppGestureWheel extends HTMLElement {
    connectedCallback() {
        if (this._slotEls) return; // monta só uma vez

        this.classList.add('block');

        this.innerHTML = `
      <div aria-hidden="true" class="relative mx-auto aspect-square w-full max-w-80">

        <!-- Anéis guia -->
        <span class="absolute inset-[11%] rounded-full border border-white/10"></span>
        <span class="absolute inset-[30%] rounded-full border border-white/10"></span>

        <!-- Centro: igual ao botão da lockscreen, sempre no estado "aceso" -->
        <div class="absolute left-1/2 top-1/2 size-24 -translate-1/2">
          <span class="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(85,183,255,0.45)_0%,rgba(217,119,255,0.2)_45%,transparent_70%)] blur-md"></span>

          <div class="absolute inset-0 opacity-70 motion-reduce:hidden">
            <span class="absolute inset-0 rounded-full border border-brand-purple shadow-[0_0_12px_var(--color-brand-blue)] animate-wave"></span>
            <span class="absolute inset-0 rounded-full border border-brand-blue shadow-[0_0_12px_var(--color-brand-purple)] animate-wave [animation-delay:0.8s]"></span>
            <span class="absolute inset-0 rounded-full border border-brand-purple shadow-[0_0_12px_var(--color-brand-blue)] animate-wave [animation-delay:1.6s]"></span>
          </div>

          <div class="relative flex size-full items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_35%,var(--color-brand-dark-light),var(--color-brand-dark-deep)_75%)] text-white shadow-[0_0_24px_rgba(85,183,255,0.6),0_0_48px_rgba(217,119,255,0.35)]">
            <span class="absolute inset-0 rounded-full gradient-ring"></span>
            <div data-slot-content class="relative"></div>
          </div>
        </div>

        <!-- Satélites: vazios até receberem um modo -->
        ${SATELLITE_POSITIONS.map((position) => `
          <div data-slot
            class="group/slot absolute ${position} flex size-16 -translate-1/2 items-center justify-center rounded-full border border-dashed border-white/25 bg-white/[0.03] text-white transition-[background-color,border-color,box-shadow] duration-300 data-filled:border-transparent data-filled:bg-brand-dark-deep/80 data-filled:shadow-[0_0_14px_rgba(217,119,255,0.35)]">
            <span class="absolute inset-0 rounded-full gradient-ring [--ring-width:1.5px] opacity-0 transition-opacity duration-300 group-data-filled/slot:opacity-100"></span>
            <div data-slot-content class="relative"></div>
          </div>
        `).join('')}
      </div>

      <p data-caption class="mt-1 text-center text-xs text-white/60"></p>

      <!-- Resumo em texto para leitores de tela -->
      <p data-summary class="sr-only" aria-live="polite"></p>
    `;

        const center = this.querySelector('.size-24 [data-slot-content]');
        const satellites = [...this.querySelectorAll('[data-slot]')];

        // Mesma ordem dos slots: [centro, cima, direita, baixo, esquerda]
        this._slotEls = [center, ...satellites.map((el) => el.querySelector('[data-slot-content]'))];
        this._satellites = satellites;
        this._current = Array(MAX_SLOTS).fill(undefined);

        this.render(Array(MAX_SLOTS).fill(null));
    }

    render(slots) {
        if (!this._slotEls) return;

        slots.forEach((slot, index) => {
            const name = slot?.name ?? null;

            // Só redesenha o que mudou, para a animação rodar apenas no slot novo
            if (this._current[index] === name) return;
            this._current[index] = name;

            const content = this._slotEls[index];
            const isCenter = index === 0;

            if (isCenter) {
                content.innerHTML = slot
                    ? `<div class="flex flex-col items-center gap-1 animate-pop">
               <span class="size-8 [&>svg]:size-full">${slot.icon}</span>
               <span class="text-[11px] font-semibold uppercase tracking-wider">${slot.name}</span>
             </div>`
                    : `<span class="block size-9 opacity-80 [&>svg]:size-full">${CAMERA_ICON}</span>`;
                return;
            }

            const satellite = this._satellites[index - 1];
            satellite.toggleAttribute('data-filled', Boolean(slot));

            content.innerHTML = slot
                ? `<div class="flex flex-col items-center gap-1 animate-pop">
             <span class="size-5 [&>svg]:size-full">${slot.icon}</span>
             <span class="text-[10px] font-medium leading-none">${slot.name}</span>
           </div>`
                : '';
        });

        const filled = slots.filter(Boolean).length;

        this.querySelector('[data-caption]').textContent =
            filled === 0
                ? 'Selecione até 5 modos abaixo'
                : `${filled} de ${MAX_SLOTS} gestos configurados`;

        this.querySelector('[data-summary]').textContent = slots
            .map((slot, i) => `${POSITIONS[i]}: ${slot ? slot.name : 'vazio'}`)
            .join('. ');
    }
}

customElements.define('app-gesture-wheel', AppGestureWheel);