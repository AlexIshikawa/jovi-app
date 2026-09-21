class AppButton extends HTMLElement {
    connectedCallback() {
        this.classList.add("block");

        const href = this.getAttribute("href") || "#";
        const variant = this.getAttribute("variant") || "primary";

        const variants = {
            primary: "bg-gradient-to-r from-brand-blue to-brand-purple text-black py-3 px-6",
            secondary: "bg-neutral-800 text-white border border-neutral-600 py-2 px-4",
        };

        const link = document.createElement("a");
        link.href = href;

        link.className = `
            flex
            items-center
            justify-center
            gap-2
            whitespace-nowrap
            w-full
            rounded-full
            text-center
            font-medium
            ${variants[variant]}
        `;

        while (this.firstChild) {
            link.appendChild(this.firstChild);
        }

        this.appendChild(link);
    }
}

customElements.define("app-button", AppButton);