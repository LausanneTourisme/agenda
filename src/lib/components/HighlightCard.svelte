<script lang="ts">
    import type {Event, Locales, Media} from "$lib/types";
    import moment from "moment";
    import 'moment/dist/locale/fr-ch';
    import 'moment/dist/locale/en-gb';
    import 'moment/dist/locale/de';
    import {_, locale} from 'svelte-i18n';
    import {fade} from "svelte/transition";
    import Clickable from "$lib/components/Clickable.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import {Calendar} from "@lucide/svelte";
    import {CldImage} from "svelte-cloudinary";
    import {extractStartEndDate, isSameDays} from "$lib/date-utils";
    import {defaultLocale, error} from "$lib/utils";
    import {onMount} from "svelte";

    interface Props {
        baseUrl: string;
        selectedDates: { start: string, end: string | undefined | null };
        preventClick?: boolean;
        draggable?: boolean;
        event: Event;
        class?: string;
    }

    let {baseUrl, selectedDates, preventClick = false, draggable = false, event, class: className = ""}: Props = $props();

    const media: Media | undefined = $derived(event.medias.find(x => x.is_cover));

    const date = $derived(extractStartEndDate(event, selectedDates));
    const sameDate = $derived(isSameDays(event, selectedDates));

    $effect(() => {
        try {
            date?.start.locale($_('date.locale')).format('DD MMMM YYYY')
        } catch (e) {
            error("can't apply date", {e, event, date, date_locale: $_('date.locale')})
        }
    });

    onMount(() => moment.locale('fr-ch'));

    const key = $derived(($locale ?? defaultLocale) as Locales);
</script>

<div data-id="{event.id}"
     part="highlight-card"
     class="lt-agenda-highlight-card h-full rounded-none shadow-none p-4 {preventClick ? 'pointer-events-none' : '' } {className}"
     {draggable}
     transition:fade
>
    <Clickable class="h-full flex flex-col" href="{baseUrl}{event?.seo?.hreflang[key]}">
        <div class="lt-agenda-highlight-card-body w-min flex flex-col h-full">
            <div class="aspect-square w-44 sm:w-72">
                {#if media}
                    <CldImage
                            src={media.cloudinary_id}
                            alt={media.copyright}
                            title={media.copyright}
                            height={500}
                            width={500}
                            sizes="100vw"
                            class="object-cover bg-honey-800 break-all text-wrap"
                            draggable="false"
                    />
                {:else}
                    <img src="https://static.lausanne-tourisme.ch/image/upload/v1588747700/fgbcshmie94gzvhjxqoc.jpg"
                         alt={$_('copyright')}
                         title={$_('copyright')}
                         height=500
                         width=500
                         class="object-cover bg-honey-800 break-all text-wrap"
                    />
                {/if}
            </div>
            <Heading class="lt-agenda-title line-clamp-2 h-16 max-h-16 text-clip my-2"
                     part="highlight-title"
                     tag="h3"
                     title={event.name[key]}>
                {event.name[key]}
            </Heading>
            <div part="highlight-dates" class="lt-agenda-highlight-dates flex items-center">
                <div class="mb-1 mr-2">
                    <Calendar class="text-black" size={24}/>
                </div>

                {#if date}
                <p
                    class="flex w-full text-sm"
                    title={sameDate
                    ? date.start.locale($_('date.locale')).format('DD MMMM YYYY')
                    :`${$_('date.start')} ${date.start.locale($_('date.locale')).format('DD MMMM YYYY')} ${$_('date.separator')} ${date.end.locale($_('date.locale')).format('DD MMMM YYYY')}`}
                >
                    {#if sameDate}
                        <span>
                            {date.start.format('DD.MM.YY')}
                        </span>
                    {:else}
                        <span>
                            {date.start.format('DD.MM.YY')}
                        </span>

                        <span class="px-1"> - </span>

                        <span>
                            {date.end.format('DD.MM.YY')}
                        </span>
                    {/if}
                </p>
                {/if}
            </div>
        </div>
    </Clickable>
</div>
