/**
 * Dados dos estudos (matérias)
 *
 * Fonte única para: lista de matérias, página da matéria e detalhe da anotação.
 * Para adicionar uma matéria, inclua um objeto em STUDY_SUBJECTS.
 * Para adicionar uma anotação, inclua um objeto no "items" da matéria.
 *
 * Campos da matéria:
 *  - id: usado no endereço (?materia=matematica) — sem espaços nem acentos
 *  - title, icon (math | atom | flask | dna | landmark | book), color (cor do Tailwind, ex.: 'sky-400')
 *  - cover: imagem da capa da página da matéria
 *  - items: anotações (pode começar vazia)
 *  - totals (opcional): números de exibição enquanto os itens ainda não foram cadastrados
 *
 * Campos de um item:
 *  - kind: "document" (documento) | "board" (quadro) | "summary" (resumo da IA)
 *  - id, title, datetime ("AAAA-MM-DDTHH:MM"), favorite, tags (opcional, para a busca)
 *  - documentos e quadros: src, alt, location, camera, ask, text (texto extraído)
 *  - explanation (opcional): conteúdo da tela do Ask Mode. Use **texto** para negrito.
 *      { subtitle, paragraphs: ['...', '...'] }
 *  - resumos: points (lista de tópicos) e relatedPhoto (id da anotação que o resumo abre)
 */

const IMG = '/src/assets/estudos/';

