/**
 * Presets de gestos da lockscreen
 *
 * Controla a lista de modos (checkboxes) e preenche o <app-gesture-wheel>:
 * - o 1º modo escolhido vai para o centro, os seguintes para cima, direita, baixo e esquerda;
 * - desmarcar um modo libera a posição dele, e o próximo escolhido ocupa esse lugar;
 * - com as 5 posições cheias, um novo modo substitui o escolhido há mais tempo.
 *
 * Modos que precisam de configuração antes de entrar (ex.: Ask Mode) têm
 * data-setup="#id-do-dialog" no checkbox: ao marcar, o <dialog> abre, e o modo
 * só entra na roda se a pessoa salvar. A configuração fica em data-setup-config.
 */

const POSITIONS = ['Centro', 'Cima', 'Direita', 'Baixo', 'Esquerda'];
const MAX_SLOTS = POSITIONS.length;

export function initGesturePresets() {
    const picker = document.querySelector('[data-preset-picker]');
    if (!picker) return; // página sem presets

    const wheel = document.querySelector('app-gesture-wheel');
    const toast = document.getElementById('toast');
    let toastTimer = null;

    function showToast(message) {
        if (!toast || !message) return;
        toast.textContent = message;
        toast.dataset.visible = '';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => delete toast.dataset.visible, 1800);
    }

    // Lê uma vez os dados de cada card: valor, nome, ícone e elementos a atualizar
    const options = [...picker.querySelectorAll('[data-preset-option]')].map((card) => {
        const input = card.querySelector('input[type="checkbox"]');
        const icon = card.querySelector('app-icon');

        return {
            value: input.value,
            name: input.dataset.name,
            iconSvg: icon?.querySelector('svg')?.outerHTML ?? '',
            input,
            icon,
            slotLabel: card.querySelector('[data-slot-label]'),
        };
    });

    const optionByValue = new Map(options.map((option) => [option.value, option]));

    // slots: o que está em cada posição (valor do modo ou null)
    // history: ordem em que os modos foram escolhidos, do mais antigo ao mais novo
    const slots = Array(MAX_SLOTS).fill(null);
    const history = [];

    function add(value) {
        let index = slots.indexOf(null); // primeira posição livre

        // Tudo cheio: substitui o modo escolhido há mais tempo, na mesma posição
        if (index === -1) {
            const oldest = history.shift();
            index = slots.indexOf(oldest);
            optionByValue.get(oldest).input.checked = false;
        }

        slots[index] = value;
        history.push(value);
    }

    function remove(value) {
        const index = slots.indexOf(value);
        if (index !== -1) slots[index] = null;

        const position = history.indexOf(value);
        if (position !== -1) history.splice(position, 1);
    }

    function render() {
        options.forEach((option) => {
            const index = slots.indexOf(option.value);
            const inUse = index !== -1;

            option.icon?.setAttribute('variant', inUse ? 'filled' : 'outline');

            if (option.slotLabel) {
                option.slotLabel.hidden = !inUse;
                option.slotLabel.textContent = inUse ? `Em uso: ${POSITIONS[index]}` : '';
            }
        });

        wheel?.render?.(
            slots.map((value) => {
                if (!value) return null;
                const option = optionByValue.get(value);
                return { name: option.name, icon: option.iconSvg };
            }),
        );
    }

    // Abre o formulário de configuração; o modo só entra se a pessoa salvar
    function openSetup(input) {
        const dialog = document.querySelector(input.dataset.setup);
        const form = dialog?.querySelector('form');
        if (!dialog || !form) return select(input); // sem formulário: entra direto

        dialog.returnValue = ''; // limpa o resultado da abertura anterior
        dialog.showModal();

        dialog.addEventListener(
            'close',
            () => {
                // returnValue = value do botão usado (<form method="dialog">); Esc ou fora = cancelado
                if (dialog.returnValue !== 'save') return;

                input.dataset.setupConfig = JSON.stringify(Object.fromEntries(new FormData(form)));
                select(input);
                showToast(dialog.dataset.successMessage);
            },
            { once: true },
        );
    }

    function select(input) {
        input.checked = true;
        add(input.value);
        render();
    }

    picker.addEventListener('change', (event) => {
        const input = event.target;
        if (input.type !== 'checkbox') return;

        // Modo com configuração: desfaz a marcação até o formulário ser salvo
        if (input.checked && input.dataset.setup) {
            input.checked = false;
            openSetup(input);
            return;
        }

        if (input.checked) add(input.value);
        else remove(input.value);

        render();
    });

    // Estado inicial: modos que já vêm marcados no HTML, na ordem dos cards
    options.forEach((option) => {
        if (option.input.checked) add(option.value);
    });

    // Espera o componente da roda estar registrado antes do primeiro desenho
    customElements.whenDefined('app-gesture-wheel').then(render);
    render();
}