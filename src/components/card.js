class AppCard extends HTMLElement {
    connectedCallback() {
        this.className = `
        block rounded-3xl p-6
        bg-gradient-to-b from-brand-dark via-brand-dark-light to-brand-dark-deep
        border border-white/10
        text-white
      `;
    }
}

customElements.define('app-card', AppCard);