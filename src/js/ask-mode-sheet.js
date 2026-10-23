/**
 * Bottom sheet de configuração do Ask Mode
 *
 * - Libera o campo de texto só quando "foco personalizado" está escolhido
 *   (e o torna obrigatório nesse caso); tocar no campo já escolhe essa opção;
 * - Fecha ao tocar fora do painel.
 * Abrir, salvar e colocar o modo na roda é com o gesture-presets.js.
 */

export function initAskModeSheet() {
    const sheet = document.querySelector('[data-ask-sheet]');
    if (!sheet) return; // página sem o formulário

    const radios = [...sheet.querySelectorAll('input[name="ask-type"]')];
    const focusField = sheet.querySelector('textarea[name="ask-focus"]');

    const customRadio = radios.find((radio) => radio.value === 'custom');

    function syncFocusField() {
        const isCustom = customRadio.checked;

        // Somente leitura: não é validado. Liberado: passa a ser obrigatório.
        focusField.readOnly = !isCustom;
        focusField.required = isCustom;
        if (isCustom) focusField.focus();
    }

    radios.forEach((radio) => radio.addEventListener('change', syncFocusField));

    // Tocar no campo de texto escolhe automaticamente o "foco personalizado"
    focusField.addEventListener('focus', () => {
        if (customRadio.checked) return;
        customRadio.checked = true;
        syncFocusField();
    });

    syncFocusField();

    // Clique no fundo escuro: o alvo é o próprio <dialog>, não o conteúdo dele
    sheet.addEventListener('click', (event) => {
        if (event.target === sheet) sheet.close('cancel');
    });
}