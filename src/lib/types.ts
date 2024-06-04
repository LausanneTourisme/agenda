import type {Moment} from "moment";

export type Locales = "fr" | "en" | "de" | "it" | "es"

export enum EventType {
    agenda = "events",
    highlights = "highlights"
}
export enum Environment {
    dev = "development",
    prod = "production"
}

export type Schedules = {
    dates: ScheduleDate[],
    exceptions: {
        range: Range,
        dates: ExceptionDate[] | null | undefined
    }
}

export type ScheduleDate = {
    label: string | null | undefined,
    every_year: boolean,
    open_days: ShortDay[],
    week: Week[],
    periods: Period[]
}

export type ExceptionDate = {
    start: `${YYYY}-${MM}-${DD}`,
    end: `${YYYY}-${MM}-${DD}`,
    type: "closed" | "modified",
    open_days: ShortDay[],
    week: Week[]
}

export type Translatable = {
    fr: string,
    en?: string,
    de?: string,
    it?: string,
    es?: string,
}

export type ShortDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export type Time = {
    start: `${HH}:${mm}`,
    end: `${HH}:${mm}` | null | undefined,
}

export type Week = {
    days: ShortDay[],
    times: Time[] | null | undefined,
}

export type RawDate = `${YYYY}-${MM}-${DD}`

export type Period = {
    start: RawDate,
    end: RawDate,
}

export type Range = {
    from: RawDate,
    to: RawDate,
}

export type Media = {
    is_cover?: boolean,
    is_in_gallery?: boolean,
    cloudinary_id: string,
    original_width?: number,
    copyright?: string,
}

export type Tag = {
    name: string,
    public_name: Translatable,
}

export type Category = {
    name: string,
    public_name: Translatable,
    main_category: boolean,
}

export type Geolocation = {
    zip: string | undefined | null,
    city: string | undefined | null,
    venue: string | undefined | null,
    address: string | undefined | null,
    address_2: string | undefined | null,
    main_address: boolean | "true" | "false" | undefined | null,
    elevation: string | undefined | null,
    longitude: string | undefined | null,
    latitude: string | undefined | null,
}

export type Seo = {
    noindex: boolean | "true" | "false",
    name: Translatable,
    slug: Translatable,
    hreflang: Translatable,
    description: Translatable,
    medias: Media[]
}

export type Event = {
    id: number,
    languages: Locales,
    name: Translatable,
    highlight: boolean,
    categories: Category[],
    tags: Tag[],
    medias: Media[],
    schedules: Schedules,
    geolocations: Geolocation[],
    seo: Seo
}

export type OptionsSortEvents = {
    locale?: string | null,
    onlyAvailable?: boolean,
    onlyHighlights?: boolean,
    startingDate?: Moment | null,
    endingDate?: Moment | null,
}

export type NullableString = string | null;

type oneLetter =
    | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm'
    | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type oneToFive = 1 | 2 | 3 | 4 | 5

type zeroToFive = 0 | 1 | 2 | 3 | 4 | 5

/**
 * Years
 */
type YYYY = `20${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`

/**
 * Months
 */
type MM = `0${oneToNine}` | `1${0 | 1 | 2}`

/**
 * Days
 */
type DD = `${0}${oneToNine}` | `${1 | 2}${zeroToNine}` | `3${0 | 1}`

/**
 * Hours
 */
type HH = `${0 | 1}${zeroToNine}` | zeroToNine | `20` | `21` |`22` |`23`;

/**
 * Minutes
 */
type mm = `${zeroToFive}${zeroToNine}`

export type TwoLetters = `${oneLetter}${oneLetter}`

export type DispatchTagSelect = CustomEvent<{
    tag: Tag | null | undefined
}>;

export type DispatchApiEvents = CustomEvent<{
    loadMore: { event: any }; //Click event, I've types conflict
    search: { value: string };
}>;

export type History = {
    load_by: number, //how many events do you want load on every "load more"
    events: Event[],
    loaded_events: { // list of ids
        fr: number[],
        de: number[],
        en: number[],
        it: number[],
        es: number[],
    },
    total_events: {
        fr: Event[],
        de: Event[],
        en: Event[],
        it: Event[],
        es: Event[],
    },
    count: {
        fr: {
            highlights: number,
            events: number,
        },
        de: {
            highlights: number,
            events: number,
        },
        en: {
            highlights: number,
            events: number,
        },
        it: {
            highlights: number,
            events: number,
        },
        es: {
            highlights: number,
            events: number,
        },
    },
    has_more: boolean,
};

export type Query = string | undefined | null;

export type GqlOptions = {
    options: "search" | "getEvents" | "getHighlights" | "getevents" | "gethighlights" | 'dates' | 'tags'
    ignoreIds: number[]
    locale?: string
    value?: number
    page?: number,
    limit?: number | null,
}

export type GqlResponse = {
    // type: "events" | "highlight"
    result: {
        data: {
            items: GqlItems
        }
    }
}

export type GqlItems = {
    total?: number
    per_page?: number
    current_page: number
    has_more_pages: boolean
    from?: number
    to?: number
    data: Event[]
}

export type EventsResult = {
    hasMore: boolean,
    events:Event[],
}
