class AppHeader extends HTMLElement {
    connectedCallback() {
        const title = this.getAttribute('title') || '';
        // Rota opcional do botão de voltar; sem ela, o botão usa history.back()
        const backHref = this.getAttribute('back-href');

        this.className = 'flex items-center justify-center p-4 relative mt-4';

        // Cria o botão e define o href ANTES de colocá-lo na página:
        // assim ele já "nasce" sabendo para onde voltar
        const backButton = document.createElement('app-back-button');
        backButton.className = 'absolute left-4 top-1/2 -translate-y-1/2';
        if (backHref) backButton.setAttribute('href', backHref);

        const pageTitle = document.createElement('app-page-title');
        pageTitle.className = 'm-0';
        pageTitle.textContent = title;

        this.replaceChildren(backButton, pageTitle);
    }
}

customElements.define('app-header', AppHeader);