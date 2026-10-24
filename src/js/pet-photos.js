/**
 * Fotos do álbum do pet (Tobias)
 *
 * Mesmo formato do selfie-photos.js, com dois campos próprios de pet:
 *  - kind: momento da foto, usado nos filtros do álbum ("brincando" | "passeio" | "soneca")
 *  - mood: o mesmo momento escrito para exibição no detalhe ("Brincando", "Passeio"...)
 *
 * Ajuste título e alt para descrever o que aparece em cada foto.
 */

const BASE = '/src/assets/gallery/pets/';

export const PET = {
    name: 'Tobias',
    cover: `${BASE}tobias.jpg`,
};

export const PET_PHOTOS = [
    {
        id: 'tobias',
        src: `${BASE}tobias.jpg`,
        title: 'Retrato do Tobias',
        alt: 'Foto do Tobias olhando para a câmera',
        datetime: '2024-09-21T10:12',
        location: 'Casa, São Paulo, Brasil',
        camera: { model: 'JOVI X1', focal: '50mm', aperture: 'f/1.8', shutter: '1/500s', iso: 'ISO 100' },
        kind: 'brincando',
        mood: 'Brincando',
        favorite: true,
    },
    {
        id: 'tobias1',
        src: `${BASE}tobias1.jpg`,
        title: 'Hora de brincar',
        alt: 'Foto do Tobias brincando',
        datetime: '2024-09-21T16:40',
        location: 'Casa, São Paulo, Brasil',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/1.8', shutter: '1/1000s', iso: 'ISO 200' },
        kind: 'brincando',
        mood: 'Brincando',
    },
    {
        id: 'tobias2',
        src: `${BASE}tobias2.jpg`,
        title: 'Passeio no parque',
        alt: 'Foto do Tobias em um passeio ao ar livre',
        datetime: '2024-09-14T08:25',
        location: 'Parque Ibirapuera, São Paulo',
        camera: { model: 'JOVI X1', focal: '24mm', aperture: 'f/2.0', shutter: '1/800s', iso: 'ISO 64' },
        kind: 'passeio',
        mood: 'Passeio',
        favorite: true,
    },
    {
        id: 'tobias3',
        src: `${BASE}tobias3.jpg`,
        title: 'Soneca da tarde',
        alt: 'Foto do Tobias descansando',
        datetime: '2024-09-14T15:05',
        location: 'Casa, São Paulo, Brasil',
        camera: { model: 'JOVI X1', focal: '50mm', aperture: 'f/1.8', shutter: '1/125s', iso: 'ISO 320' },
        kind: 'soneca',
        mood: 'Soneca',
    },
    {
        id: 'tobias4',
        src: `${BASE}tobias4.jpg`,
        title: 'Olhar pidão',
        alt: 'Foto do Tobias olhando de perto',
        datetime: '2024-09-07T19:30',
        location: 'Casa, São Paulo, Brasil',
        camera: { model: 'JOVI X1', focal: '50mm', aperture: 'f/1.6', shutter: '1/250s', iso: 'ISO 400' },
        kind: 'soneca',
        mood: 'Soneca',
    },
];