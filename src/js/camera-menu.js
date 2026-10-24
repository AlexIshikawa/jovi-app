/**
 * Menu radial da câmera (Jovi)
 *
 * Gesto: segurar o botão central, arrastar na direção de um atalho
 * e soltar para ativá-lo. Um toque rápido no centro abre a câmera
 * (ou a ação definida em data-tap-action / data-tap-label no botão central).
 *
 * Também funciona com teclado (Tab até o botão ou atalho + Enter).
 *
 * Direções: por padrão, 4 direções (data-direction="up|right|down|left").
 * Se os atalhos tiverem data-angle (em graus: 0 = direita, 90 = baixo,
 * 180 = esquerda, -90 = cima), vale o atalho mais próximo do ângulo do arraste,
 * o que permite diagonais e mais de 4 atalhos.
 */

// Distância mínima (px) do centro para considerar que houve arraste
const DRAG_THRESHOLD = 28;

// Tempo máximo (ms) para um pressionar ser considerado "toque rápido"
const TAP_MAX_MS = 300;

// Tempo (ms) que o aviso fica na tela
const TOAST_MS = 1500;

// Diferença máxima (graus) entre o arraste e um atalho com data-angle
const MAX_ANGLE_DIFF = 45;

// Pausa (ms) antes de trocar de página, para o aviso aparecer
const NAVIGATION_DELAY_MS = 1000;

// Aviso para funcionalidades marcadas como null em PAGES
const BETA_MESSAGE = 'Funcionalidade não disponível no Beta';

// O aviso do Beta é mais longo, então fica mais tempo na tela
const BETA_TOAST_MS = 2500;

/*
  Vídeos em tela cheia.
  fit (opcional):
   - 'contain' (padrão): mostra o vídeo inteiro, sem cortes (pode sobrar faixa preta);
   - 'cover': preenche a tela toda, cortando as bordas se a proporção for diferente.
*/
const VIDEOS = {
    // Caminhos absolutos (começando com /): funcionam em qualquer página que use o menu
    selfie: {
        src: '/src/assets/videos/selfie.mp4',
        next: '/memorias/galeria/selfie-detail/?foto=persona',
    },
    viagem: {
        src: '/src/assets/videos/viagem.mp4',
        next: '/modo-viagem/ia-guia/index.html',
    },
};

const PAGES = {
    configuracoes: '/configuracoes/index.html',
    selfie: '/selfie/index.html',
    viagem: '/modo-viagem/ia-guia/index.html',
    camera: null,
    'camera-frontal': null,
    video: null,
    panoramica: null,
    paisagem: null,
    documento: null,
    quadro: null,
    resumo: null,
    'ask-estudos': null,
    panorama: null,
    retrato: null,
    noturno: null,
};

// Classes completas por extenso para o Tailwind encontrá-las no build
const VIDEO_FIT_CLASSES = {
    contain: 'object-contain',
    cover: 'object-cover',
};

