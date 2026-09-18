class AppGradientText extends HTMLElement {
    connectedCallback() {
        this.className = `
        inline-block
        bg-gradient-to-r from-brand-blue to-brand-purple
        bg-clip-text text-transparent
        font-bold
      `;
    }
}

customElements.define('app-gradient-text', AppGradientText);