export type Schedules = {
    dates: ScheduleDate[],
    exceptions: {
        range: Range,
        dates: ExceptionDate[] | null | undefined
    }
}

export type ScheduleDate = {
    label: string | null | undefined,
    every_year: boolean|"true"|"false",
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
export type Category  = {
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
    description: Translatable,
    medias: Media[]
}

export type Event = {
    name: Translatable,
    highlight: boolean,
    categories: Category[],
    tags: Tag[],
    medias: Media[],
    schedules: Schedules,
    geolocations: Geolocation[],
    seo: Seo
}

export type optionsSortEvents = {
    onlyAvailable: boolean,
    onlyHighlights: boolean,
}

type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type oneToFive = 1 | 2 | 3 | 4 | 5
type zeroToFive = 0 | 1 | 2 | 3 | 4 | 5
/**
 * Years
 */
type YYYY = `19${zeroToNine}${zeroToNine}` | `20${zeroToNine}${zeroToNine}`
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
type HH = `${0 | 1 | 2}${zeroToNine}` | zeroToNine
/**
 * Minutes
 */
type mm = `${zeroToFive}${zeroToNine}`