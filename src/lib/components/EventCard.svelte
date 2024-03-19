<script lang="ts">
    import moment from "moment";
    import {_} from "svelte-i18n";
    import {Calendar, Clock, MapPin} from "lucide-svelte";
    import {Splide, SplideSlide} from "@splidejs/svelte-splide";
    import type {Category, Geolocation, Media, Period, ScheduleDate, Schedules, Tag} from "$lib/types";

    export let name: string;
    export let highlight: boolean;
    export let categories: Category[];
    export let tags: Tag[];
    export let medias: Media[];
    export let geolocations: Geolocation[];
    export let schedules: Schedules;

    //TODO should we display all periods or only the current / next period available ?
    const date: ScheduleDate | undefined = schedules?.dates?.find((d: ScheduleDate) => {
        return d.periods.find((p: Period) => {
            const start = moment(p.start, 'YYYY-MM-DD');
            const end = moment(p.end, 'YYYY-MM-DD');

            return moment().isBetween(start.startOf('day'), end.endOf('day'), undefined, "[]")
        }) ?? false;
    });

    const geolocation: Geolocation | undefined = geolocations?.find(x => x.main_address);

    const periodsLength: number = date?.periods?.length ?? 0;
    const periods = date ? [(periodsLength > 1) ? date.periods[0].start : date.periods[0].start, (periodsLength > 1) ? date.periods[periodsLength - 1].end : date.periods[0].end] : [];

    let media = medias.find(x => x.is_cover)
</script>

<div class="event-card flex flex-row w-full block bg-slate-100 w-full rounded-sm overflow-hidden {$$props.class}">
    <div class="image-wrapper aspect-square h-40 sm:h-64">
        <img src="https://www.yamaha-motor.eu/content/dam/yme/ch/hostettler-ag/experience/events/trackdays/yamaha-fun-day/Yamaha-Fun-Day_R1-2022.jpg"
             class="aspect-square h-full object-cover"
             title="{media?.copyright}"
             alt="{media?.copyright}"/>
    </div>
    <div class="informations p-2 sm:p-4 flex flex-col flex-1 overflow-hidden">
        <!--TAGS-->
        <div class="tags w-full sm:mb-3">
            <Splide options={{
                        drag: 'free',
                        rewind : false,
                        fixedWidth : 'auto',
                        fixedHeight : 'auto',
                        isNavigation : false,
                        gap : 0,
                        padding: "2.5rem",
                        pagination : false,
                        snap : true,
                        cover : false,
                        arrows : true,
                        dragMinThreshold: {
                            mouse: 4,
                            touch: 10,
                        },
                    }}>
                {#each tags as tag}
                    <SplideSlide>
                        <div class="inline-block text-sm text-black border border-black rounded-full hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center ring-2 ring-transparent p-1 px-3 mr-2"
                             title="{tag.public_name}">{tag.public_name}</div>
                    </SplideSlide>
                    <SplideSlide>
                        <div class="inline-block text-sm text-black border border-black rounded-full hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center ring-2 ring-transparent p-1 px-3 mr-2"
                             title="{tag.public_name}">{tag.public_name}</div>
                    </SplideSlide>
                {/each}
            </Splide>
        </div>
        <!--TITLE-->
        <p class="title flex-grow line-clamp-2 max-h-14 text-md font-bold sm:text-xl leading-snug tracking-tight font-semibold my-1">
            {name}
        </p>
        <!--DATE-->
        <div class="date flex items-center sm:mt-1">
            <div class="mb-1 mr-2">
                <Calendar color="#E7302F" size="24px"/>
            </div>

            <p class="flex w-full leading-snug tracking-tight truncate text-sm sm:text-md mt-1">
                {#each periods as period, i}
                    {@const d =  moment(period, 'YYYY-MM-DD')}
                    <span class="sm:hidden"
                            title="{d.locale($_('date.locale')).format('DD MMMM YYYY')}">
                        {d.locale($_('date.locale')).format('DD.MM.YY')}
                    </span>
                    <span class="hidden sm:inline-block"
                            title="{d.locale($_('date.locale')).format('DD MMMM YYYY')}">
                        {d.locale($_('date.locale')).format('DD.MM.YYYY')}
                    </span>
                    {#if (i === 0)}
                        <span class="px-1 sm:hidden"> - </span>
                        <span class="px-2 hidden sm:inline-block"> {$_('event-card.date-separator')} </span>
                    {/if}
                {/each}
            </p>
        </div>
        <!--SCHEDULE-->
        <div class="schedule hidden sm:flex w-full sm:mt-4 ">
            <div class="mr-2">
                <Clock color="#E7302F" size="24px"/>
            </div>
            <p class="leading-snug tracking-tight mt-1"
               title="{$_('event-card.from')} 17:00">
                {$_('event-card.from')} 17:00
            </p>
        </div>
        <!--LOCATION-->
        <div class="location flex w-full mt-2 sm:mt-4">
            <div class="mr-2">
                <MapPin color="#E7302F" size="24px"/>
            </div>
            <p class="leading-snug tracking-tight truncate text-sm sm:text-md mt-1"
               title="{geolocation?.venue}">
                {geolocation?.venue}
            </p>
        </div>
    </div>
</div>

<style lang="scss">
</style>