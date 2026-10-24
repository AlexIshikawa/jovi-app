// src/components/back-button.js
class AppBackButton extends HTMLElement {
    // Avisa o navegador para chamar attributeChangedCallback quando o href mudar
    static observedAttributes = ['href'];

    connectedCallback() {
        this.render();
    }

    attributeChangedCallback() {
        // Só redesenha se já estiver na página (antes disso, o connectedCallback cuida)
        if (this.isConnected) this.render();
    }

    render() {
        const href = this.getAttribute('href');

        // Com href: um link de verdade para a rota. Sem href: um botão que volta no histórico.
        const control = document.createElement(href ? 'a' : 'button');
        if (href) {
            control.href = href;
        } else {
            control.type = 'button';
            control.addEventListener('click', () => history.back());
        }

        control.setAttribute('aria-label', 'Voltar');
        control.className =
            'inline-flex size-8 items-center justify-center rounded-full border border-white/40 text-white ' +
            'cursor-pointer transition-colors active:bg-white/10 ' +
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
        control.innerHTML = '<span class="text-xl leading-none" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-5" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg></span>';

        this.replaceChildren(control);
    }
}

customElements.define('app-back-button', AppBackButton);