class AppPageTitle extends HTMLElement {
    connectedCallback() {
        this.classList.add(
            "flex",
            "items-center",
            "justify-center",
            "page-title-text"
        );
    }
}

customElements.define('app-page-title', AppPageTitle);