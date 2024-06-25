<script lang="ts">
    import type {Event, Media} from "$lib/types";
    import moment, {type Moment} from "moment";
    import 'moment/dist/locale/fr-ch';
    import 'moment/dist/locale/en-gb';
    import 'moment/dist/locale/de';
    import {_, locale} from 'svelte-i18n';
    import {fade} from "svelte/transition";
    import Clickable from "$lib/components/Clickable.svelte";
    import Heading from "$lib/components//Heading.svelte";
    import {Calendar} from "lucide-svelte";
    import {CldImage} from "svelte-cloudinary";
    import {extractStartEndDate, isSameDays} from "$lib/date-utils";
    import {defaultLocale, log} from "$lib/utils";
    import {onMount} from "svelte";

    let key: string;
    export let baseUrl: string;
    export let selectedDates: { start: string, end: string|undefined|null };
    export let preventClick: boolean = false;
    export let draggable: boolean = false;
    export let event: Event;

    const media: Media | undefined = event.medias.find(x => x.is_cover);

    let date: { start: Moment, end: Moment } = extractStartEndDate(event, selectedDates);

    const mouseDown = (e: Event) => {
        // e.clientX
        log('mouse down', {mouse_event: e})
    }

    onMount(() => moment.locale('fr-ch'));

    $: preventClick;
    $: $locale;
    $: key = ($locale ?? defaultLocale);
</script>

<div data-id="{event.id}"
     class="lt-agenda-highlight-card h-full rounded-none shadow-none p-4 {preventClick ? 'pointer-events-none' : '' } {$$props.class ?? ''}"
     {draggable}
     transition:fade
>
    <Clickable class="h-full flex flex-col" href="{baseUrl}{event?.seo?.hreflang[key]}"
               on:mousedown={(e) => mouseDown(e)}>
        <div class="lt-agenda-highlight-card-body w-min flex flex-col h-full">
            <div class="aspect-square w-44 sm:w-72">
                {#if media}
                    <CldImage
                            src="{media.cloudinary_id}"
                            alt="{media.copyright}"
                            title="{media.copyright}"
                            height={500}
                            width={500}
                            sizes="100vw"
                            class="object-cover bg-honey-800 break-all text-wrap"
                            draggable="false"
                    />
                {:else}
                    <img src="https://static.lausanne-tourisme.ch/image/upload/v1588747700/fgbcshmie94gzvhjxqoc.jpg"
                         alt="{$_('copyright')}"
                         title="{$_('copyright')}"
                         height=500
                         width=500
                         class="object-cover bg-honey-800 break-all text-wrap"
                    />
                {/if}
            </div>
            <Heading class="lt-agenda-title line-clamp-2 h-16 max-h-16 text-clip my-2"
                     tag="h3"
                     title="{event.name[key]}">
                {event.name[key]}
            </Heading>
            <div class="lt-agenda-highlight-dates flex items-center">
                <div class="mb-1 mr-2">
                    <Calendar class="text-black" size="24px"/>
                </div>

                <p class="flex w-full text-sm">
                    {#if isSameDays(event, selectedDates)}
                            <span title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}">
                                {date.start.format('DD.MM.YY')}
                            </span>
                    {:else}
                            <span title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}">
                                {date.start.format('DD.MM.YY')}
                            </span>

                        <span class="px-1" title="{$_('date.separator')}"> - </span>

                        <span title="{date.end.locale($_('date.locale')).format('DD MMMM YYYY')}">
                                {date.end.format('DD.MM.YY')}
                            </span>
                    {/if}
                </p>
            </div>
        </div>
    </Clickable>
</div>
