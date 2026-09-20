class AppIconAicam extends HTMLElement {
    connectedCallback() {
        const icon = this.getAttribute('icon');

        this.innerHTML = `
            <img src="${icon}" alt="" 
            class="mx-auto 
            rounded-xl w-20 h-20 p-2 mt-4
            bg-gradient-to-r from-brand-blue to-brand-purple
            object-cover">
        `;
    }
}

customElements.define('app-icon-aicam', AppIconAicam);