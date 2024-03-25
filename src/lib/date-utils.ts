import moment, {type Moment} from "moment";
import type {Event, optionsSortEvents, Period, ScheduleDate} from "./types";

export const randomDate = (start: Moment, end: Moment): Moment => {
    return moment(start.valueOf() + Math.random() * (end.valueOf() - start.valueOf()))
}

export const sortEvents = (events: Event[], options: optionsSortEvents = {
    onlyAvailable: true,
    onlyHighlights: false
}): Event[] => {
    return events.filter((event: Event) => {
        if (options.onlyHighlights && !event.highlight) {
            return false;
        }

        const dates: Array<Period[]> = availablePeriods(event);

        if(options.onlyAvailable){
            let indexesToDelete = [];
            for (let i = 0; i < dates.length; i++){
                if(dates[i].length===0){
                    indexesToDelete.push(i);
                } else {
                    //remove old periods
                    event.schedules.dates[i].periods = dates[i].sort((d1: Period, d2:Period) => {
                        const a = moment(d1.start, "YYYY-MM-DD");
                        const b = moment(d2.start, "YYYY-MM-DD");

                        if( a < b){
                            return -1;
                        } else if( a > b){
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                }
            }
            //delete higher index first to prevent calculation
            indexesToDelete.reverse().forEach(x => event.schedules.dates.splice(x,1));

            if(event.schedules.dates.length === 0){
                return false
            }
        }

        return true;
    })
}

const availablePeriods = (event: Event): Array<Period[]> => {
    const dates: Array<Period[]> = event.schedules.dates.map((d: ScheduleDate) => d.periods);

    let availablePeriods: Array<Period[]> = Array(dates.length).fill([]);

    const today: Moment = moment();

    for (let i: number = 0; i < dates.length; i++){
        const periods = dates[i];

        for (const period of periods) {
            const start: Moment = moment(period.start, 'YYYY-MM-DD').startOf('day');
            const end: Moment = moment(period.end, 'YYYY-MM-DD').endOf('day');

            if (today.isSame(start, "dates")) {
                availablePeriods[i].push(period);
            } else if (today.isSame(end, "dates")) {
                availablePeriods[i].push(period);
            } else if (today.isBetween(start, end, "dates", "[]")) {
                availablePeriods[i].push(period);
            } else if (today.isBefore(start, "dates")) {
                availablePeriods[i].push(period);
            }
        }
    }

    return availablePeriods;
}