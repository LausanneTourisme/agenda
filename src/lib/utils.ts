import type {
    Event,
    EventsResult,
    GqlItems,
    GqlOptions,
    Locales,
    NullableString,
    OptionsSortEvents,
    ScheduleDate
} from "$lib/types";
import {findAvailablePeriod, sortDates, sortSchedules} from "$lib/date-utils";
import moment from "moment";

/**
 * trick to bypass problem with tailwind and shadow dom
 */
export const applyStyling = (element: HTMLElement | undefined): void => {
    if (!element) return;
    const template = document.getElementById("swc-lt-agenda-styling");

    // @ts-ignore
    if (!template?.content) return;
    // @ts-ignore
    const node = document.importNode(template.content, true);
    element?.parentNode?.appendChild(node);
}
/**
 * @param {number} [size = 8] size max 36
 */
export const randomString = (size: number = 8): string => Math.random().toString(36).slice(-size);

export const warn = (information: string, content: any): void => console.warn({information, content})

export const logIgnoredEvent = (event: Event, information?: string): void => warn(`Event skipped${information ? `, beacause: ${information}` : null}`, event)

/**
 *
 * min and max included
 * @param min
 * @param max
 *
 * @return {number}
 */
export const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

export const blankable = (href: NullableString): NullableString => (href && href.includes('http')) ? "_blank" : null;

export const fetchEvents = async (url: string | null | undefined, options: GqlOptions): Promise<GqlItems | null> => {
    if (url) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        // @ts-ignore
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

    console.error('no api url defined')
    return null;
}

export const handleMoreEvents = async (e: HTMLElement|CustomEvent, apiUrl: string | undefined | null, events: Event[], locale: Locales, type: "events" | "highlights" = "events"): Promise<EventsResult> => {
    const result = await updateEvents(apiUrl, events, locale, type);

    console.log("dispatch loadMore !");

    const elem = e instanceof HTMLElement ? e : e.target;

    elem?.dispatchEvent(
        new CustomEvent("loadMore", {
            detail: {
                options: `get${type}`,
            },
            composed: true
        })
    );

    return result
}

export const updateEvents = async (url: string | undefined | null, events: Event[], locale: Locales, type: "events" | "highlights" = "events"): Promise<EventsResult> => {
    if (!url) throw new Error("Api url not configured")

    const items = await fetchEvents(url, {
        options: `get${type}`,
        ignoreIds: events.map(e => e.id),
        locale,
    });

    const elements = items?.data ?? [];

    return {
        // @ts-ignore
        hasMore: items?.has_more_pages ?? items?.data?.length > 0 ,
        events: uniqueEvents(events, elements),
    }
}
export const sortEvents = (events: Event[], options: OptionsSortEvents): Event[] => {
    options = {
        locale: null,
        onlyAvailable: true,
        onlyHighlights: false,
        startingDate: null,
        endingDate: null,
        ...options
    }

    const availableEvents= [...events].filter((e: Event, index: number) => {
        const event = {...e};

        if (options.locale && !event.languages.includes(options.locale)) {
            // logIgnoredEvent(events[index], 'locale not found')

            return false;
        }

        if (event.schedules.dates.length === 0) {
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
            //I love shadow reference ❤️
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
            schedules.dates = availableDates.sort(x => moment(x.periods[0].start, 'YYYY-MM-DD').valueOf())
            event.schedules = schedules;

            return true;
        }

        return true;
    })

    return availableEvents.sort((a, b) => {
        const d1 = sortDates(a.schedules.dates);
        const d2 = sortDates(b.schedules.dates);

        const p1 = moment(d1[0].periods[0].start, 'YYYY-MM-DD').valueOf();
        const p2 = moment(d2[0].periods[0].start, 'YYYY-MM-DD').valueOf();

        if(p1 < p2) return -1;
        if(p1 > p2) return 1;
        return 0;
    })
}

export const uniqueEvents = (arr1: Event[], arr2: Event[]): Event[] => {
    const result: Event[] = arr2.filter(x => arr1.find(e => e.id === x.id) === undefined)

    return [...arr1, ...result];
}
