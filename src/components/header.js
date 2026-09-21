class AppHeader extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute("title") || "";

        this.className = `
            flex items-center justify-center p-4 relative mt-4
        `;

        this.innerHTML = `
            <app-back-button class="absolute left-4 top-1/2 -translate-y-1/2"><img src="/src/assets/icons/arrow-left.png" alt="Arrow Left" ></app-back-button>
            <app-page-title class="m-0">${title}</app-page-title>
        `;
    }
}

customElements.define('app-header', AppHeader);