export function initCameraMenu() {
    const menu = document.querySelector('[data-camera-menu]');
    if (!menu) return;

    const trigger = menu.querySelector('[data-camera-trigger]');

    // O que o toque rápido no centro abre (padrão: câmera)
    const tapAction = trigger.dataset.tapAction ?? 'camera';
    const tapLabel = trigger.dataset.tapLabel ?? 'Câmera';
    const shortcuts = [...menu.querySelectorAll('[data-shortcut]')];
    const toast = document.getElementById('toast');

    // O vídeo fica dentro da "tela do celular" (o <main>), e não sobre a janela inteira
    const stage = menu.closest('main') ?? document.body;

    // { up: <button>, right: <button>, ... }
    const shortcutByDirection = Object.fromEntries(
        shortcuts.map((el) => [el.dataset.direction, el]),
    );

    // Atalhos posicionados por ângulo (ex.: home do Modo Viagem, com diagonais)
    const angledShortcuts = shortcuts
        .filter((el) => el.dataset.angle !== undefined)
        .map((el) => ({ el, angle: Number(el.dataset.angle) }));

    const videoPlayers = Object.fromEntries(
        Object.entries(VIDEOS).map(([action, config]) => [
            action,
            createVideoPlayer(config),
        ]),
    );

    let activePointerId = null;
    let origin = { x: 0, y: 0 };
    let pressStartedAt = 0;
    let selected = null;
    let toastTimer = null;

    /* ---------- Estado visual ---------- */

    function openMenu() {
        menu.dataset.open = '';
    }

    function closeMenu() {
        delete menu.dataset.open;
        select(null);
    }

    function select(shortcut) {
        if (shortcut === selected) return;

        selected?.removeAttribute('data-selected');
        selected = shortcut;

        if (selected) {
            selected.dataset.selected = '';
            navigator.vibrate?.(10); // vibração curta em celulares Android
        }
    }

    /* ---------- Cálculo da direção ---------- */

    function directionFrom(dx, dy) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return null;

        // O eixo com maior deslocamento define a direção
        if (Math.abs(dx) > Math.abs(dy)) {
            return dx > 0 ? 'right' : 'left';
        }
        return dy > 0 ? 'down' : 'up';
    }

    // Escolhe o atalho a partir do deslocamento do dedo
    function shortcutFrom(dx, dy) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return null;

        if (angledShortcuts.length > 0) {
            // atan2 devolve o ângulo do arraste em radianos; convertido para graus
            const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

            let best = null;
            let bestDiff = Infinity;

            angledShortcuts.forEach((shortcut) => {
                // Menor diferença entre dois ângulos, de 0 a 180 (trata a volta de 180 para -180)
                const diff = Math.abs(((angle - shortcut.angle + 540) % 360) - 180);
                if (diff < bestDiff) {
                    best = shortcut.el;
                    bestDiff = diff;
                }
            });

            return bestDiff <= MAX_ANGLE_DIFF ? best : null;
        }

        const direction = directionFrom(dx, dy);
        return direction ? shortcutByDirection[direction] : null;
    }

    /* ---------- Ação ---------- */
    function activate(action, label) {
        menu.dispatchEvent(
            new CustomEvent('camera:shortcut', { detail: { action }, bubbles: true }),
        );

        const player = videoPlayers[action];
        if (player) {
            playVideo(player, VIDEOS[action].next);
            return;
        }

        // Ação cadastrada como null: ainda não existe no Beta
        if (action in PAGES && PAGES[action] === null) {
            showToast(BETA_MESSAGE, BETA_TOAST_MS);
            navigator.vibrate?.([10, 60, 10]); // vibração dupla: "não deu"
            return;
        }

        showToast(`Abrindo ${label}`);

        const page = PAGES[action];
        if (page) {
            setTimeout(() => {
                window.location.href = page;
            }, NAVIGATION_DELAY_MS);
        }
    }

    function showToast(message, duration = TOAST_MS) {
        if (!toast) return;

        toast.textContent = message;
        toast.dataset.visible = '';

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            delete toast.dataset.visible;
        }, duration);
    }

    /* ---------- Vídeo ---------- */

    function createVideoPlayer({ src, fit = 'contain' }) {
        const video = document.createElement('video');

        video.src = src;
        video.preload = 'auto';
        video.playsInline = true;
        video.setAttribute('aria-hidden', 'true');
        video.className = [
            // absolute (e não fixed): cobre só o <main>, que tem "relative"
            'absolute inset-0 z-50 size-full bg-black',
            VIDEO_FIT_CLASSES[fit] ?? VIDEO_FIT_CLASSES.contain,
            'invisible opacity-0 transition-[opacity,visibility] duration-200',
            'data-playing:visible data-playing:opacity-100',
        ].join(' ');

        stage.append(video);
        return video;
    }

    function playVideo(video, nextRoute) {
        video.currentTime = 0;
        video.dataset.playing = '';

        video.addEventListener(
            'ended',
            () => {
                window.location.href = nextRoute;
            },
            { once: true },
        );

        video.play().catch(() => {
            video.muted = true;
            return video.play();
        }).catch((error) => {
            console.error('Não foi possível tocar o vídeo:', error);
            delete video.dataset.playing;
            showToast('Não foi possível abrir o vídeo');
        });
    }

    // Esconde e pausa todos os vídeos, voltando a tela ao estado inicial
    function resetVideos() {
        Object.values(videoPlayers).forEach((video) => {
            video.pause();
            video.currentTime = 0;
            delete video.dataset.playing;
        });
    }

    /* ---------- Voltar para a página (bfcache) ---------- */

    // Ao sair da página, limpa o vídeo: se o navegador guardar a página
    // congelada e a pessoa voltar, ela reaparece sem o vídeo na frente
    window.addEventListener('pagehide', resetVideos);

    // Garantia extra: página restaurada do cache (persisted = true) também é limpa,
    // junto com o menu, caso a pessoa tenha saído com a roda aberta
    window.addEventListener('pageshow', (event) => {
        if (!event.persisted) return;
        resetVideos();
        endGesture();
    });

    /* ---------- Gesto: segurar, arrastar e soltar ---------- */

    trigger.addEventListener('pointerdown', (event) => {
        if (event.button !== 0) return; // só botão principal / dedo

        activePointerId = event.pointerId;

        // Continua recebendo pointermove mesmo quando o dedo sai do botão
        trigger.setPointerCapture(activePointerId);

        const rect = trigger.getBoundingClientRect();
        origin = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        };

        pressStartedAt = performance.now();
        openMenu();
    });

    trigger.addEventListener('pointermove', (event) => {
        if (event.pointerId !== activePointerId) return;

        select(shortcutFrom(event.clientX - origin.x, event.clientY - origin.y));
    });

    trigger.addEventListener('pointerup', (event) => {
        if (event.pointerId !== activePointerId) return;

        const chosen = selected;
        const wasQuickTap = performance.now() - pressStartedAt < TAP_MAX_MS;

        endGesture();

        if (chosen) {
            activate(chosen.dataset.shortcut, chosen.dataset.label);
        } else if (wasQuickTap) {
            activate(tapAction, tapLabel);
        }
        // Segurou e soltou no centro sem escolher: apenas fecha
    });

    // O sistema pode cancelar o gesto (ex.: notificação, troca de app)
    trigger.addEventListener('pointercancel', endGesture);

    function endGesture() {
        activePointerId = null;
        closeMenu();
    }

    /* ---------- Teclado ---------- */

    // Enter/Espaço no botão central disparam "click" com detail === 0.
    // Cliques de mouse/toque já foram tratados no pointerup.
    trigger.addEventListener('click', (event) => {
        if (event.detail === 0) activate(tapAction, tapLabel);
    });

    shortcuts.forEach((shortcut) => {
        shortcut.addEventListener('click', (event) => {
            event.preventDefault(); // se o atalho for um <a>, evita navegar duas vezes
            activate(shortcut.dataset.shortcut, shortcut.dataset.label);
        });
    });

    // Evita o menu de contexto do pressionar longo
    trigger.addEventListener('contextmenu', (event) => event.preventDefault());
}