class AppFeatureCard extends HTMLElement {
    connectedCallback() {
        const noPadding = this.hasAttribute("no-padding");

        this.classList.add(
            "block",
            "rounded-3xl",
            "bg-transparent",
            "border",
            "border-white/10",
            "shadow-[0_0_25px_-5px_rgba(85,183,255,0.25)]",
            "overflow-hidden"
        );

        if (!noPadding) {
            this.classList.add("p-6");
        }
    }
}
customElements.define('app-feature-card', AppFeatureCard);