/**
 * "Salvar meus gestos" na página Meus Gestos:
 * abre a tela de bloqueio correspondente ao modo selecionado.
 */

// Modo selecionado -> tela de bloqueio que deve abrir
const HOMES = {
    viagem: '/modo-viagem/lockscreen/',
    estudos: '/modo-estudos/lockscreen/',
};

// Modos sem tela própria voltam para a tela de bloqueio padrão
const DEFAULT_HOME = '/';

export function initGestureModeSave() {
    const saveButton = document.querySelector('[data-save-gestures]');
    if (!saveButton) return; // página sem o botão

    saveButton.addEventListener('click', (event) => {
        event.preventDefault();

        const mode = document.querySelector('input[name="gesture-preset"]:checked')?.value;
        window.location.href = HOMES[mode] ?? DEFAULT_HOME;
    });
}