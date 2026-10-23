/**
 * Fotos do álbum Selfies
 *
 * Mesmo formato do photos.js. A página de detalhe das selfies usa
 * <body data-photo-set="selfies"> para ler esta lista.
 */

const BASE = '/src/assets/gallery/selfies/';

export const SELFIE_PHOTOS = [
    {
        id: 'selfie',
        src: `${BASE}selfie.jpg`,
        title: 'Selfie',
        alt: 'Selfie de uma mulher sorrindo ao entardecer, com o sol iluminando o cabelo',
        datetime: '2024-08-18T18:24',
        location: 'Rio de Janeiro, Brasil',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/120s', iso: 'ISO 50' },
        favorite: true,
    },
    {
        id: 'persona',
        src: `${BASE}persona.png`,
        title: 'Selfie no parque',
        alt: 'Selfie sorrindo ao ar livre, com árvores ao fundo',
        datetime: '2024-08-16T16:05',
        location: 'Rio de Janeiro, Brasil',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/2.0', shutter: '1/250s', iso: 'ISO 64' },
    },
];