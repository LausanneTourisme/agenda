import moment, { type Moment } from "moment";
import type { Event, OptionsSortEvents, Period, ScheduleDate } from "./types";
import { warn } from "./utils";

export const randomDate = (start: Moment, end: Moment): Moment => {
    return moment(start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()))
}

const logIgnoredEvent = (event: Event, information?: string) => warn(`Event skipped${information? `, beacause: ${information}`: null}`, event)

export const sortEvents = (events: Event[], options: OptionsSortEvents): Event[] => {
    options = {
        locale: null,
        onlyAvailable: true,
        onlyHighlights: false,
        startingDate: null,
        endingDate: null,
        ...options
    }

    return [...events].filter((e: Event, index: number) => {
        const event = {...e};

        if(options.locale && !event.languages.includes(options.locale)){
            logIgnoredEvent(events[index], 'locale not found')

            return false;
        }

        if (event.schedules.dates.length === 0) {
            logIgnoredEvent(events[index], 'empty dates')

            return false;
        }

        //when only highlighted event
        if (options.onlyHighlights && !event.highlight) {
            logIgnoredEvent(events[index], 'not highlighted')
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

            if (!availableDates) {
                logIgnoredEvent(events[index], 'invalid dates')
                return false
            }

            //prevent references
            schedules.dates = availableDates
            event.schedules = schedules;

            return true;
        }

        return true;
    })
}

export const uniqueEvents = (arr1: Event[], arr2: Event[]): Event[] => {
    const result: Event[] = arr2.filter(x => arr1.find(e => e.id === x.id) === undefined)

    return [...arr1, ...result];
}

const findAvailablePeriod = (schedule: ScheduleDate, start: Moment | null | undefined, end: Moment | null | undefined): Period | null => {
    const today: Moment = start ?? moment();

    for (const period of schedule.periods) {

        const pStart: Moment = moment(period.start, 'YYYY-MM-DD').startOf('day');
        const pEnd: Moment = moment(period.end, 'YYYY-MM-DD').endOf('day');

        if (today.isSame(pStart, "dates")) {
            return period;
        } else if (today.isSame(pEnd, "dates")) {
            return period;
        } else if (today.isBetween(start, end, "dates", "[]")) {
            return period;
        } else if (today.isBefore(pStart, "dates")) {
            if (end) {
                if (end.isBefore(pStart)) {
                    continue;
                }
            }
            return period;
        }
    }

    return null;
}

