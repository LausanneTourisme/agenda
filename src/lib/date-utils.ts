import type {Event, Period, RawDate, ScheduleDate, Schedules, SelectedDates, ShortDay} from "./types";
import moment, {type Moment} from "moment";

export const dateFormat: string = "YYYY-MM-DD"
export const now: string | RawDate = moment().format(dateFormat);

export const getWeekend = (moment: Moment): { saturday: Moment, sunday: Moment } => ({
    saturday: moment.clone().day(6),
    sunday: moment.clone().day(7),
});

export const randomDate = (start: Moment, end: Moment): Moment => {
    return moment(start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()))
}

export const isSameDays = (event: Event, selectedDates: SelectedDates): Boolean => {
    const period: { start: Moment, end: Moment } | undefined = extractStartEndDate(event, selectedDates);

    return period?.start.format(dateFormat) === period?.end.format(dateFormat)
}

export const getDaysBetween = (startDate: Moment, endDate: Moment): ShortDay[] => {
    const days: ShortDay[] = [];

    const start = startDate.clone();
    const end = endDate.clone();

    while (start <= end) {
        const day: ShortDay = start.locale('en').format('dd').toLowerCase() as ShortDay;

        if(days.length === 7) break;
        if(days.includes(day)) continue;

        days.push(day); // 'dd' gives short day name like 'mo', 'tu'
        start.add(1, 'day');
    }

    return days;
}

export const extractStartEndDate = (event: Event, selectedDates: SelectedDates): {
    start: Moment,
    end: Moment
} | undefined => {
    let period: Period | null = null;
    event.schedules.dates.forEach((schedule) => {
        if (period != null) return;
        period = findAvailablePeriod(schedule, moment(selectedDates.start), selectedDates.end ? moment(selectedDates.end) : undefined);
    })

    return period != null ? {
        // @ts-ignore
        start: moment(period.start),
        // @ts-ignore
        end: moment(period?.end ?? moment().endOf('year'))
    } : undefined
};

export const findAvailablePeriod = (schedule: ScheduleDate, start: Moment | null | undefined, end: Moment | null | undefined): Period | null => {
    const today: Moment = start ?? moment();
    for (const period of sortPeriods(schedule.periods)) {
        if (isBetween(period, today, end)) {
            return period;
        }
    }

    return null;
}

export const sortPeriods = (periods: Period[]): Period[] => {
    return [...periods].sort((a, b): number => {
        const p1 = moment(a.start, dateFormat).valueOf();
        const p2 = moment(b.start, dateFormat).valueOf();
        if (p1 < p2) return -1;
        if (p1 > p2) return 1;
        return 0;
    });
}

export const sortDates = (dates: ScheduleDate[]): ScheduleDate[] => {
    return [...dates].sort((a, b) => {
        const p1 = moment(sortPeriods(a.periods)[0].start, dateFormat).valueOf();
        const p2 = moment(sortPeriods(b.periods)[0].start, dateFormat).valueOf();

        if (p1 < p2) return -1;
        if (p1 > p2) return 1;
        return 0;
    });
}

export const sortSchedules = (schedules: Schedules[]): Schedules[] => {
    return [...schedules].sort((a, _) => {
        const d1 = moment(sortDates(a.dates)[0].periods[0].start, dateFormat).valueOf();
        const d2 = moment(sortDates(a.dates)[0].periods[0].start, dateFormat).valueOf();

        if (d1 < d2) return -1;
        if (d1 > d2) return 1;
        return 0;
    })
}

export const isBetween = (period: Period, start: Moment | undefined | null, end: Moment | undefined | null): boolean => {
    const today: Moment = start ?? moment();

    const pStart: Moment = moment(period.start, dateFormat).startOf('day');
    const pEnd: Moment = moment(period.end, dateFormat).endOf('day');

    if (today.isSame(pStart, "dates")) {
        return true;
    } else if (today.isSame(pEnd, "dates")) {
        return true;
    } else if (today.isBetween(pStart, pEnd, "dates", "[]")) {
        return true;
    } else if (today.isBefore(pStart, "dates")) {
        return !(end && end.isBefore(pStart));
    }

    return false;
}