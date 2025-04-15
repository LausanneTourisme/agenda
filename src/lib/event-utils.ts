import {
    type Event,
    type GqlItems,
    type GqlOptions,
    type GqlResponse,
    type Locales,
    type OptionsSortEvents,
    type Query,
    type ScheduleDate,
    type ShortDay,
    type Tag
} from "$lib/types";
import {dateFormat, findAvailablePeriod, getDaysBetween, now, sortDates} from "$lib/date-utils";
import moment from "moment/moment";
import {arrayUniqueByKey, log, warn} from "$lib/utils";
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

        if(event.tags.length === 0) {
            logIgnoredEvent(events[index], 'Event without tags')
            return false;
        }

        if (options.locale && !event.languages.includes(options.locale)) {
            // logIgnoredEvent(events[index], 'locale not found')

            return false;
        }

        if (!event.schedules.dates || event.schedules.dates.length === 0) {
            logIgnoredEvent(events[index], 'Empty dates')

            return false;
        }

        const media = event.medias.find(x => x.is_cover)

        if(!media || !media.cloudinary_id){
            logIgnoredEvent(events[index], 'No cover')
            return false;
        }
        if(event.name.fr === 'La révolte des immigrants') console.error({event})
        if(media.cloudinary_id === 'fgbcshmie94gzvhjxqoc') {//generic image
            logIgnoredEvent(events[index], 'No cover')
            return false;
        }

        //when only highlighted event
        if (options.onlyHighlights && !event.highlight) {
            // logIgnoredEvent(events[index], 'not highlighted')
            return false;
        }

        if (options.onlyAvailable) {
            const availableDays: ShortDay[] = getDaysBetween(options.startingDate ?? moment(), options.endingDate ?? moment().endOf('year'));

            const availableDates: ScheduleDate[] = []
            // I love shadow reference ❤️
            const schedules = {...event.schedules}

            for (const date of schedules.dates) {
                const d = {...date}
                const isOpen = d.open_days.some(x => availableDays.includes(x));

                //skip period if open_days doesn't contain one of the days
                if (!isOpen) continue;

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

export const distinct = (events: Event[]): Event[] => [...events].reduce((acc: Event[], obj: Event) => {
    if (!acc.some(o => o.id === obj.id)) {
        acc.push(obj);
    }
    return acc;
}, []);

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
                name: `tags.public_name.${locale}`,
                weight: 0.5,
            },
            {
                name: `categories.public_name.${locale}`,
                weight: 0.5,
            },
            {
                name: `geolocations.venue`,
                weight: 0.1,
            },
            {
                name: `geolocations.address`,
                weight: 0.1,
            },
        ]
    })

    return [...fuse.search(query.toLowerCase()).map(e => e.item)];
};

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

export async function getAllEvents(apiUrl: string | undefined | null): Promise<Event[]> {
    if (!apiUrl) {
        console.error('no api url defined')
        return [];
    }

    log('getAllEvents: getting all events')
    const items = await fetchAll(apiUrl);
    log('getAllEvents: dump completed', {events: items})

    if (!items) return [];

    return items;
}


export const sortByTags = (
    tags: string[] | null | undefined = null,
    events: Event[]
  ): Event[] => {
    if (!tags) return events;

    if (tags.length === 0) return events;

    return events.filter((event: Event) => {
      return event.tags.some((tag) => tags.includes(tag.name));
    });
  };

  export const sortEventsToDisplay = (
    locale: string | Locales,
    events: Event[],
    startDate: string,
    options: {
        query?: Query,
        selectedTagsName?: string[],
        endDate?: string,
      firstLoad?: boolean;
    } = {}
  ) => {
    options = {
      firstLoad: false,
      ...options
    };

    if (options.firstLoad) {
      return sort(events, {
        startingDate: moment(startDate, dateFormat),
        endingDate: options.endDate ? moment(options.endDate, dateFormat) : undefined,
        locale: locale,
        onlyAvailable: true
      });
    } else {
      return searchEvents(
        options.query,
        locale as Locales,
        sortByTags(
          options.selectedTagsName,
          // get available events
          sort(events, {
            startingDate: moment(startDate, dateFormat),
            endingDate: options.endDate ? moment(options.endDate, dateFormat) : undefined,
            locale: locale,
            onlyAvailable: true
          })
        )
      );
    }
  };


  export const getUniqueTagsFromEvents = (
    events: Event[],
    dates: { start: string; end?: string },
    query: Query,
    locale: Locales,
  ): Tag[] => {
    const eventsToFilter: Event[] = sortEventsToDisplay(
      locale,
      events,
      dates.start,
      { endDate: dates.end, query: query, firstLoad: true }
    );
    const tags: Tag[] = eventsToFilter.flatMap((event) => event.tags);
    const uniqueTags = arrayUniqueByKey(tags, "name");

    return uniqueTags.sort((a: Tag, b: Tag) => {
      if (a.name === "Autres") {
        return 1; // always display at the end
      }

      const first = a.public_name[locale]?.toUpperCase();
      const second = b.public_name[locale]?.toUpperCase();
      if (!first || !second) {
        return 0;
      }

      if (first < second) {
        return -1;
      }
      if (first > second) {
        return 1;
      }
      return 0;
    });
  };