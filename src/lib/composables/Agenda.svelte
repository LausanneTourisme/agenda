<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import DateRangePicker from "$lib/components/DateRangePicker.svelte";
    import {Calendar} from "lucide-svelte";
    import {_} from "svelte-i18n";
    import EventCard from "$lib/components/EventCard.svelte";
    import type {Event} from "$lib/types";

    export let events: Event[] =
        [
            {
                name: "Exposition des pâtes",
                highlight: false,
                categories: [
                    {
                        name: "Expositions",
                        public_name: "Expositions",
                        main_category: true
                    },
                ],
                tags: [
                    {
                        name: "Exposition",
                        public_name: "Exposition"
                    },
                    {
                        name: "Gastronomie",
                        public_name: "Gastronomie"
                    }
                ],
                medias: [
                    {
                        is_cover: true,
                        is_in_gallery: true,
                        cloudinary_id: "owjt989rixv1os3ocvdh",
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
                                    "start": "2024-01-01",
                                    "end": "2024-12-31"
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
                            to: "2024-12-31"
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
                name: "Exposition des pâtes périmées",
                highlight: false,
                categories: [
                    {
                        name: "Expositions",
                        public_name: "Expositions",
                        main_category: true
                    },
                ],
                tags: [
                    {
                        name: "Exposition",
                        public_name: "Exposition"
                    },
                    {
                        name: "Gastronomie",
                        public_name: "Gastronomie"
                    }
                ],
                medias: [
                    {
                        is_cover: true,
                        is_in_gallery: true,
                        cloudinary_id: "owjt989rixv1os3ocvdh",
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
                                    "start": "2023-03-01",
                                    "end": "2023-03-31"
                                },
                                {
                                    "start": "2023-04-01",
                                    "end": "2023-04-01"
                                }
                            ]
                        }
                    ],
                    exceptions: {
                        range: {
                            from: "2023-01-01",
                            to: "2023-12-31"
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
                name: "Rock & Roll dans la cité avec toutes les grandes starts des années 80, le tout gratuitement profitez !",
                highlight: false,
                categories: [
                    {
                        name: "Music",
                        public_name: "Musique",
                        main_category: true
                    },
                ],
                tags: [
                    {
                        name: "Musique",
                        public_name: "Musique"
                    },
                    {
                        name: "Nuit",
                        public_name: "Nuit"
                    }
                ],
                medias: [
                    {
                        is_cover: true,
                        is_in_gallery: true,
                        cloudinary_id: "owjt989rixv1os3ocvdh",
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
                name: "Visite de Macron",
                highlight: false,
                categories: [
                    {
                        name: "Politic",
                        public_name: "Politique",
                        main_category: true
                    },
                ],
                tags: [
                    {
                        name: "Politique",
                        public_name: "Politique"
                    },
                    {
                        name: "Ephémère",
                        public_name: "Ephémère"
                    }
                ],
                medias: [
                    {
                        is_cover: true,
                        is_in_gallery: true,
                        cloudinary_id: "owjt989rixv1os3ocvdh",
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
                name: "Festival aquatique",
                highlight: false,
                categories: [
                    {
                        name: "Festival",
                        public_name: "Festival",
                        main_category: true
                    },
                ],
                tags: [
                    {
                        name: "Festival",
                        public_name: "Festival"
                    },
                    {
                        name: "Aquatique",
                        public_name: "Aquatique"
                    },
                    {
                        name: "Lac",
                        public_name: "Lac"
                    },
                    {
                        name: "Musique",
                        public_name: "Musique"
                    },
                ],
                medias: [
                    {
                        is_cover: true,
                        is_in_gallery: true,
                        cloudinary_id: "owjt989rixv1os3ocvdh",
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

    let tags = events.flatMap(x => x.tags).filter((a, i) => events.flatMap(x => x.tags).findIndex((s) => a.public_name === s.public_name) === i).map(x => x.public_name);

    $: events;
</script>

<div class="agenda p-5 md:p-7 md:px-12">
    <Heading tag="h2" class="">{$_('agenda.title')}</Heading>

    <div class="search-section py-3">

        <label for="today"
               class="inline-block text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
            {$_('agenda.search-section.today')}
            <input name="search_zone" id="today" value="today" type="radio" class="accent-indigo-500" hidden checked>
        </label>
        <label for="week-end"
               class="inline-block text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
            {$_('agenda.search-section.weekend')}
            <input name="search_zone" id="week-end" value="week-end" type="radio" class="accent-indigo-500" hidden>
        </label>

        <label for="date"
               class="inline-block text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
            <Calendar class="inline-block mr-2 -mt-1.5"/>
            <span>
                {$_('agenda.search-section.date')}
            </span>
            <input name="search_zone" id="date" value="date" type="radio" class="accent-indigo-500" hidden>
        </label>
    </div>

    <!--    <DateRangePicker/>-->

    <div class="tags-section py-3">
        {#each tags as tag}
            <button class="inline-block text-black border border-black rounded-full hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent px-6 mr-2"
                    title="{tag}">{tag}
            </button>
        {/each}
    </div>
    <div class="tags-section py-3">
        {#each tags as tag}
            <button class="inline-block text-black border border-black rounded-tl-lg rounded-br-lg hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2"
                    title="{tag}">{tag}
            </button>
        {/each}
    </div>

    <p class="text-3xl font-semibold leading-tight tracking-tighter py-3">
        {events.length} événement{events.length > 1 ? 's' : ''} correspond{events.length > 1 ? 'ent' : ''} à ces
        critères
    </p>

    <div class="grid xl:grid-cols-2 gap-4">
        {#each events as event, index}
            <EventCard class="" {...event}/>
        {/each}
    </div>


</div>

<style>

</style>