/**
 * Login do "Meu Jovi" (simulação para a apresentação)
 *
 * - Mostrar/ocultar senha ([data-password-toggle]);
 * - Envio: o navegador valida os campos; se estiverem ok, o botão mostra
 *   "Sincronizando..." e a próxima tela abre. Nada é enviado nem guardado.
 * - "Continuar com Google" ([data-login-provider]) simula o mesmo caminho.
 */

// Tela aberta depois do login (troque quando a próxima etapa existir)
const NEXT_PAGE = '/welcome/sync/';

// Tempo da simulação de sincronização
const SYNC_MS = 1200;

export function initLoginForm() {
    const form = document.querySelector('[data-login-form]');
    if (!form) return; // página sem login

    /* ---------- Mostrar / ocultar senha ---------- */

    const passwordInput = form.querySelector('input[name="password"]');
    const toggle = form.querySelector('[data-password-toggle]');

    toggle?.addEventListener('click', () => {
        const isVisible = toggle.getAttribute('aria-pressed') === 'true';

        toggle.setAttribute('aria-pressed', String(!isVisible));
        toggle.setAttribute('aria-label', isVisible ? 'Mostrar senha' : 'Ocultar senha');
        passwordInput.type = isVisible ? 'password' : 'text';
        passwordInput.focus();
    });

    /* ---------- Envio simulado ---------- */

    function startSync(button) {
        // Evita dois envios e mostra o estado de carregamento
        form.querySelectorAll('button').forEach((el) => {
            el.disabled = true;
        });
        button.dataset.loading = '';
        button.setAttribute('aria-busy', 'true');

        setTimeout(() => {
            window.location.href = NEXT_PAGE;
        }, SYNC_MS);
    }

    // O "submit" só acontece se os campos passarem na validação do navegador
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // sem servidor: nada é enviado
        startSync(event.submitter ?? form.querySelector('[type="submit"]'));
    });

    form.querySelectorAll('[data-login-provider]').forEach((button) => {
        button.addEventListener('click', () => startSync(button));
    });
}