export const STUDY_SUBJECTS = [
    {
        id: 'matematica',
        title: 'Matemática',
        icon: 'math',
        color: 'sky-400',
        cover: `${IMG}estudos1.jpg`,
        items: [
            {
                kind: 'board',
                id: 'quadro-funcoes',
                src: `${IMG}estudos2.jpg`,
                title: 'Aula de funções',
                alt: 'Quadro da sala de aula com a fórmula de Bhaskara e o gráfico de uma parábola',
                datetime: '2024-10-14T10:15',
                location: 'Escola, São Paulo, Brasil',
                camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/120s', iso: 'ISO 200' },
                tags: 'quadro lousa aula funções segundo grau parábola bhaskara',
                ask: 'Peça para a Jovi explicar a fórmula de Bhaskara passo a passo, com um exemplo resolvido.',
                favorite: true,
                explanation: {
                    subtitle: 'Matemática • Funções',
                    paragraphs: [
                        'Este é o quadro da **fórmula de Bhaskara**, usada para encontrar as raízes de uma função do 2º grau, f(x) = ax² + bx + c.',
                        'Primeiro calcula-se o **discriminante**: Δ = b² − 4ac. Se Δ > 0, há duas raízes reais; se Δ = 0, uma; se Δ < 0, nenhuma raiz real.',
                        'O **vértice** da parábola fica em xv = −b / 2a e yv = −Δ / 4a. Ele é o ponto de mínimo quando a > 0 e de máximo quando a < 0.',
                    ],
                },
                text: `Função do 2º grau
f(x) = ax² + bx + c   (a ≠ 0)

Δ = b² − 4ac
x = (−b ± √Δ) / 2a

Vértice
xv = −b / 2a
yv = −Δ / 4a`,
            },
            {
                kind: 'document',
                id: 'lista-funcoes',
                src: `${IMG}estudos3.jpg`,
                title: 'Lista de exercícios',
                alt: 'Folha impressa com exercícios de funções do 2º grau',
                datetime: '2024-10-14T15:40',
                location: 'Casa, São Paulo, Brasil',
                camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/2.0', shutter: '1/100s', iso: 'ISO 250' },
                tags: 'documento lista exercícios funções segundo grau',
                ask: 'A Jovi confere suas respostas e mostra onde está o erro em cada exercício.',
                explanation: {
                    subtitle: 'Matemática • Exercícios',
                    paragraphs: [
                        'A lista traz dois exercícios de **funções do 2º grau**.',
                        'No 1º, f(x) = x² − 5x + 6 tem Δ = 25 − 24 = 1, então as raízes são **x = 2 e x = 3**.',
                        'No 2º, f(x) = x² − 4x + 3 tem vértice em xv = 4 / 2 = 2 e yv = 4 − 8 + 3 = −1, ou seja, **V(2, −1)**.',
                    ],
                },
                text: `Lista 3 — Funções do 2º grau

1) Encontre as raízes de f(x) = x² − 5x + 6.
   Resposta: x = 2 e x = 3

2) Determine o vértice de f(x) = x² − 4x + 3.
   Resposta: V(2, −1)`,
            },
            {
                kind: 'summary',
                id: 'resumo-funcoes',
                title: 'Funções do 2º grau',
                datetime: '2024-10-14T16:30',
                tags: 'resumo funções segundo grau bhaskara parábola',
                favorite: true,
                relatedPhoto: 'quadro-funcoes',
                points: [
                    'Δ = b² − 4ac define quantas raízes reais existem',
                    'x = (−b ± √Δ) / 2a',
                    'Vértice em x = −b / 2a',
                ],
            },
            {
                kind: 'document',
                id: 'caderno-funcoes',
                src: `${IMG}estudos1.jpg`,
                title: 'Anotações de funções',
                alt: 'Caderno aberto com anotações sobre o gráfico da parábola',
                datetime: '2024-10-14T16:05',
                location: 'Casa, São Paulo, Brasil',
                camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/80s', iso: 'ISO 320' },
                tags: 'documento caderno anotações funções gráfico',
                ask: 'Pergunte à Jovi como identificar a concavidade e o número de raízes só olhando a função.',
                explanation: {
                    subtitle: 'Matemática • Funções',
                    paragraphs: [
                        'As anotações mostram como ler o **gráfico da parábola** sem fazer contas.',
                        'O sinal de **a** define a concavidade: voltada para cima quando a > 0 e para baixo quando a < 0.',
                        'O sinal de **Δ** diz quantas vezes a parábola toca o eixo x: duas vezes (Δ > 0), uma vez (Δ = 0) ou nenhuma (Δ < 0).',
                    ],
                },
                text: `Gráfico da parábola

Concavidade
• a > 0: voltada para cima
• a < 0: voltada para baixo

Raízes reais
• Δ > 0: duas raízes diferentes
• Δ = 0: uma raiz (duas iguais)
• Δ < 0: nenhuma raiz real`,
            },
            {
                kind: 'document',
                id: 'caderno-trigo',
                src: `${IMG}estudos5.png`,
                title: 'Trigonometria',
                alt: 'Página de caderno com anotações de trigonometria: identidades, fórmulas, círculo trigonométrico e tabela de valores notáveis',
                datetime: '2024-10-10T14:32',
                location: 'Casa, São Paulo, Brasil',
                camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/60s', iso: 'ISO 320' },
                tags: 'documento caderno anotações trigonometria seno cosseno',
                ask: 'A Jovi analisa sua imagem e explica o conteúdo, resolve dúvidas e cria resumos personalizados.',
                explanation: {
                    subtitle: 'Matemática • Trigonometria',
                    paragraphs: [
                        'A página reúne as principais fórmulas de **trigonometria**.',
                        'A identidade fundamental, **sen²θ + cos²θ = 1**, vem do círculo trigonométrico de raio 1, em que cos θ = x e sen θ = y.',
                        'As **leis dos senos e dos cossenos** resolvem triângulos quaisquer. A lei dos cossenos, c² = a² + b² − 2ab · cos C, generaliza o teorema de Pitágoras: quando C = 90°, cos C = 0.',
                        'A tabela de **valores notáveis** (30°, 45° e 60°) aparece em quase todo exercício: vale memorizá-la.',
                    ],
                },
                text: `Trigonometria

Identidades principais
• sen²θ + cos²θ = 1
• 1 + tg²θ = sec²θ
• 1 + cotg²θ = cossec²θ

Fórmulas de adição
• sen(α + β) = sen α · cos β + cos α · sen β
• cos(α + β) = cos α · cos β − sen α · sen β
• tg(α + β) = (tg α + tg β) / (1 − tg α · tg β)

Lei dos senos
a / sen A = b / sen B = c / sen C

Lei dos cossenos
c² = a² + b² − 2ab · cos C

Valores notáveis (sen, cos, tg)
• 30°: 1/2, √3/2, √3/3
• 45°: √2/2, √2/2, 1
• 60°: √3/2, 1/2, √3`,
            },
            {
                kind: 'summary',
                id: 'resumo-trigo',
                title: 'Trigonometria',
                datetime: '2024-10-10T15:00',
                tags: 'resumo trigonometria seno cosseno ciclo trigonométrico',
                relatedPhoto: 'caderno-trigo',
                points: ['sen²x + cos²x = 1', 'tg x = sen x / cos x', 'Ciclo trigonométrico: 360° = 2π rad'],
            },
        ],
    },
    { id: 'fisica', title: 'Física', icon: 'atom', color: 'violet-400', cover: `${IMG}estudos2.jpg`, totals: { documents: 41, summaries: 12 }, items: [] },
    { id: 'quimica', title: 'Química', icon: 'flask', color: 'emerald-400', cover: `${IMG}estudos3.jpg`, totals: { documents: 35, summaries: 9 }, items: [] },
    { id: 'biologia', title: 'Biologia', icon: 'dna', color: 'lime-400', cover: `${IMG}estudos1.jpg`, totals: { documents: 52, summaries: 15 }, items: [] },
    { id: 'historia', title: 'História', icon: 'landmark', color: 'amber-400', cover: `${IMG}estudos2.jpg`, totals: { documents: 38, summaries: 11 }, items: [] },
    { id: 'portugues', title: 'Português', icon: 'book', color: 'rose-400', cover: `${IMG}estudos3.jpg`, totals: { documents: 29, summaries: 8 }, items: [] },
];

// Busca uma matéria pelo id; sem id ou id desconhecido, devolve a primeira
export function getSubject(id) {
    return STUDY_SUBJECTS.find((subject) => subject.id === id) ?? STUDY_SUBJECTS[0];
}

// Só as anotações com imagem (documentos e quadros), usadas no detalhe
export function getSubjectPhotos(subject) {
    return subject.items.filter((item) => item.kind !== 'summary');
}

// Contagem: usa "totals" se existir; senão, conta os itens cadastrados
export function getSubjectTotals(subject) {
    if (subject.totals) return subject.totals;
    const summaries = subject.items.filter((item) => item.kind === 'summary').length;
    return { documents: subject.items.length - summaries, summaries };
}

// Procura uma anotação pelo id em todas as matérias: devolve { subject, item } ou null
export function findStudyItem(itemId) {
    for (const subject of STUDY_SUBJECTS) {
        const item = subject.items.find((entry) => entry.id === itemId);
        if (item) return { subject, item };
    }
    return null;
}