/**
 * Dados da galeria de viagens
 *
 * Fonte única para as 4 telas: lista de álbuns, álbum, detalhe da foto e IA Guia.
 * Para adicionar um álbum, inclua um objeto em TRAVEL_ALBUMS.
 * Para adicionar uma foto, inclua um objeto no "photos" do álbum.
 *
 * Campos do álbum:
 *  - id: usado no endereço (?album=rio-de-janeiro) — sem espaços nem acentos
 *  - title, icon (pin | leaf | pine | torii | columns | palm), cover (imagem da capa)
 *  - photos: lista de fotos (pode começar vazia)
 *  - totals (opcional): números de exibição enquanto as fotos ainda não foram cadastradas;
 *    quando o álbum tiver fotos, apague este campo e a contagem passa a ser automática
 *
 * Campos da foto:
 *  - id, src (caminho da imagem), title, alt (descrição para leitores de tela)
 *  - datetime ("AAAA-MM-DDTHH:MM"), location, camera, favorite, kind ("photo" | "video")
 *  - tags (opcional): palavras extras para a busca
 *  - ask: texto do card "Perguntar sobre esta imagem"
 *  - guide (opcional): conteúdo do IA Guia. Use **texto** para negrito.
 *      { place, paragraphs: ['...', '...'] }
 */

const RIO = '/src/assets/gallery/viagens/';

