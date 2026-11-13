<script lang="ts">
    import type {Event, Geolocation, Locales} from "$lib/types";
    import 'moment/dist/locale/fr-ch';
    import 'moment/dist/locale/en-gb';
    import 'moment/dist/locale/de';
    import {_, locale} from "svelte-i18n";
    import {Calendar, MapPin} from "@lucide/svelte";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import {CldImage} from "svelte-cloudinary";
    import Clickable from "$lib/components/Clickable.svelte";
    import {extractStartEndDate, isSameDays} from "$lib/date-utils";
    import {defaultLocale} from "$lib/utils";

    interface Props {
        selectedDates: { start: string, end: string | null | undefined };
        event: Event;
        baseUrl: string;
        class?: string;
    }

    let {selectedDates, event, baseUrl, class: className = ""}: Props = $props();

    const date = $derived(extractStartEndDate(event, selectedDates));

    // love when addresses can be false... thanks external data
    const geolocation: Geolocation | undefined = $derived(event.geolocations?.find(x => x.main_address) ?? (event.geolocations.length ? event.geolocations[0] : undefined));

    const media = $derived(event.medias.find(x => x.is_cover));
    const sameDays = $derived(isSameDays(event, selectedDates));

    const key = $derived(($locale ?? defaultLocale) as Locales);
</script>

<div data-id="{event.id}"
     part="event-card"
     class="lt-agenda-event-card flex flex-row bg-slate-100 w-full rounded-sm overflow-hidden {className}">
    <div part="event-image" class="lt-agenda-image-wrapper aspect-4/5 sm:aspect-square h-40 sm:h-48">
        <Clickable href="{baseUrl}{event.seo.hreflang[key]}" class="h-full w-full">
            {#if media}
                <CldImage
                        src={media.cloudinary_id}
                        alt={!media.copyright || media.copyright?.trim() === '©' ? $_('copyright') : media.copyright}
                        title={!media.copyright || media.copyright?.trim() === '©' ? $_('copyright') : media.copyright}
                        height={500}
                        width={500}
                        sizes="100vw"
                        class="object-cover bg-gray-300 break-all text-wrap h-full w-full"
                />
            {:else}
                <img src="https://static.lausanne-tourisme.ch/image/upload/v1588747700/fgbcshmie94gzvhjxqoc.jpg"
                     alt={$_('copyright')}
                     title={$_('copyright')}
                     height=500
                     width=500
                     class="object-cover bg-gray-300 break-all text-wrap"
                />
            {/if}
        </Clickable>
    </div>
    <div class="lt-agenda-informations flex flex-col flex-1 overflow-hidden h-40 sm:h-48">
        <!--TAGS-->
        <TagsSwiper class="tags mx-3 mt-3 sm:mt-4 sm:mx-5 cursor-grab active:cursor-grabbing pb-0"
                    tagClass="flex justify-content items-center text-sm  mr-2 sm:text-md px-3 sm:py-1 sm:px-2 text-black border border-black rounded-full sm:has-[:checked]:border-honey-500 sm:has-[:checked]:bg-honey-500 items-center ring-2 ring-transparent cursor-grab active:cursor-grabbing"
                    tagPart="event-tag"
                    tags={event.tags}/>


        <Clickable class="px-2 pb-2 sm:px-4 sm:pb-4 grow flex flex-col"
                   href="{baseUrl}{event.seo.hreflang[key]}">
            <!--TITLE-->
            <div class="grow flex items-center">
                <h3 part="event-title" class="lt-agenda-title my-1 ml-1 line-clamp-2 max-h-12 sm:max-h-14 text-md sm:text-xl leading-snug tracking-tight font-semibold align-middle"
                    title={event.name[key]}>
                    {event.name[key]}
                </h3>
            </div>
            <!--DATE-->
            <div part="event-date" class="lt-agenda-date text-sm sm:text-md flex items-center sm:mt-2">
                <div class="my-auto mr-2">
                    <Calendar class="text-honey-500" size={24}/>
                </div>

                {#if date}
                <p
                        class="flex w-full leading-snug tracking-tight truncate mt-1"
                        title={sameDays
                        ? date.start.locale($_('date.locale')).format('DD MMMM YYYY')
                        : `${$_('date.start')} ${date.start.locale($_('date.locale')).format('DD MMMM YYYY')} ${$_('date.separator')} ${date.end.locale($_('date.locale')).format('DD MMMM YYYY')}`}
                >
                    {#if sameDays}
                        <span>
                            {date.start.locale($_('date.locale')).format('DD.MM.YY')}
                        </span>
                    {:else}
                        <span class="hidden sm:inline-block pr-1">
                            {$_('date.start')}
                        </span>

                        <span>
                            {date.start.locale($_('date.locale')).format('DD.MM.YY')}
                        </span>

                        <span class="px-1 sm:hidden"> - </span>
                        <span class="px-1 hidden sm:inline-block"
                              title={$_('date.separator')}> {$_('date.separator')} </span>

                        <span>
                            {date.end.locale($_('date.locale')).format('DD.MM.YY')}
                        </span>
                    {/if}
                </p>
                {/if}
            </div>

            <!--LOCATION-->
            <div part="event-location" class="lt-agenda-location text-sm sm:text-md flex w-full mt-2 sm:mt-4">
                {#if (geolocation?.venue ?? geolocation?.address) !== undefined}
                    <div class="my-auto mr-2">
                        <MapPin class="text-honey-500" size={24}/>
                    </div>
                    <p class="leading-snug tracking-tight truncate mt-1"
                       title={geolocation?.venue ?? geolocation?.address}>
                        {geolocation?.venue ?? geolocation?.address}
                    </p>
                {/if}
            </div>
        </Clickable>
    </div>
</div>
