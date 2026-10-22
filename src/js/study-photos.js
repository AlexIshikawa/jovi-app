/**
 * Fotos da matéria Matemática (Modo Estudos)
 *
 * Mesmo formato do photos.js, com um campo a mais:
 * - text: o conteúdo da anotação em texto (usado em "Extrair texto desta imagem").
 */

const BASE = '/src/assets/estudos/';

export const STUDY_PHOTOS = [
    {
        id: 'caderno-trigo',
        src: `${BASE}estudos4.jpg`,
        title: 'Trigonometria',
        alt: 'Página de caderno com anotações de trigonometria: identidades, fórmulas, círculo trigonométrico e tabela de valores notáveis',
        datetime: '2024-10-10T14:32',
        location: 'Casa, São Paulo, Brasil',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/60s', iso: 'ISO 320' },
        ask: 'A Jovi analisa sua imagem e explica o conteúdo, resolve dúvidas e cria resumos personalizados.',
        favorite: true,
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
        id: 'quadro-funcoes',
        src: `${BASE}estudos2.jpg`,
        title: 'Aula de funções',
        alt: 'Quadro da sala de aula com a fórmula de Bhaskara e o gráfico de uma parábola',
        datetime: '2024-10-14T10:15',
        location: 'Escola, São Paulo, Brasil',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/120s', iso: 'ISO 200' },
        ask: 'Peça para a Jovi explicar a fórmula de Bhaskara passo a passo, com um exemplo resolvido.',
        favorite: true,
        text: `Função do 2º grau
f(x) = ax² + bx + c   (a ≠ 0)

Δ = b² − 4ac
x = (−b ± √Δ) / 2a

Vértice
xv = −b / 2a
yv = −Δ / 4a`,
    },
    {
        id: 'lista-funcoes',
        src: `${BASE}estudos3.jpg`,
        title: 'Lista de exercícios',
        alt: 'Folha impressa com exercícios de funções do 2º grau',
        datetime: '2024-10-14T15:40',
        location: 'Casa, São Paulo, Brasil',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/2.0', shutter: '1/100s', iso: 'ISO 250' },
        ask: 'A Jovi confere suas respostas e mostra onde está o erro em cada exercício.',
        text: `Lista 3 — Funções do 2º grau

1) Encontre as raízes de f(x) = x² − 5x + 6.
   Resposta: x = 2 e x = 3

2) Determine o vértice de f(x) = x² − 4x + 3.
   Resposta: V(2, −1)`,
    },
    {
        id: 'caderno-funcoes',
        src: `${BASE}estudos1.jpg`,
        title: 'Anotações de funções',
        alt: 'Caderno aberto com anotações sobre o gráfico da parábola',
        datetime: '2024-10-14T16:05',
        location: 'Casa, São Paulo, Brasil',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/80s', iso: 'ISO 320' },
        ask: 'Pergunte à Jovi como identificar a concavidade e o número de raízes só olhando a função.',
        text: `Gráfico da parábola

Concavidade
• a > 0: voltada para cima
• a < 0: voltada para baixo

Raízes reais
• Δ > 0: duas raízes diferentes
• Δ = 0: uma raiz (duas iguais)
• Δ < 0: nenhuma raiz real`,
    },
];