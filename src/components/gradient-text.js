class AppGradientText extends HTMLElement {
  connectedCallback() {
    this.classList.add(
      "inline-block",
      "bg-gradient-to-r",
      "from-brand-blue",
      "to-brand-purple",
      "bg-clip-text",
      "text-transparent",
      "font-bold"
    );

    const href = this.getAttribute("href");
    if (href) {
      this.classList.add("cursor-pointer");
      this.addEventListener("click", () => {
        window.location.href = href;
      });
    }
  }
}

customElements.define('app-gradient-text', AppGradientText);