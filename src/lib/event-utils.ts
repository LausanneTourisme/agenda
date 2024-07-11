import {
    type Event,
    type EventsResult,
    EventType,
    type GqlItems,
    type GqlOptions,
    type GqlResponse,
    type Locales,
    type OptionsSortEvents, type Query,
    type ScheduleDate
} from "$lib/types";
import {dateFormat, findAvailablePeriod, now, sortDates} from "$lib/date-utils";
import moment from "moment/moment";
import {log, warn} from "$lib/utils";
import Fuse from "fuse.js";

export const logIgnoredEvent = (event: Event, information?: string): void | null => warn(`Event skipped${information ? `, beacause: ${information}` : null}`, event)


export const sort = (events: Event[], options: OptionsSortEvents = {}): Event[] => {
    options = {
        locale: null,
        onlyAvailable: true,
        onlyHighlights: false,
        startingDate: moment(now, dateFormat),
        endingDate: null,
        ...options
    }

    const availableEvents = [...events].filter((e: Event, index: number) => {
        const event = {...e};

        if (options.locale && !event.languages.includes(options.locale)) {
            // logIgnoredEvent(events[index], 'locale not found')

            return false;
        }

        if (!event.schedules.dates || event.schedules.dates.length === 0) {
            logIgnoredEvent(events[index], 'empty dates')

            return false;
        }

        //when only highlighted event
        if (options.onlyHighlights && !event.highlight) {
            // logIgnoredEvent(events[index], 'not highlighted')
            return false;
        }

        if (options.onlyAvailable) {
            const availableDates: ScheduleDate[] = []
            // I love shadow reference ❤️
            const schedules = {...event.schedules}

            for (const date of schedules.dates) {
                const d = {...date}
                const period = findAvailablePeriod(d, options.startingDate, options.endingDate);

                if (!period) continue;

                d.periods = [{...period}];
                availableDates.push(d);
            }

            if (availableDates.length === 0) {
                logIgnoredEvent(events[index], 'invalid dates')
                return false
            }

            //prevent references
            schedules.dates = availableDates.sort(x => moment(x.periods[0].start, dateFormat).valueOf())
            event.schedules = schedules;

            return true;
        }

        return true;
    })

    return availableEvents.sort((a, b) => {
        const d1 = sortDates(a.schedules.dates);
        const d2 = sortDates(b.schedules.dates);

        const p1 = moment(d1[0].periods[0].start, dateFormat).valueOf();
        const p2 = moment(d2[0].periods[0].start, dateFormat).valueOf();

        if (p1 < p2) return -1;
        if (p1 > p2) return 1;
        return 0;
    })
}

/**
 * return a new merged array without duplicata
 *
 * @param arr1
 * @param arr2
 */
export const unique = (arr1: Event[], arr2: Event[]): Event[] => {
    //if arr1 empty we can add directly all arr2 data
    if (arr1.length === 0) return [...arr2];

    const result: Event[] = arr2.filter(x => arr1.find(e => e.id === x.id) === undefined)

    return [...arr1, ...result];
}

export const searchEvents = (query: Query, locale: Locales = "en", events: Event[] = []) => {
    if (!query || events.length === 0) {
        return [...events];
    }

    const fuse = new Fuse(events, {
        includeScore: true,
        includeMatches: true,
        findAllMatches: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        keys: [
            {
                name: `name.${locale}`,
                weight: 1,
            },
            {
                name: `seo.name.${locale}`,
                weight: 0.9,
            },
            {
                name: `geolocations.address`,
                weight: 0.4,
            },
            {
                name: `geolocations.venue`,
                weight: 0.4,
            },
            {
                name: `categories.public_name.${locale}`,
                weight: 0.3,
            },
            {
                name: `tags.public_name.${locale}`,
                weight: 0.1,
            },
        ]
    })

    return [...fuse.search(query.toLowerCase()).map(e => e.item)];
};

