/**
 * Fotos do álbum Rio de Janeiro
 *
 * Fonte única dos dados: a página de detalhe (/foto/?foto=ID) lê daqui
 * o título, a data, o local, os dados da câmera e as descrições de cada foto.
 * Para adicionar uma foto, basta incluir um novo objeto na lista.
 * A ordem da lista é a ordem do "anterior / próxima" e do contador "1 / 6".
 */

const BASE = '/src/assets/gallery/viagens/';

export const PHOTOS = [
    {
        id: 'cristo',
        src: `${BASE}cristo.jpg`,
        title: 'Cristo Redentor',
        alt: 'Cristo Redentor de braços abertos ao pôr do sol, com a baía de Guanabara ao fundo',
        datetime: '2024-08-18T18:24',
        location: 'Rio de Janeiro, Brasil',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/1200s', iso: 'ISO 50' },
        ask: 'Descubra a história do Cristo Redentor, curiosidades sobre a construção e o melhor horário para visitar.',
        askHref: '/modo-viagem/ia-guia/index.html',
        favorite: true,
    },
    {
        id: 'pao-de-acucar',
        src: `${BASE}pao-de-acucar.jpg`,
        title: 'Pão de Açúcar',
        alt: 'Morro do Pão de Açúcar visto de longe, com o mar e o céu ao entardecer',
        datetime: '2024-08-18T16:10',
        location: 'Urca, Rio de Janeiro',
        camera: { model: 'JOVI X1', focal: '70mm', aperture: 'f/2.4', shutter: '1/800s', iso: 'ISO 64' },
        ask: 'Saiba como funciona o bondinho, a altura dos morros e as trilhas da Urca.',
    },
    {
        id: 'por-do-sol-praia-2',
        src: `${BASE}por-do-sol-praia-2.jpg`,
        title: 'Pôr do sol no Arpoador',
        alt: 'Pessoas na areia da praia contra o sol se pondo no horizonte',
        datetime: '2024-08-18T17:42',
        location: 'Arpoador, Rio de Janeiro',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/2000s', iso: 'ISO 50' },
        ask: 'Descubra por que o pôr do sol do Arpoador é aplaudido pelos visitantes.',
        favorite: true,
    },
    {
        id: 'coqueiros',
        src: `${BASE}coqueiros.jpg`,
        title: 'Calçadão de Copacabana',
        alt: 'Coqueiros enfileirados no calçadão à beira-mar',
        datetime: '2024-08-18T10:05',
        location: 'Copacabana, Rio de Janeiro',
        camera: { model: 'JOVI X1', focal: '13mm', aperture: 'f/2.2', shutter: '1/1600s', iso: 'ISO 50' },
        ask: 'Conheça a história do calçadão de ondas e os quiosques mais famosos da orla.',
    },
    {
        id: 'por-do-sol-praia',
        src: `${BASE}por-do-sol-praia.jpg`,
        title: 'Fim de tarde em Ipanema',
        alt: 'Vídeo do sol se pondo atrás dos morros, visto da praia',
        datetime: '2024-08-17T17:38',
        location: 'Ipanema, Rio de Janeiro',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '4K • 60fps', iso: 'ISO 100' },
        ask: 'Veja quais morros aparecem no horizonte e os melhores pontos para assistir ao pôr do sol.',
        kind: 'video',
    },
    {
        id: 'coco',
        src: `${BASE}coco.jpg`,
        title: 'Água de coco',
        alt: 'Coco verde com canudo sobre uma mesa, com a praia ao fundo',
        datetime: '2024-08-17T15:20',
        location: 'Leblon, Rio de Janeiro',
        camera: { model: 'JOVI X1', focal: '50mm', aperture: 'f/1.6', shutter: '1/500s', iso: 'ISO 80' },
        ask: 'Descubra curiosidades sobre os quiosques e os sabores típicos da praia carioca.',
    },
];