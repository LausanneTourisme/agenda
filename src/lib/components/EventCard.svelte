<script lang="ts">
    import {_, locale} from "svelte-i18n";
    import {Calendar, Clock, MapPin} from "lucide-svelte";
    import type {Event, Category, Geolocation, Media, Period, ScheduleDate, Schedules, Tag} from "$lib/types";

    import moment from "moment/moment";
    import 'moment/locale/fr-ch';
    import 'moment/locale/en-gb';
    import 'moment/locale/de';
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import {CldImage} from "svelte-cloudinary";

    // trick to bypass error type...
    const key: "fr" | "en" | "de" | "it" | "es" = ($locale ?? "en") as "fr" | "en" | "de" | "it" | "es";

    export let event: Event;

    const isSameDays = event.schedules.dates[0].periods[0].start === event.schedules.dates[0].periods[0].end;
    const date = {
        start: moment(event.schedules.dates[0].periods[0].start, "YYYY-MM-DD"),
        end: moment(event.schedules.dates[0].periods[0].end, "YYYY-MM-DD"),
    };

    const geolocation: Geolocation | undefined = event.geolocations?.find(x => x.main_address);

    const media = event.medias.find(x => x.is_cover)
</script>

<div class="event-card flex flex-row w-full block bg-slate-100 w-full rounded-sm overflow-hidden {$$props.class}">
    <div class="image-wrapper aspect-square h-40 sm:h-64">
        <!--        TODO add placeholder -->
        {#if media}
            <CldImage
                    src="{media.cloudinary_id}"
                    alt="{media.copyright}"
                    title="{media.copyright}"
                    height="{500}"
                    width="{500}"
                    sizes="100vw"
                    class="object-cover bg-gray-300"
            />
        {:else}
            <img src="./TODO_placeholder.png"
                 alt="image invalide"
                 title="image invalided"
                 height="500"
                 width="500"
                 class="object-cover"
            />
        {/if}
    </div>
    <div class="informations p-2 sm:p-4 flex flex-col flex-1 overflow-hidden">
        <!--TAGS-->
        <TagsSwiper class="tags w-full sm:mb-3 cursor-pointer"
                    withArrow="{false}"
                    withPagination="{false}"
                    tags="{event.tags}"
                    tagClass="inline-block text-sm text-black border border-black rounded-full hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center ring-2 ring-transparent p-1 px-3 mr-2"/>

        <!--TITLE-->
        <p class="title flex-grow line-clamp-2 max-h-14 text-md font-bold sm:text-xl leading-snug tracking-tight font-semibold my-1"
           title="{event.seo.name[key]}">
            {event.seo.name[key]}
        </p>
        <!--DATE-->
        <div class="date flex items-center sm:mt-1">
            <div class="mb-1 mr-2">
                <Calendar class="text-honey-500" size="24px"/>
            </div>

            <p class="flex w-full leading-snug tracking-tight truncate mt-1">
                {#if isSameDays}
                    <span title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}">
                        {date.start.locale($_('date.locale')).format('DD.MM.YY')}
                    </span>
                {:else}
                    <span class="hidden sm:inline-block pr-1" title="{$_('date.start')}">{$_('date.start')}</span>

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
        <div class="schedule hidden sm:flex w-full sm:mt-4 ">
            <div class="mr-2">
                <Clock class="text-honey-500" size="24px"/>
            </div>
            <p class="leading-snug tracking-tight mt-1"
               title="{$_('date.from')} 17:00">
                {$_('date.from')} 17:00
            </p>
        </div>
        <!--LOCATION-->
        <div class="location flex w-full mt-2 sm:mt-4">
            <div class="mr-2">
                <MapPin class="text-honey-500" size="24px"/>
            </div>
            <p class="leading-snug tracking-tight truncate text-sm sm:text-md mt-1"
               title="{geolocation?.venue}">
                {geolocation?.venue}
            </p>
        </div>
    </div>
</div>

<style lang="scss">
  /**
  when we have pagination splide__pagination class, title needs to change 2 lines to 1
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  max-height: 2rem;

  or

  @apply line-clamp-2 max-h-6
  */
</style>