// @ts-ignore
export const getFreshEvents = async (apiUrl: string | null | undefined, locale: Locales, events: Event[], options: {
    disableAgenda?: boolean,
    disableHighlights?: boolean,
    events_per_chunk?: number,
} = {}): Promise<{
    agenda: Event[],
    highlights: Event[],
    events: Event[],
    usableEvents: Event[],
}> => {

    if (!apiUrl) {
        console.error('getFreshEvent: no api url defined');
        return {agenda: [], highlights: [], events: [], usableEvents: []};
    }

    options = {disableAgenda: false, disableHighlights: false, events_per_chunk: 10, ...options}


    const emptyEvents = events.length === 0;
    let highlights: Event[] = [];
    let agenda: Event[] = [];
    let newEvents: Event[] = [];
    let usableEvents: Event[] = [];


    log('Has to get freshEvents: ', {emptyEvents});


    if (emptyEvents) {
        if (!options.disableHighlights) {
            const type: EventType = EventType.highlights;

            const result: EventsResult = await update(apiUrl, locale, type, [], options.events_per_chunk);
            log('getFreshEvent: getting highlights', {highlights: result.events})

            highlights = [...result.events];
        }
        if (!options.disableAgenda) {
            const type: EventType = EventType.agenda;

            const result: EventsResult = await update(apiUrl, locale, type, highlights, options.events_per_chunk);
            log('getFreshEvent: getting all type of events', {agenda: result.events})

            agenda = [...result.events, ...highlights];
        }

        usableEvents = sort([...highlights, ...agenda]);
        newEvents = []
        log('getFreshEvent: events completely sorted', {totalEvents: newEvents, usableEvents})
    } else {
        log('getFreshEvent: events already exists let we use it')

        usableEvents = events.filter(event => event.languages.includes(locale));
        const tempHighlights: Event[] = [];
        const tempAgenda: Event[] = [];
        let index: number = 0;

        for (const event of usableEvents) {
            // @ts-ignore typescript can't see default value defined bellow
            if (event.highlight && tempHighlights.length < options.events_per_chunk) {
                tempHighlights.push(event);
                tempAgenda.push(event);
                //@ts-ignore
            } else if (index < options.events_per_chunk && !event.highlight) {
                tempAgenda.push(event);
                index++;
                //@ts-ignore
            } else if (index >= options.events_per_chunk && tempHighlights.length >= options.events_per_chunk) {
                break;
            }
        }
        highlights = [...tempHighlights];
        agenda = [...tempAgenda];
        newEvents = [...events];
    }

    return {agenda, highlights, events: newEvents, usableEvents};
};


export const update = async (url: string | undefined | null, locale: Locales, type: EventType = EventType.agenda, events: Event[] = [], limit: number | null = null): Promise<EventsResult> => {
    if (!url) throw new Error("Api url not configured")

    const items = await fetchEvent(url, {
        options: `get${type}`,
        ignoreIds: events?.map(e => e.id),
        limit,
        locale,
    });

    const elements = items?.data ?? [];

    return {
        // @ts-ignore
        hasMore: items?.has_more_pages ?? items?.data?.length > 0,
        events: elements,
    }
}


export const fetchEvent = async (url: string | null | undefined, options: GqlOptions): Promise<GqlItems | null> => {
    if (!url) {
        console.error('no api url defined')
        return null;
    }

    const response: Response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify(options),
    });

    const gqlResponse = await response.json();

    return gqlResponse?.result?.data?.items;
}

export const fetchAll = async (url: string | null | undefined): Promise<Event[] | null> => {
    if (!url) {
        console.error('no api url defined')
        return null;
    }

    // @ts-ignore
    const response: Response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        redirect: 'follow',
        body: JSON.stringify({
            options: 'dumpEvents',
        }),
    });

    const gqlResponse = await response.json() as GqlResponse;

    return gqlResponse?.result?.data?.items.data ?? [];
}

export async function getAllEvents(apiUrl: string): Promise<Event[]> {
    log('getAllEvents: getting all events')
    const items = await fetchAll(apiUrl);
    log('getAllEvents: dump completed', {events: items})

    if (!items) return [];

    return items;
}