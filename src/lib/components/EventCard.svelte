<script lang="ts">
    import {_, locale} from "svelte-i18n";
    import {Calendar, Clock, MapPin} from "lucide-svelte";
    import type {Event, Geolocation} from "$lib/types";
    import 'moment/locale/fr-ch';
    import 'moment/locale/en-gb';
    import 'moment/locale/de';
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import {CldImage} from "svelte-cloudinary";
    import Clickable from "$lib/components/Clickable.svelte";
    import {extractStartEndDate, isSameDays} from "$lib/date-utils";
    import type {Moment} from "moment";

    let key: string;

    export let event: Event;
    export let baseUrl: string;

    let date: { start: Moment, end: Moment };


    const geolocation: Geolocation | undefined = event.geolocations?.find(x => x.main_address);

    const media = event.medias.find(x => x.is_cover)

    $: date = extractStartEndDate(event);
    $: key = ($locale ?? "en");
</script>

{#key event.id}
    <div data-id="{event.id}"
         class="event-card flex flex-row bg-slate-100 w-full rounded-sm overflow-hidden {$$props.class ?? ''}">
        <div class="image-wrapper aspect-square h-40 sm:h-64">

            <Clickable href="{baseUrl}{event.seo.hreflang[key]}">
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
                         alt="invalide"
                         title="invalided"
                         height="500"
                         width="500"
                         class="object-cover"
                    />
                {/if}
            </Clickable>
        </div>
        <div class="informations flex flex-col flex-1 overflow-hidden">
            <!--TAGS-->
            <TagsSwiper class="tags mx-3 mt-1.5 sm:mt-4 sm:mx-5 cursor-pointer"
                        tagClass="flex justify-content items-center text-sm  mr-2 sm:text-md px-3 sm:py-1 sm:px-2 text-black border border-black rounded-full hover:border-honey-500 has-[:checked]:border-honey-500 hover:bg-honey-500 has-[:checked]:bg-honey-500 items-center ring-2 ring-transparent"
                        tags="{event.tags}"/>


            <Clickable class=" px-2 pb-2 sm:px-4 sm:pb-4 flex-grow flex flex-col"
                       href="{import.meta.env.VITE_LT_URL}{event.seo.hreflang[key]}">
                <!--TITLE-->
                <div class="flex-grow flex items-center">
                    <p class="title my-1 ml-1 line-clamp-2 max-h-12 sm:max-h-14 text-md sm:text-xl leading-snug tracking-tight font-semibold align-middle"
                       title="{event.name[key]}">
                        {event.name[key]}
                    </p>
                </div>
                <!--DATE-->
                <div class="date text-sm sm:text-md flex items-center sm:mt-2">
                    <div class="mb-1 mr-2">
                        <Calendar class="text-honey-500" size="24px"/>
                    </div>

                    <p class="flex w-full leading-snug tracking-tight truncate mt-1">
                        {#if isSameDays(event)}
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
                <div class="schedule text-sm sm:text-md hidden sm:flex w-full sm:mt-4 ">
                    <div class="mr-2">
                        <Clock class="text-honey-500" size="24px"/>
                    </div>
                    <p class="leading-snug tracking-tight mt-1"
                       title="{$_('date.from')} 17:00">
                        {$_('date.from')} 17:00
                    </p>
                </div>
                <!--LOCATION-->
                <div class="location text-sm sm:text-md flex w-full mt-2 sm:mt-4">
                    {#if (geolocation?.venue ?? geolocation?.address) !== undefined}
                    <div class="mr-2">
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
{/key}

<style lang="scss">
</style>