import '../components/page-title.js';
import '../components/card.js';
import '../components/app-button.js';
import '../components/gradient-text.js';
import '../components/brand-logo.js';
import '../components/feature-card.js';
import '../components/back-button.js';
import '../components/header.js';
import '../components/icon.js';
import '../components/icon-badge.js';
import './gesture-wheel.js';
import { initCameraMenu } from './camera-menu.js';
import { initSearchBar } from './search-bar.js';
import { initGalleryFilter } from './gallery-filter.js';
import { initGesturePresets } from './gesture-presets.js';
import { initTypewriter } from '../components/type-writter.js';
import { initPhotoDetail } from './photo-detail.js';
import { initAskModeSheet } from './ask-mode-sheet.js';
import { initGestureModeSave } from './gesture-mode-save.js';
import { initWelcome } from './welcome.js';
import { initLoginForm } from './login-form.js';
import { initSyncScreen } from './sync-screen.js';
import { initAlbumGrid } from './album-grid.js';
import { initTravelGallery } from './travel-gallery.js';
import { initTravelGuide } from './travel-guide.js';
import { initStudyGallery } from './study-gallery.js';
import { initCustomGestureSave, initCustomLockscreen, initCustomGestureCard } from './custom-gesture.js';

initCustomGestureCard();
initCustomGestureSave();
initCustomLockscreen();
initTravelGallery();
initStudyGallery();
initGalleryFilter();
initTravelGuide();
initAlbumGrid();
initWelcome();
initLoginForm();
initSyncScreen();
initCameraMenu();
initSearchBar();
initGesturePresets();
initTypewriter();
initPhotoDetail();
initAskModeSheet();
initGestureModeSave();

/* ---------- Atalho global: Esc volta para a tela de bloqueio ---------- */

const LOCKSCREEN_PATH = '/lockscreen/';

// Há algum painel aberto (dialog ou menu popover)? Nesse caso, o Esc só fecha o painel.
function hasOpenLayer() {
    try {
        return Boolean(document.querySelector('dialog[open], :popover-open'));
    } catch {
        // Navegadores antigos não conhecem :popover-open e lançam erro no seletor
        return Boolean(document.querySelector('dialog[open]'));
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    // Tecla segurada (repetição) ou Esc já tratado por outro script (ex.: limpar a busca)
    if (event.repeat || event.defaultPrevented) return;

    // Esc dentro de um campo de texto pertence ao campo
    const target = event.target;
    if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

    // Esc fecha o painel aberto, sem trocar de página
    if (hasOpenLayer()) return;

    // Já está na tela de bloqueio
    if (window.location.pathname.startsWith(LOCKSCREEN_PATH)) return;

    window.location.href = LOCKSCREEN_PATH;
});