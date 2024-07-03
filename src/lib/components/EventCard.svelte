<script lang="ts">
    import type {Event, Geolocation, Period, ScheduleDate, Schedules, ShortDay} from "$lib/types";
    import moment, {type Moment} from "moment";
    import 'moment/dist/locale/fr-ch';
    import 'moment/dist/locale/en-gb';
    import 'moment/dist/locale/de';
    import {_, locale} from "svelte-i18n";
    import {Calendar, Clock, MapPin} from "lucide-svelte";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import {CldImage} from "svelte-cloudinary";
    import Clickable from "$lib/components/Clickable.svelte";
    import {extractStartEndDate, findAvailablePeriod, isSameDays, now} from "$lib/date-utils";
    import {defaultLocale} from "$lib/utils";

    let key: string;

    export let selectedDates: { start: string, end: string | null | undefined };
    export let event: Event;
    export let baseUrl: string;

    let date: { start: Moment, end: Moment } | undefined = extractStartEndDate(event, selectedDates);

    const geolocation: Geolocation | undefined = event.geolocations?.find(x => x.main_address) ?? (event.geolocations.length ? event.geolocations[0] : undefined); // love when addresses can be false... thanks external data

    const media = event.medias.find(x => x.is_cover);

    let hourMessage: string = getSchedulesText(event.schedules, selectedDates);

    function getSchedulesText(schedules: Schedules, days: {
        start: string,
        end: string | undefined | null
    } | undefined): string {
        let period: Period | null = null;
        const schedule: ScheduleDate | undefined = schedules.dates.find((schedule) => {
            period = findAvailablePeriod(schedule, date?.start, date?.end);
            return period != null
        })

        if (!schedule || !period) return $_('date.other'); // This case shouldn't occur

        const startDay = moment(new Date(days?.start ?? now));
        const shortDay = startDay.locale('en').format('dd').toLowerCase() as ShortDay;
        const hasDay = schedule.open_days.includes(shortDay) ?? false;

        if (!hasDay) return `${$_('date.close')} ${$_('date.more')}`;

        if (schedule.open_days.length === 7 && schedule.week[0].days.length === 7 &&
            (schedule.week[0].times?.length === 0 || !schedule.week[0].times))
            return $_('date.every_days');

        const week = schedule.week.find(({days}) => days.includes(shortDay))

        if (!week) return `${$_('date.close')} ${$_('date.more')}`;

        if (!week.times || week.times.length === 0) return `${$_('date.open')}${week.days.length > 1 || schedule.week.length > 1 ? ` ${$_('date.more')}` : ''}`

        const isToday = startDay.isSame(moment(), 'day');

        const times = week.times.sort((a, b) => {
            const aStart = a.start.split(':');
            const bStart = b.start.split(':');
            if (aStart[0] < bStart[0]) return -1;
            if (aStart[0] > bStart[0]) return 1;

            if (aStart[1] < bStart[1]) return -1;
            if (aStart[1] > bStart[1]) return 1;

            return 0;
        });

        const startTime = moment(times[0].start, 'HH:mm');
        const endTime = moment(times[times.length - 1].start, 'HH:mm');

        const start = startDay.set({
            hour: startTime.get('hour'),
            minute: startTime.get('minute'),
            second: 0,
            millisecond: 0,
        });
        const end = startDay.set({
            hour: endTime.get('hour'),
            minute: endTime.get('minute'),
            second: 59,
            millisecond: 999,
        });

        if (isToday) {
            if (moment().isBefore(start)) {
                const duration = moment.duration(start.diff(moment()));
                if (duration.asHours() >= 1) return `${$_('date.open_in.hours', {values: {hours: Math.floor(duration.asHours()).toString().padStart(2, '0')}})} ${$_('date.more')}`;
                return `${$_('date.open_in.minutes', {values: {minutes: Math.floor(duration.asMinutes()).toString().padStart(2, '0')}})} ${$_('date.more')}`;
            }
            if (moment().isAfter(end)) {
                return $_('date.close')
            }
            if (startDay.isBetween(start, end)) return $_('date.open')
        }

        return `${$_('date.open_at', {values: {time: times[0].start}})} ${$_('date.more')}`;
    }

    $: selectedDates;
    $: key = ($locale ?? defaultLocale);
</script>

