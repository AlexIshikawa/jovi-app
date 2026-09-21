class IconBadge extends HTMLElement {
    connectedCallback() {
        const icon = this.getAttribute('icon');
        const alt = this.getAttribute('alt') || '';
        const externalClasses = this.className;

        this.className = `inline-block shrink-0 ${externalClasses}`;

        this.innerHTML = `
            <div class="w-full h-full rounded-2xl p-0.5 bg-linear-to-br from-brand-blue to-brand-dark-light">
                <div class="w-full h-full rounded-2xl bg-brand-dark-deep flex items-center justify-center p-2">
                    <img src="${icon}" alt="${alt}" class="w-full h-full object-contain">
                </div>
            </div>
        `;
    }
}

customElements.define('app-icon-badge', IconBadge);