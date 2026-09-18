class AppButton extends HTMLElement {
    connectedCallback() {
        const href = this.getAttribute("href") || "#";

        const link = document.createElement("a");

        link.href = href;

        link.className = `
            flex
            items-center
            justify-center
            w-full
            py-3
            px-6
            rounded-full
            bg-gradient-to-r
            from-brand-blue
            to-brand-purple
            text-black
            text-center
            font-medium
        `;

        while (this.firstChild) {
            link.appendChild(this.firstChild);
        }

        this.appendChild(link);
    }
}

customElements.define("app-button", AppButton);