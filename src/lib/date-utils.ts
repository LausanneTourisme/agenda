import moment, {type Moment} from "moment";
import type {Event, Period, ScheduleDate, Schedules} from "./types";

export const randomDate = (start: Moment, end: Moment): Moment => {
    return moment(start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()))
}

// TODO Remove hardcoded first dates
export const isSameDays = (event: Event): Boolean => event.schedules.dates[0].periods[0].start === event.schedules.dates[0].periods[event.schedules.dates[0].periods.length - 1].end

// TODO Remove hardcoded first dates
export const extractStartEndDate = (event:Event): {start: Moment, end: Moment} => ({
    start: moment(event.schedules.dates[0].periods[0].start, "YYYY-MM-DD"),
    end: moment(event.schedules.dates[0].periods[event.schedules.dates[0].periods.length - 1].end, "YYYY-MM-DD")
});


export const findAvailablePeriod = (schedule: ScheduleDate, start: Moment | null | undefined, end: Moment | null | undefined): Period | null => {
    const today: Moment = start ?? moment();

    for (const period of sortPeriods(schedule.periods)) {

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

export const sortPeriods = (periods: Period[]): Period[] => {
    return [...periods].sort((a, b): number => {
        const p1 = moment(a.start, "YYYY-MM-DD").valueOf();
        const p2 = moment(b.start, "YYYY-MM-DD").valueOf();
        if(p1 < p2) return -1;
        if(p1 > p2) return 1;
        return 0;
    });
}

export const sortDates = (dates: ScheduleDate[]): ScheduleDate[] => {
    return [...dates].sort((a, b) => {
       const p1 = moment(sortPeriods(a.periods)[0].start, "YYYY-MM-DD").valueOf();
       const p2 = moment(sortPeriods(b.periods)[0].start, "YYYY-MM-DD").valueOf();

        if(p1 < p2) return -1;
        if(p1 > p2) return 1;
        return 0;
    });
}

export const sortSchedules = (schedules: Schedules[]): Schedules[] => {
    return [...schedules].sort((a,b) => {
        const d1 = moment(sortDates(a.dates)[0].periods[0].start, 'YYYY-MM-DD').valueOf();
        const d2 = moment(sortDates(a.dates)[0].periods[0].start, 'YYYY-MM-DD').valueOf();

        if(d1 < d2) return -1;
        if(d1 > d2) return 1;
        return 0;
    })
}