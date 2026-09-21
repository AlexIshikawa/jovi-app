class AppIcon extends HTMLElement {
    connectedCallback() {
        const icon = this.getAttribute('icon');
        const alt = this.getAttribute('alt');
        const externalClasses = this.className;

        this.className = `inline-block shrink-0 ${externalClasses}`;

        this.innerHTML = `
            <img src="${icon}" alt="${alt}"
            class="w-full h-full mx-auto rounded-xl p-2
            bg-gradient-to-r from-brand-blue to-brand-purple
            object-contain">
        `;
    }
}

customElements.define('app-icon', AppIcon);