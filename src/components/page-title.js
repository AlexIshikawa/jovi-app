class PageTitle extends HTMLElement {
    connectedCallback() {
        const text = this.innerHTML;
        this.className = `flex items-center justify-center`;

        this.innerHTML = `
        <strong class="font-light mt-6 mb-2 uppercase text-normal opacity-80 flex items-center justify-center">${text}</strong>
    `;
    }
}

customElements.define('page-title', PageTitle);