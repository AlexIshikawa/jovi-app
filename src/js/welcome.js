/**
 * Tela de boas-vindas "Meu Jovi"
 *
 * - Saudação digitada em vários idiomas: escreve, espera, apaga e passa para a próxima;
 * - Deslizar para cima (ou tocar em "Deslize para continuar") leva para a próxima tela.
 */

// Próxima tela depois das boas-vindas (troque quando o cadastro "Meu Jovi" existir)
const NEXT_PAGE = '/welcome/configure/';

// Saudações: texto + idioma (o lang ajuda o navegador a escolher a fonte certa)
const GREETINGS = [
    { text: 'Olá', lang: 'pt-BR' },
    { text: 'Hello', lang: 'en' },
    { text: 'Hola', lang: 'es' },
    { text: 'Bonjour', lang: 'fr' },
    { text: 'Ciao', lang: 'it' },
    { text: 'Hallo', lang: 'de' },
    { text: 'こんにちは', lang: 'ja' },
    { text: '안녕하세요', lang: 'ko' },
    { text: '你好', lang: 'zh' },
    { text: 'Привет', lang: 'ru' },
    { text: 'नमस्ते', lang: 'hi' },
    { text: 'Merhaba', lang: 'tr' },
];

const TYPE_MS = 110;    // tempo entre letras ao escrever
const DELETE_MS = 60;   // tempo entre letras ao apagar
const HOLD_MS = 1400;   // tempo com a palavra completa na tela
const GAP_MS = 350;     // pausa com a linha vazia antes da próxima

const SWIPE_MIN_PX = 60; // quanto o dedo precisa subir para contar como "deslizar"

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*
  Quebra o texto em "letras" do jeito que a pessoa vê (grafemas).
  Em hindi ou coreano, um símbolo visível pode ser formado por vários caracteres;
  o Intl.Segmenter evita mostrar pedaços quebrados durante a digitação.
*/
const segmenter = 'Segmenter' in Intl ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;

function toLetters(text) {
    return segmenter
        ? [...segmenter.segment(text)].map((part) => part.segment)
        : Array.from(text);
}

async function typeGreetings(target) {
    for (let i = 0; ; i = (i + 1) % GREETINGS.length) {
        const { text, lang } = GREETINGS[i];
        const letters = toLetters(text);
        target.lang = lang;

        // Escreve
        for (let n = 1; n <= letters.length; n += 1) {
            target.textContent = letters.slice(0, n).join('');
            await wait(TYPE_MS);
        }

        await wait(HOLD_MS);

        // Apaga
        for (let n = letters.length - 1; n >= 0; n -= 1) {
            target.textContent = letters.slice(0, n).join('');
            await wait(DELETE_MS);
        }

        await wait(GAP_MS);
    }
}

export function initWelcome() {
    const screen = document.querySelector('[data-welcome]');
    if (!screen) return; // não é a tela de boas-vindas

    /* ---------- Saudação digitada ---------- */

    const greeting = screen.querySelector('[data-greeting]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Com "reduzir movimento", fica só o "Olá" parado
    if (greeting && !reducedMotion) typeGreetings(greeting);

    /* ---------- Continuar ---------- */

    let leaving = false;

    function goNext() {
        if (leaving) return;
        leaving = true;
        screen.dataset.leaving = ''; // dispara a animação de saída no CSS
        setTimeout(() => {
            window.location.href = NEXT_PAGE;
        }, 350);
    }

    // Deslizar para cima em qualquer ponto da tela
    let startY = null;

    screen.addEventListener('pointerdown', (event) => {
        startY = event.clientY;
    });

    screen.addEventListener('pointerup', (event) => {
        if (startY === null) return;
        const distance = startY - event.clientY; // positivo = subiu
        startY = null;
        if (distance >= SWIPE_MIN_PX) goNext();
    });

    screen.addEventListener('pointercancel', () => {
        startY = null;
    });

    // Toque/Enter em "Deslize para continuar" (acessível por teclado e leitor de tela)
    screen.querySelector('[data-continue]')?.addEventListener('click', goNext);
}