<div data-id="{event.id}"
     class="lt-agenda-event-card flex flex-row bg-slate-100 w-full rounded-sm overflow-hidden {$$props.class ?? ''}">
    <div class="lt-agenda-image-wrapper aspect-4/5 sm:aspect-square h-40 sm:h-64">

        <Clickable href="{baseUrl}{event.seo.hreflang[key]}" class="h-full w-full">
            {#if media}
                <CldImage
                        src="{media.cloudinary_id}"
                        alt="{!media.copyright || media.copyright?.trim() === '©' ? $_('copyright') : media.copyright}"
                        title="{!media.copyright || media.copyright?.trim() === '©' ? $_('copyright') : media.copyright}"
                        height="{500}"
                        width="{500}"
                        sizes="100vw"
                        class="object-cover bg-gray-300 break-all text-wrap h-full w-full"
                />
            {:else}
                <img src="https://static.lausanne-tourisme.ch/image/upload/v1588747700/fgbcshmie94gzvhjxqoc.jpg"
                     alt="{$_('copyright')}"
                     title="{$_('copyright')}"
                     height=500
                     width=500
                     class="object-cover bg-gray-300 break-all text-wrap"
                />
            {/if}
        </Clickable>
    </div>
    <div class="lt-agenda-informations flex flex-col flex-1 overflow-hidden h-40 sm:h-64">
        <!--TAGS-->
        <TagsSwiper class="tags mx-3 mt-3 sm:mt-4 sm:mx-5 cursor-grab active:cursor-grabbing pb-0"
                    tagClass="flex justify-content items-center text-sm  mr-2 sm:text-md px-3 sm:py-1 sm:px-2 text-black border border-black rounded-full sm:has-[:checked]:border-honey-500 sm:has-[:checked]:bg-honey-500 items-center ring-2 ring-transparent cursor-grab active:cursor-grabbing"
                    tags="{event.tags}"/>


        <Clickable class="px-2 pb-2 sm:px-4 sm:pb-4 flex-grow flex flex-col"
                   href="{baseUrl}{event.seo.hreflang[key]}">
            <!--TITLE-->
            <div class="flex-grow flex items-center">
                <h3 class="lt-agenda-title my-1 ml-1 line-clamp-2 max-h-12 sm:max-h-14 text-md sm:text-xl leading-snug tracking-tight font-semibold align-middle"
                   title="{event.name[key]}">
                    {event.name[key]}
                </h3>
            </div>
            <!--DATE-->
            <div class="lt-agenda-date text-sm sm:text-md flex items-center sm:mt-2">
                <div class="my-auto mr-2">
                    <Calendar class="text-honey-500" size="24px"/>
                </div>

                <p class="flex w-full leading-snug tracking-tight truncate mt-1">
                    {#if isSameDays(event, selectedDates)}
                            <span title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}">
                                {date.start.locale($_('date.locale')).format('DD.MM.YY')}
                            </span>
                    {:else}
                            <span class="hidden sm:inline-block pr-1"
                                  title="{$_('date.start')}">{$_('date.start')}</span>

                        <span title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}">
                                {date.start.locale($_('date.locale')).format('DD.MM.YY')}
                            </span>

                        <span class="px-1 sm:hidden" title="{$_('date.separator')}"> - </span>
                        <span class="px-1 hidden sm:inline-block"
                              title="{$_('date.separator')}"> {$_('date.separator')} </span>

                        <span title="{date.end.locale($_('date.locale')).format('DD MMMM YYYY')}">
                                {date.end.locale($_('date.locale')).format('DD.MM.YY')}
                            </span>
                    {/if}
                </p>
            </div>
            <!--SCHEDULE-->
            <div class="lt-agenda-schedule text-sm sm:text-md hidden sm:flex w-full sm:mt-4 ">
                <div class="my-auto mr-2">
                    <Clock class="text-honey-500" size="24px"/>
                </div>
                <p class="leading-snug tracking-tight mt-1"
                   title="{hourMessage}">
                    {hourMessage}
                </p>
            </div>
            <!--LOCATION-->
            <div class="lt-agenda-location text-sm sm:text-md flex w-full mt-2 sm:mt-4">
                {#if (geolocation?.venue ?? geolocation?.address) !== undefined}
                    <div class="my-auto mr-2">
                        <MapPin class="text-honey-500" size="24px"/>
                    </div>
                    <p class="leading-snug tracking-tight truncate mt-1"
                       title="{geolocation?.venue ?? geolocation?.address}">
                        {geolocation?.venue ?? geolocation?.address}
                    </p>
                {/if}
            </div>
        </Clickable>
    </div>
</div>
