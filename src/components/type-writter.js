/**
 * Efeito de digitação (estilo resposta de chat)
 *
 * Uso no HTML:
 *  - data-typewriter no elemento que agrupa os textos;
 *  - data-type em cada bloco que deve ser "digitado", na ordem em que aparecem.
 *
 * O texto já existe na página desde o início, escondido pelo CSS, então o card
 * não muda de tamanho. Enquanto a digitação não começa, aparece o indicador
 * [data-typewriter-loader]. Ao começar, o container recebe data-typing.
 * Se a página tiver blocos com data-reveal, espera a entrada deles terminar.
 * Ao terminar, dispara o evento "typewriter:done" no container.
 */

const START_DELAY_MS = 700;     // tempo extra do "pensando..." antes de digitar
const WORD_MIN_MS = 30;         // intervalo mínimo entre palavras
const WORD_MAX_MS = 80;         // intervalo máximo entre palavras
const COMMA_PAUSE_MS = 120;     // pausa extra depois de vírgula
const SENTENCE_PAUSE_MS = 280;  // pausa extra depois de ponto
const BLOCK_PAUSE_MS = 350;     // pausa entre um bloco e o próximo

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const randomBetween = (min, max) => min + Math.random() * (max - min);

// Quebra os textos de um bloco em <span> por palavra, mantendo <strong> e afins
function splitIntoWords(block) {
    const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    const words = [];

    textNodes.forEach((node) => {
        const fragment = document.createDocumentFragment();

        node.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;

            // Espaços continuam como texto normal
            if (/^\s+$/.test(part)) {
                fragment.append(document.createTextNode(part));
                return;
            }

            const span = document.createElement('span');
            span.textContent = part;
            span.className = 'opacity-0 transition-opacity duration-300';
            fragment.append(span);
            words.push(span);
        });

        node.replaceWith(fragment);
    });

    return words;
}

// Pausa depois de cada palavra: maior em pontuação, como numa leitura natural
function delayAfter(word) {
    const base = randomBetween(WORD_MIN_MS, WORD_MAX_MS);
    if (/[.!?]$/.test(word)) return base + SENTENCE_PAUSE_MS;
    if (/[,;:]$/.test(word)) return base + COMMA_PAUSE_MS;
    return base;
}

function createCaret() {
    // Largura zero: o cursor não empurra as palavras ao redor
    const caret = document.createElement('span');
    caret.setAttribute('aria-hidden', 'true');
    caret.className = 'relative inline-block h-[1em] w-0 align-text-bottom';
    caret.innerHTML =
        '<span class="absolute inset-y-0 left-0.5 w-0.5 rounded-full bg-brand-purple animate-pulse"></span>';
    return caret;
}

async function typewrite(container) {
    const blocks = [...container.querySelectorAll('[data-type]')];
    const loader = container.querySelector('[data-typewriter-loader]');

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mantém o "pensando..." um instante antes de começar a responder
    if (!reducedMotion) await wait(START_DELAY_MS);

    // Remove o indicador antes de quebrar o texto (ele não deve ser "digitado")
    loader?.remove();

    // Quebra em palavras invisíveis e só então libera os blocos (data-typing),
    // assim o texto nunca aparece inteiro antes da animação
    const wordsByBlock = blocks.map(splitIntoWords);
    container.dataset.typing = '';

    // Quem prefere menos movimento vê o texto completo, sem animação
    if (reducedMotion) {
        wordsByBlock.flat().forEach((word) => word.classList.remove('opacity-0'));
    } else {
        const caret = createCaret();

        for (const words of wordsByBlock) {
            for (const word of words) {
                word.after(caret);                  // cursor logo depois da palavra
                word.classList.remove('opacity-0'); // palavra aparece com fade
                await wait(delayAfter(word.textContent));
            }
            await wait(BLOCK_PAUSE_MS);
        }

        caret.remove();
    }

    container.dispatchEvent(new CustomEvent('typewriter:done', { bubbles: true }));
}

export function initTypewriter() {
    const containers = document.querySelectorAll('[data-typewriter]');
    if (containers.length === 0) return; // página sem o efeito

    // Só começa quando o texto aparece na tela
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                observer.unobserve(entry.target); // roda uma única vez
                typewrite(entry.target);
            });
        },
        { threshold: 0.3 },
    );

    // Espera as animações de entrada (data-reveal) terminarem antes de digitar
    const revealAnimations = [...document.querySelectorAll('[data-reveal]')]
        .flatMap((element) => element.getAnimations())
        .map((animation) => animation.finished.catch(() => { }));

    Promise.all(revealAnimations).then(() => {
        containers.forEach((container) => observer.observe(container));
    });
}