export const TRAVEL_ALBUMS = [
    {
        id: 'rio-de-janeiro',
        title: 'Rio de Janeiro',
        icon: 'pin',
        cover: `${RIO}cristo.jpg`,
        photos: [
            {
                id: 'cristo',
                src: `${RIO}cristo.jpg`,
                title: 'Cristo Redentor',
                alt: 'Cristo Redentor de braços abertos visto de baixo, com o céu azul ao fundo',
                datetime: '2024-08-18T18:24',
                location: 'Rio de Janeiro, Brasil',
                camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/1200s', iso: 'ISO 50' },
                tags: 'cristo redentor monumento corcovado',
                ask: 'Descubra a história do Cristo Redentor, curiosidades sobre a construção e o melhor horário para visitar.',
                favorite: true,
                guide: {
                    place: 'Rio de Janeiro, Brasil',
                    paragraphs: [
                        'Inaugurado em **12 de outubro de 1931**, no topo do Morro do Corcovado a 710m de altitude. Em estilo Art Déco, mede **38m de altura** e pesa **1.145 toneladas.** Projeto do engenheiro Heitor da Silva Costa e do escultor francês Paul Landowski.',
                        'Eleito uma das 7 Maravilhas do Mundo Moderno em 2007.',
                        'Melhor horário para visita: amanhecer ou pôr do sol.',
                    ],
                },
            },
            {
                id: 'pao-de-acucar',
                src: `${RIO}pao-de-acucar.jpg`,
                title: 'Pão de Açúcar',
                alt: 'Morro do Pão de Açúcar visto de longe, com o mar e o céu ao entardecer',
                datetime: '2024-08-18T16:10',
                location: 'Urca, Rio de Janeiro',
                camera: { model: 'JOVI X1', focal: '70mm', aperture: 'f/2.4', shutter: '1/800s', iso: 'ISO 64' },
                tags: 'pão de açúcar morro urca bondinho',
                ask: 'Saiba como funciona o bondinho, a altura dos morros e as trilhas da Urca.',
                guide: {
                    place: 'Urca, Rio de Janeiro',
                    paragraphs: [
                        'Com **396m de altura**, o Pão de Açúcar fica na entrada da Baía de Guanabara.',
                        'O bondinho foi inaugurado em **1912** e liga a Praia Vermelha ao Morro da Urca e, de lá, ao topo do Pão de Açúcar.',
                        'Melhor horário para visita: fim de tarde, para ver o pôr do sol sobre a cidade.',
                    ],
                },
            },
            {
                id: 'por-do-sol-praia-2',
                src: `${RIO}por-do-sol-praia-2.jpg`,
                title: 'Pôr do sol no Arpoador',
                alt: 'Pessoas na areia da praia contra o sol se pondo no horizonte',
                datetime: '2024-08-18T17:42',
                location: 'Arpoador, Rio de Janeiro',
                camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/2000s', iso: 'ISO 50' },
                tags: 'pôr do sol praia entardecer mar',
                ask: 'Descubra por que o pôr do sol do Arpoador é aplaudido pelos visitantes.',
                favorite: true,
            },
            {
                id: 'coqueiros',
                src: `${RIO}coqueiros.jpg`,
                title: 'Calçadão de Copacabana',
                alt: 'Coqueiros enfileirados no calçadão à beira-mar',
                datetime: '2024-08-18T10:05',
                location: 'Copacabana, Rio de Janeiro',
                camera: { model: 'JOVI X1', focal: '13mm', aperture: 'f/2.2', shutter: '1/1600s', iso: 'ISO 50' },
                tags: 'coqueiros palmeiras árvores natureza calçadão',
                ask: 'Conheça a história do calçadão de ondas e os quiosques mais famosos da orla.',
            },
            {
                id: 'por-do-sol-praia',
                src: `${RIO}por-do-sol-praia.jpg`,
                title: 'Fim de tarde em Ipanema',
                alt: 'Vídeo do sol se pondo atrás dos morros, visto da praia',
                datetime: '2024-08-17T17:38',
                location: 'Ipanema, Rio de Janeiro',
                camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '4K • 60fps', iso: 'ISO 100' },
                tags: 'pôr do sol praia entardecer mar',
                ask: 'Veja quais morros aparecem no horizonte e os melhores pontos para assistir ao pôr do sol.',
                kind: 'video',
            },
            {
                id: 'coco',
                src: `${RIO}coco.jpg`,
                title: 'Água de coco',
                alt: 'Coco verde com canudo sobre uma mesa, com a praia ao fundo',
                datetime: '2024-08-17T15:20',
                location: 'Leblon, Rio de Janeiro',
                camera: { model: 'JOVI X1', focal: '50mm', aperture: 'f/1.6', shutter: '1/500s', iso: 'ISO 80' },
                tags: 'coco água de coco bebida',
                ask: 'Descubra curiosidades sobre os quiosques e os sabores típicos da praia carioca.',
            },
        ],
    },
    {
        id: 'canada',
        title: 'Canadá',
        icon: 'leaf',
        cover: '/src/assets/gallery/viagens/canada/canada1.jpg',
        totals: { photos: 186, videos: 18 },
        photos: [],
    },
    {
        id: 'campos-do-jordao',
        title: 'Campos do Jordão',
        icon: 'pine',
        cover: '/src/assets/gallery/viagens/campos/campos.jpg',
        totals: { photos: 96, videos: 8 },
        photos: [],
    },
    {
        id: 'japao',
        title: 'Japão',
        icon: 'torii',
        cover: '/src/assets/gallery/viagens/japao/japao.jpg',
        totals: { photos: 210, videos: 26 },
        photos: [],
    },
    {
        id: 'europa',
        title: 'Europa',
        icon: 'columns',
        cover: '/src/assets/gallery/viagens/europa/europa.jpg',
        totals: { photos: 124, videos: 10 },
        photos: [],
    },
    {
        id: 'tailandia',
        title: 'Tailândia',
        icon: 'palm',
        cover: '/src/assets/gallery/viagens/tailandia/tailandia.jpg',
        totals: { photos: 96, videos: 14 },
        photos: [],
    },
];

// Busca um álbum pelo id; sem id ou id desconhecido, devolve o primeiro
export function getAlbum(id) {
    return TRAVEL_ALBUMS.find((album) => album.id === id) ?? TRAVEL_ALBUMS[0];
}

// Contagem do álbum: usa "totals" se existir; senão, conta as fotos cadastradas
export function getAlbumTotals(album) {
    if (album.totals) return album.totals;
    const videos = album.photos.filter((photo) => photo.kind === 'video').length;
    return { photos: album.photos.length - videos, videos };
}

// Procura uma foto pelo id em todos os álbuns: devolve { album, photo } ou null
export function findPhoto(photoId) {
    for (const album of TRAVEL_ALBUMS) {
        const photo = album.photos.find((item) => item.id === photoId);
        if (photo) return { album, photo };
    }
    return null;
}