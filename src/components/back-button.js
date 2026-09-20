// src/components/back-button.js
class AppBackButton extends HTMLElement {
    connectedCallback() {
        this.classList.add(
            "inline-flex",
            "items-center",
            "justify-center",
            "w-8",
            "h-8",
            "rounded-full",
            "border",
            "border-white/40",
            "text-white",
            "cursor-pointer"
        );

        this.innerHTML = `<span class="text-xl leading-none">&lt;</span>`;

        this.addEventListener("click", () => {
            history.back();
        });
    }
}

customElements.define('app-back-button', AppBackButton);