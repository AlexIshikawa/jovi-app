/**
 * Tela de sincronização do "Meu Jovi" (simulação)
 *
 * Percorre as etapas ([data-sync-step]) uma a uma, enchendo o anel de progresso,
 * mostra o sucesso e redireciona para a página definida em data-next-page no <main>.
 */

// Duração de cada etapa (ms), na mesma ordem dos itens da lista
const STEP_DURATIONS = [1100, 1300, 1700, 1100, 1300];

// Tempo na tela de sucesso antes de redirecionar
const REDIRECT_SECONDS = 3;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Anima um número de "from" até "to" em "duration" ms, chamando onUpdate a cada quadro
function animateValue(from, to, duration, onUpdate) {
    return new Promise((resolve) => {
        const start = performance.now();

        function frame(now) {
            const progress = Math.min((now - start) / duration, 1);
            // Desacelera no final de cada etapa (ease-out), como num progresso real
            const eased = 1 - (1 - progress) ** 3;
            onUpdate(from + (to - from) * eased);

            if (progress < 1) requestAnimationFrame(frame);
            else resolve();
        }

        requestAnimationFrame(frame);
    });
}

export async function initSyncScreen() {
    const screen = document.querySelector('[data-sync]');
    if (!screen) return; // não é a tela de sincronização

    const steps = [...screen.querySelectorAll('[data-sync-step]')];
    const progressbar = screen.querySelector('[role="progressbar"]');
    const percentEl = screen.querySelector('[data-sync-percent]');
    const countdownEl = screen.querySelector('[data-sync-countdown]');
    const nextPage = screen.dataset.nextPage || '/';

    // O botão "Começar a usar" leva para o mesmo destino do redirecionamento
    screen.querySelector('[data-sync-continue]')?.setAttribute('href', nextPage);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = reducedMotion ? 0.3 : 1; // com menos movimento, tudo fica mais rápido

    function setProgress(value) {
        const rounded = Math.round(value);
        // O CSS lê --progress (0 a 100) para desenhar o anel
        screen.style.setProperty('--progress', value);
        percentEl.textContent = `${rounded}%`;
        progressbar.setAttribute('aria-valuenow', rounded);
    }

    /* ---------- Etapas ---------- */

    let current = 0;
    const share = 100 / steps.length; // cada etapa vale uma parte igual do total

    await wait(400 * speed);

    for (const [index, step] of steps.entries()) {
        step.dataset.state = 'active';
        progressbar.setAttribute('aria-valuetext', step.dataset.label);

        const target = share * (index + 1);
        await animateValue(current, target, (STEP_DURATIONS[index] ?? 1200) * speed, setProgress);
        current = target;

        step.dataset.state = 'done';
    }

    /* ---------- Sucesso ---------- */

    await wait(300 * speed);
    screen.dataset.done = ''; // o CSS troca o anel pelo check e mostra a mensagem final

    // Contagem regressiva até o redirecionamento
    for (let seconds = REDIRECT_SECONDS; seconds > 0; seconds -= 1) {
        countdownEl.textContent = `Abrindo em ${seconds}s...`;
        await wait(1000);
    }

    window.location.href = nextPage;
}