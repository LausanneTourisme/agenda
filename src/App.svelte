<svelte:options
        customElement="{{
		tag: 'swc-lt-agenda'
	}}"
/>
<script lang="ts">
    import Highlights from "$lib/composables/Highlights.svelte";
    import {getLocaleFromNavigator, init, isLoading, locale, locales, register} from 'svelte-i18n';
    import type {Event, History, RawDate} from "$lib/types";
    import Loader from "$lib/components/Loader.svelte";
    import {randomNumber, randomString} from "$lib/utils";
    import {randomDate, sortEvents} from "$lib/date-utils";
    import moment from "moment/moment";
    import Agenda from "$lib/composables/Agenda.svelte";
    import {createEventDispatcher} from "svelte";
    //trick to bypass problem with tailwind and shadow dom
    function applyStyling(divElement: HTMLElement | undefined) {
        if (!divElement) return;
        const template = document.getElementById("swc-lt-agenda-styling");

        if (!template?.content) return;
        const node = document.importNode(template.content, true);
        divElement?.parentNode?.appendChild(node);
    }

    let divElement: HTMLElement | undefined;
    $: applyStyling(divElement);

    register('fr', () => import('$lib/i18n/fr.json'));
    register('en', () => import('$lib/i18n/en.json'));
    register('de', () => import('$lib/i18n/de.json'));

    init({
        fallbackLocale: 'en',
        initialLocale: getLocaleFromNavigator()?.slice(0, 2) ?? 'en',
    });


    const dispatch = createEventDispatcher();

    export let highlightTitle: string | null | undefined = $$props['highlight-title'];
    export let agendaTitle: string | null | undefined = $$props['agenda-title'];

    const history: History = {
        highlights: {
            hasMore: true,
            page: 0,
        },
        events: {
            hasMore: true,
            page: 0,
        }
    };

    const events: Event[] = [
        {
            id: 1,
            name: {
                fr: `Un texte beaucoup trop long pour être lu en une seule et unique ligne, mais tant mieux!`,
                en: `A text too long to be read in a single and unique line, but that's all we want!`,
                de: `Der Text ist viel zu lang, um ihn in einer einzigen Zeile zu lesen, aber das ist auch gut so!`,
            },
            seo: {
                name: {
                    fr: `Un texte beaucoup trop long pour être lu en une seule et unique ligne, mais tant mieux!`,
                    en: `A text too long to be read in a single and unique line, but that's all we want!`,
                    de: `Der Text ist viel zu lang, um ihn in einer einzigen Zeile zu lesen, aber das ist auch gut so!`,
                },
                hreflang: {
                    fr: "/fr/evenement/un-texte-beaucoup-trop-long-pour-etre-lu-en-une-seule-et-unique-ligne-mais-tant-mieux",
                    en: "/en/event/a-text-too-long-to-be-read-in-a-single-and-unique-line-but-thats-all-we-want",
                    de: "/de/veranstaltung/der-text-ist-viel-zu-lang-um-ihn-in-einer-einzigen-zeile-zu-lesen-aber-das-ist-auch-gut-so"
                },
                description: {
                    fr: "Une moto",
                    en: "Ein Motorrad",
                    de: "A Motorcycle",
                },
                medias: [],
                noindex: false,
                slug: {
                    fr: `un-texte-beaucoup-trop-long-pour-etre-lu-en-une-seule-et-unique-ligne-mais-tant-mieux`,
                    en: `a-text-too-long-to-be-read-in-a-single-and-unique-line-but-thats-all-we-want`,
                    de: `der-text-ist-viel-zu-lang-um-ihn-in-einer-einzigen-zeile-zu-lesen-aber-das-ist-auch-gut-so`,
                },
            },
            highlight: true,
            categories: [
                {
                    name: "vehicles",
                    public_name: {
                        fr: "Véhicules",
                        en: "Vehicles",
                        de: "Fahrzeuge",
                    },
                    main_category: true
                },
            ],
            tags: [
                {
                    name: "moto",
                    public_name: {
                        fr: "Moto",
                        en: "Motorrad",
                        de: "Motorcycle",
                    }
                },
            ],
            medias: [
                {
                    is_cover: true,
                    is_in_gallery: true,
                    cloudinary_id: "woman.jpg",
                    original_width: 3000,
                    copyright: `© ${randomString()}`
                }
            ],
            schedules: {
                dates: [
                    {
                        label: null,
                        every_year: "false",
                        open_days: [
                            "tue",
                            "wed",
                            "thu",
                            "fri",
                            "sat"
                        ],
                        week: [
                            {
                                days: [
                                    "tue",
                                    "wed",
                                    "thu",
                                    "fri"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:30",
                                        end: "18:30"
                                    }
                                ]
                            },
                            {
                                days: [
                                    "sat"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:00",
                                        end: "17:00"
                                    }
                                ]
                            }
                        ],
                        periods: [
                            {
                                start: "2024-01-12",
                                end: "2024-06-12"
                            }
                        ]
                    }
                ],
                exceptions: {
                    range: {
                        from: "2024-01-12",
                        to: "2024-06-12",
                    },
                    dates: []
                }
            },
            geolocations: [
                {
                    zip: "1006",
                    city: "Lausanne",
                    venue: "Boulevard de Grancy",
                    address: "",
                    address_2: null,
                    main_address: true,
                    elevation: null,
                    longitude: "6.62919774",
                    latitude: "46.51534478"
                }
            ]
        },
        {
            id: 2,
            name: {
                fr: "Exposition des pâtes",
                en: "Pasta exhibition",
                de: "Ausstellung von Nudeln",
            },
            highlight: false,
            categories: [
                {
                    name: "Expositions",
                    public_name: {
                        fr: "Expositions",
                        en: "Expositions",
                        de: "Expositions",
                    },
                    main_category: true
                },
            ],
            tags: [
                {
                    name: "Exposition",
                    public_name: {
                        fr: "Expositions",
                        en: "Expositions",
                        de: "Expositions",
                    },
                },
                {
                    name: "Gastronomie",
                    public_name: {
                        fr: "Gastronomie",
                        en: "Gastronomic",
                        de: "Gastronomie",
                    },
                }
            ],
            medias: [
                {
                    is_cover: true,
                    is_in_gallery: true,
                    cloudinary_id: "woman.jpg",
                    original_width: 3000,
                    copyright: "© "
                }
            ],
            seo: {
                name: {
                    fr: "Exposition des pâtes",
                    en: "Pasta exhibition",
                    de: "Ausstellung von Nudeln",
                },
                description: {
                    fr: "Venez découvrir toute l'histoire des pâtes de son origine à sa conception et aussi toutes les pâtes existantes dans le monde !",
                    en: "Come and discover the history of pasta, from its origins to its conception, as well as all the different types of pasta in the world!",
                    de: "Entdecken Sie die ganze Geschichte der Nudeln von ihrem Ursprung bis zu ihrem Design und auch alle Nudeln, die es auf der Welt gibt!",
                },
                medias: [],
                noindex: false,
                slug: {
                    fr: "exposition-des-pates",
                    en: "pasta-exhibition",
                    de: "ausstellung-von-nudeln",
                },
                hreflang: {
                    fr: "/fr/evenement/exposition-des-pates",
                    en: "/en/event/pasta-exhibition",
                    de: "/de/veranstaltung/ausstellung-von-nudeln"
                },
            },
            schedules: {
                dates: [
                    {
                        label: null,
                        every_year: "false",
                        open_days: [
                            "tue",
                            "wed",
                            "thu",
                            "sat"
                        ],
                        week: [
                            {
                                days: [
                                    "tue",
                                    "wed",
                                    "thu",
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:30",
                                        end: "18:30"
                                    }
                                ]
                            },
                            {
                                days: [
                                    "sat"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:00",
                                        end: "17:00"
                                    }
                                ]
                            }
                        ],
                        periods: [
                            {
                                "start": "2024-01-01",
                                "end": "2024-03-26"
                            },
                            {
                                "start": "2025-03-01",
                                "end": "2025-03-31"
                            },
                            {
                                "start": "2025-04-01",
                                "end": "2025-04-01"
                            }
                        ]
                    }
                ],
                exceptions: {
                    range: {
                        from: "2024-01-01",
                        to: "2025-04-01"
                    },
                    dates: []
                }
            },
            geolocations: [
                {
                    zip: "1004",
                    city: "Lausanne",
                    venue: "Théâtre de Beaulieu",
                    address: "Avenue des Bergières 10",
                    address_2: null,
                    main_address: true,
                    elevation: null,
                    longitude: "6.6179",
                    latitude: "46.531"
                }
            ],
        },
        {
            id: 4,
            name: {
                fr: "Exposition de pinceaux volants",
                en: "Flying brush exhibition",
                de: "Ausstellung Fliegender Pinsel",
            },
            seo: {
                name: {
                    fr: "Exposition de pinceaux volants",
                    en: "Flying brush exhibition",
                    de: "Ausstellung Fliegender Pinsel",
                },
                description: {
                    fr: "Qui n'a jamais souhaité découvrir la décomposition ddes différentes pâtes existantes dans le monde ?",
                    en: "Who hasn't wanted to find out how the world's different pasta products break down?",
                    de: "Wer wollte nicht schon immer einmal wissen, wie die verschiedenen Teigwaren der Welt zerlegt werden?",
                },
                medias: [],
                noindex: false,
                slug: {
                    fr: "exposition-de-pinceaux-volants",
                    en: "flying-brush-exhibition",
                    de: "ausstellung-fliegender-pinsel",
                },
                hreflang: {
                    fr: "/fr/evenement/exposition-de-pinceaux-volants",
                    en: "/en/event/flying-brush-exhibition",
                    de: "/de/veranstaltung/ausstellung-fliegender-pinsel",
                },
            },
            highlight: false,
            categories: [
                {
                    name: "Expositions",
                    public_name: {
                        fr: "Expositions",
                        en: "Expositions",
                        de: "Expositions",
                    },
                    main_category: true
                },
            ],
            tags: [
                {
                    name: "Exposition",
                    public_name: {
                        fr: "Expositions",
                        en: "Expositions",
                        de: "Expositions",
                    },
                },
                {
                    name: "Gastronomie",
                    public_name: {
                        fr: "Gastronomie",
                        en: "Gastronomic",
                        de: "Gastronomie",
                    },
                }
            ],
            medias: [
                {
                    is_cover: true,
                    is_in_gallery: true,
                    cloudinary_id: "woman.jpg",
                    original_width: 3000,
                    copyright: "© "
                }
            ],
            schedules: {
                dates: [
                    {
                        label: null,
                        every_year: "false",
                        open_days: [
                            "tue",
                            "wed",
                            "thu",
                            "fri",
                            "sat"
                        ],
                        week: [
                            {
                                days: [
                                    "tue",
                                    "wed",
                                    "thu",
                                    "fri"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:30",
                                        end: "18:30"
                                    }
                                ]
                            },
                            {
                                days: [
                                    "sat"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:00",
                                        end: "17:00"
                                    }
                                ]
                            }
                        ],
                        periods: [
                            {
                                "start": "2022-01-01",
                                "end": "2022-12-31"
                            },
                            {
                                "start": "2024-03-01",
                                "end": "2024-03-31"
                            },
                            {
                                "start": "2024-04-01",
                                "end": "2024-04-01"
                            }
                        ]
                    }
                ],
                exceptions: {
                    range: {
                        from: "2023-01-01",
                        to: "2024-04-01"
                    },
                    dates: []
                }
            },
            geolocations: [
                {
                    zip: "1005",
                    city: "Lausanne",
                    venue: "Musée cantonal d'archéologie et d'histoire",
                    address: "Palais de Rumine",
                    address_2: null,
                    main_address: true,
                    elevation: "514.418457",
                    longitude: "6.63411",
                    latitude: "46.5239"
                }
            ]
        },
        {
            id: 5,
            name: {
                fr: "Rock & Roll dans la cité avec toutes les grandes starts des années 80, le tout gratuitement profitez !",
                en: "Rock & Roll in the city with all the big 80s hits, all free of charge!",
                de: "Rock & Roll in der Stadt mit allen großen Stars der 80er Jahre, alles kostenlos genießen!",
            },
            seo: {
                name: {
                    fr: "Rock & Roll dans la cité avec toutes les grandes starts des années 80, le tout gratuitement profitez !",
                    en: "Rock & Roll in the city with all the big 80s hits, all free of charge!",
                    de: "Rock & Roll in der Stadt mit allen großen Stars der 80er Jahre, alles kostenlos genießen!",
                },
                description: {
                    fr: "Cette année tous les jours au sein de la ville vous entendrez les plus grands Hits des plus grandes starts des années 80 et ce gratuitement !",
                    en: "This year, every day in the heart of the city, you'll hear the greatest hits from the biggest stars of the '80s - for free!",
                    de: "Dieses Jahr werden Sie jeden Tag in der Stadt die größten Hits der größten Stars der 80er Jahre hören - und das kostenlos!",
                },
                medias: [],
                noindex: false,
                slug: {
                    fr: "rock-and-roll-dans-la-cite-avec-toutes-les-grandes-starts-des-annees-80-le-tout-gratuitement-profitez",
                    en: "rock-and-roll-in-the-city-with-all-the-big-80s-hits-all-free-of-charge",
                    de: "rock-and-roll-in-der-stadt-mit-allen-grossen-stars-der-80er-jahre-alles-kostenlos-geniessen",
                },
                hreflang: {
                    fr: "/fr/evenement/rock-and-roll-dans-la-cite-avec-toutes-les-grandes-starts-des-annees-80-le-tout-gratuitement-profitez",
                    en: "/en/event/rock-and-roll-in-the-city-with-all-the-big-80s-hits-all-free-of-charge",
                    de: "/de/veranstaltung/rock-and-roll-in-der-stadt-mit-allen-grossen-stars-der-80er-jahre-alles-kostenlos-geniessen",
                },
            },
            highlight: false,
            categories: [
                {
                    name: "Music",
                    public_name: {
                        fr: "Musique",
                        en: "Music",
                        de: "Musik",
                    },
                    main_category: true
                },
            ],
            tags: [
                {
                    name: "Musique",
                    public_name: {
                        fr: "Musique",
                        en: "Music",
                        de: "Musik",
                    }
                },
                {
                    name: "Nuit",
                    public_name: {
                        fr: "Nuit",
                        en: "Night",
                        de: "Nuit",
                    }
                }
            ],
            medias: [
                {
                    is_cover: true,
                    is_in_gallery: true,
                    cloudinary_id: "woman.jpg",
                    original_width: 3000,
                    copyright: "© "
                }
            ],
            schedules: {
                dates: [
                    {
                        label: null,
                        every_year: "false",
                        open_days: [
                            "tue",
                            "wed",
                            "thu",
                            "fri",
                            "sat"
                        ],
                        week: [
                            {
                                days: [
                                    "tue",
                                    "wed",
                                    "thu",
                                    "fri"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:30",
                                        end: "18:30"
                                    }
                                ]
                            },
                            {
                                days: [
                                    "sat"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:00",
                                        end: "17:00"
                                    }
                                ]
                            }
                        ],
                        periods: [
                            {
                                start: "2024-01-01",
                                end: "2024-12-31"
                            }
                        ]
                    }
                ],
                exceptions: {
                    range: {
                        from: "2024-01-01",
                        to: "2024-12-31"
                    },
                    dates: []
                }
            },
            geolocations: [
                {
                    zip: "1009",
                    city: "Pully",
                    venue: "L’ArchéoLab",
                    address: "Avenue du Prieuré 4",
                    address_2: null,
                    main_address: true,
                    elevation: null,
                    longitude: "6.6618",
                    latitude: "46.51012"
                }
            ]
        },
        {
            id: 9,
            name: {
                fr: "Visite de Macron",
                en: "Macron's visit",
                de: "Besuch von Macron",
            },

            seo: {
                name: {
                    fr: "Visite de Macron",
                    en: "Macron's visit",
                    de: "Besuch von Macron",
                },
                description: {
                    fr: "Visite de Macron",
                    en: "Macron's visit",
                    de: "Besuch von Macron",
                },
                medias: [],
                noindex: false,
                slug: {
                    fr: "visite-de-macron",
                    en: "macron-s-visit",
                    de: "besuch-von-macron",
                },
                hreflang: {
                    fr: "/fr/evenement/visite-de-macron",
                    en: "/en/event/macron-s-visit",
                    de: "/de/veranstaltung/besuch-von-macron",
                },
            },
            highlight: false,
            categories: [
                {
                    name: "Politic",
                    public_name: {
                        fr: "Politique",
                        en: "Politic",
                        de: "Politique",
                    },
                    main_category: true
                },
            ],
            tags: [
                {
                    name: "Politique",
                    public_name: {
                        fr: "Politique",
                        en: "Politic",
                        de: "Politique",
                    }
                },
                {
                    name: "Ephémère",
                    public_name: {
                        fr: "Ephémère",
                        en: "Ephemeral",
                        de: "Vergänglich",
                    }
                }
            ],
            medias: [
                {
                    is_cover: true,
                    is_in_gallery: true,
                    cloudinary_id: "woman.jpg",
                    original_width: 3000,
                    copyright: "© "
                }
            ],
            schedules: {
                dates: [
                    {
                        label: null,
                        every_year: "false",
                        open_days: [
                            "tue",
                            "wed",
                            "thu",
                            "fri",
                            "sat"
                        ],
                        week: [
                            {
                                days: [
                                    "tue",
                                    "wed",
                                    "thu",
                                    "fri"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:30",
                                        end: "18:30"
                                    }
                                ]
                            },
                            {
                                days: [
                                    "sat"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:00",
                                        end: "17:00"
                                    }
                                ]
                            }
                        ],
                        periods: [
                            {
                                start: "2024-01-01",
                                end: "2024-12-31"
                            }
                        ]
                    }
                ],
                exceptions: {
                    range: {
                        from: "2024-01-01",
                        to: "2024-12-31"
                    },
                    dates: []
                }
            },
            geolocations: [
                {
                    zip: "1010",
                    city: "Lausanne",
                    venue: "Place de la Sallaz",
                    address: "",
                    address_2: null,
                    main_address: true,
                    elevation: null,
                    longitude: "6.6465636",
                    latitude: "46.53274749"
                }
            ]
        },
        {
            id: 3,
            name: {
                fr: "Festival aquatique",
                en: "Festival aquatique",
                de: "Festival aquatique",
            },
            seo: {
                name: {
                    fr: "Festival aquatique",
                    en: "Aquatic festival",
                    de: "Wasserfestival",
                },
                description: {
                    fr: "C'est l'été, il fait chaud, il est grand temps de profiter de la saison pour se raffraîchir !",
                    en: "It's summer, it's hot, it's time to take advantage of the season to cool off!",
                    de: "Es ist Sommer, es ist heiß, es ist höchste Zeit, die Jahreszeit für eine Erfrischung zu nutzen!",
                },
                medias: [],
                noindex: false,
                slug: {
                    fr: "festival-aquatique",
                    en: "aquatic-festival",
                    de: "wasserfestival",
                },
                hreflang: {
                    fr: "/fr/evenement/festival-aquatique",
                    en: "/en/event/aquatic-festival",
                    de: "/de/veranstaltung/wasserfestival",
                },
            },
            highlight: false,
            categories: [
                {
                    name: "Festival",
                    public_name: {
                        fr: "Festival",
                        en: "Festival",
                        de: "Festival",
                    },
                    main_category: true
                },
            ],
            tags: [
                {
                    name: "Festival",
                    public_name: {
                        fr: "Festival",
                        en: "Festival",
                        de: "Festival",
                    }
                },
                {
                    name: "Aquatique",
                    public_name: {
                        fr: "Aquatique",
                        en: "Aquatic",
                        de: "Aquatique",
                    }
                },
                {
                    name: "Lac",
                    public_name: {
                        fr: "Lac",
                        en: "Lac",
                        de: "Lac",
                    }
                },
                {
                    name: "Musique",
                    public_name: {
                        fr: "Musique",
                        en: "Music",
                        de: "Musik",
                    }
                },
            ],
            medias: [
                {
                    is_cover: true,
                    is_in_gallery: true,
                    cloudinary_id: "woman.jpg",
                    original_width: 3000,
                    copyright: "© "
                }
            ],
            schedules: {
                dates: [
                    {
                        label: null,
                        every_year: "false",
                        open_days: [
                            "tue",
                            "wed",
                            "thu",
                            "fri",
                            "sat"
                        ],
                        week: [
                            {
                                days: [
                                    "tue",
                                    "wed",
                                    "thu",
                                    "fri"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:30",
                                        end: "18:30"
                                    }
                                ]
                            },
                            {
                                days: [
                                    "sat"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:00",
                                        end: "17:00"
                                    }
                                ]
                            }
                        ],
                        periods: [
                            {
                                start: "2024-01-01",
                                end: "2024-12-31"
                            }
                        ]
                    }
                ],
                exceptions: {
                    range: {
                        from: "2024-01-01",
                        to: "2024-12-31"
                    },
                    dates: []
                }
            },
            geolocations: [
                {
                    zip: "1006",
                    city: "Lausanne",
                    venue: "Boulevard de Grancy",
                    address: "",
                    address_2: null,
                    main_address: true,
                    elevation: null,
                    longitude: "6.62919774",
                    latitude: "46.51534478"
                }
            ]
        },
    ];

    //Add HIGHLIGHTS
    for (let i = 1; i < 13; i++) {
        const start = randomDate(moment().subtract(2, "weeks"), moment().add(2, "weeks"))
        const end = moment(start).add(randomNumber(1, 10), randomNumber(0, 1) ? "days" : "weeks");

        events.push({
            id: 10 + i,
            name: {
                fr: `Moto #${i.toString().padStart(2, '0')}`,
                en: `Moto #${i.toString().padStart(2, '0')}`,
                de: `Moto #${i.toString().padStart(2, '0')}`,
            },
            seo: {
                name: {
                    fr: `Moto #${i.toString().padStart(2, '0')}`,
                    en: `Moto #${i.toString().padStart(2, '0')}`,
                    de: `Moto #${i.toString().padStart(2, '0')}`,
                },
                description: {
                    fr: "Une moto",
                    en: "Ein Motorrad",
                    de: "A Motorcycle",
                },
                medias: [],
                noindex: false,
                slug: {
                    fr: `moto-${i.toString().padStart(2, '0')}`,
                    en: `moto-${i.toString().padStart(2, '0')}`,
                    de: `moto-${i.toString().padStart(2, '0')}`,
                },
                hreflang: {
                    fr: `/fr/evenement/moto-${i.toString().padStart(2, '0')}`,
                    en: `/en/event/moto-${i.toString().padStart(2, '0')}`,
                    de: `/de/veranstaltung/moto-${i.toString().padStart(2, '0')}`,
                },
            },
            highlight: true,
            categories: [
                {
                    name: "vehicles",
                    public_name: {
                        fr: "Véhicules",
                        en: "Vehicles",
                        de: "Fahrzeuge",
                    },
                    main_category: true
                },
            ],
            tags: [
                {
                    name: "moto",
                    public_name: {
                        fr: "Moto",
                        en: "Motorrad",
                        de: "Motorcycle",
                    }
                },
            ],
            medias: [
                {
                    is_cover: true,
                    is_in_gallery: true,
                    cloudinary_id: "woman.jpg",
                    original_width: 3000,
                    copyright: `© ${randomString()}`
                }
            ],
            schedules: {
                dates: [
                    {
                        label: null,
                        every_year: "false",
                        open_days: [
                            "tue",
                            "wed",
                            "thu",
                            "fri",
                            "sat"
                        ],
                        week: [
                            {
                                days: [
                                    "tue",
                                    "wed",
                                    "thu",
                                    "fri"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:30",
                                        end: "18:30"
                                    }
                                ]
                            },
                            {
                                days: [
                                    "sat"
                                ],
                                times: [
                                    {
                                        start: "09:00",
                                        end: "12:30"
                                    },
                                    {
                                        start: "13:00",
                                        end: "17:00"
                                    }
                                ]
                            }
                        ],
                        periods: [
                            {
                                start: start.format('YYYY-MM-DD') as RawDate,
                                end: end.format('YYYY-MM-DD') as RawDate
                            }
                        ]
                    }
                ],
                exceptions: {
                    range: {
                        from: start.format('YYYY-MM-DD') as RawDate,
                        to: end.format('YYYY-MM-DD') as RawDate,
                    },
                    dates: []
                }
            },
            geolocations: [
                {
                    zip: "1006",
                    city: "Lausanne",
                    venue: "Boulevard de Grancy",
                    address: "",
                    address_2: null,
                    main_address: true,
                    elevation: null,
                    longitude: "6.62919774",
                    latitude: "46.51534478"
                }
            ]
        });
    }
    //TODO get callback to call external api by passing {get_events/get_highlights, page: X}
</script>

<main bind:this={divElement}>
    {#if $isLoading}
        <Loader/>
    {:else}
        <div class="lang-changer w-full flex justify-center fixed">
            <select bind:value={$locale}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/12 p-2.5">
                {#each $locales as locale}
                    <option value={locale}>{locale}</option>
                {/each}
            </select>
        </div>
        <Highlights title={highlightTitle}
                    onLoad="{async () => sortEvents(events, {onlyHighlights: true, onlyAvailable: true})}"
                    historyStatus="{history.highlights}"/>
        <div class="md:px-7">
            <Agenda title="{agendaTitle}" events={sortEvents(events)} historyStatus="{history.events}" on:loadMore="{(e) => {
                console.log('dispatch loadMore !')

                e.detail.event.target.dispatchEvent(new CustomEvent('refresh', {detail: {getEvents: true, currentPage: history.events.page}, composed: true }))
                dispatch('getEvents',{getEvents: true, currentPage: history.events.page})}
            }"/>
        </div>
    {/if}
</main>

<style>
    .lang-changer {
        z-index: 999;
    }
</style>
