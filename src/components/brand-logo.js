class AppBrandLogo extends HTMLElement {
    connectedCallback() {
        const iconSrc = this.getAttribute("icon") || "";
        const text = this.textContent.trim();

        this.className = `
            inline-flex
            items-center
            gap-3
        `;

        this.innerHTML = `
            <img src="${iconSrc}" alt="" class="w-10 h-10">
            <app-gradient-text class="text-xl">${text}</app-gradient-text>
        `;
    }
}

customElements.define('app-brand-logo', AppBrandLogo);