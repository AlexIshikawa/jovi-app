const VARIANTS = {
    filled:
        'bg-linear-to-r from-brand-blue to-brand-purple text-white shadow-[0_0_16px_rgba(217,119,255,0.35)]',
    outline: 'bg-white/5 text-white ring-1 ring-inset ring-white/15',
};

const SHAPES = {
    rounded: 'rounded-xl',
    circle: 'rounded-full',
};

class AppIcon extends HTMLElement {
    // Atributos que, ao mudarem, chamam attributeChangedCallback
    static observedAttributes = ['variant', 'shape', 'icon', 'alt'];

    connectedCallback() {
        // Monta a estrutura só uma vez, mesmo se o elemento for movido na página
        if (this._box) return;

        const icon = this.getAttribute('icon');
        const inlineSvg = this.innerHTML.trim(); // SVG escrito dentro da tag, se houver

        this.classList.add('inline-block', 'shrink-0');

        if (icon) {
            this.innerHTML = `<img src="${icon}" alt="${this.getAttribute('alt') ?? ''}">`;
        } else {
            this.innerHTML = `<span aria-hidden="true">${inlineSvg}</span>`;
        }

        this._box = this.firstElementChild;
        this.updateClasses();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (!this._box || oldValue === newValue) return;

        if (name === 'icon' && this._box.tagName === 'IMG') this._box.src = newValue;
        if (name === 'alt' && this._box.tagName === 'IMG') this._box.alt = newValue ?? '';

        this.updateClasses();
    }

    // Troca só as classes: o elemento continua o mesmo, então as transições funcionam
    updateClasses() {
        const variant = VARIANTS[this.getAttribute('variant')] ?? VARIANTS.filled;
        const shape = SHAPES[this.getAttribute('shape')] ?? SHAPES.rounded;
        const isImage = this._box.tagName === 'IMG';

        this._box.className = [
            'flex size-full items-center justify-center p-2',
            'transition-[background-color,box-shadow] duration-300',
            isImage ? 'object-contain' : '[&>svg]:size-full',
            shape,
            variant,
        ].join(' ');
    }
}

customElements.define('app-icon', AppIcon);