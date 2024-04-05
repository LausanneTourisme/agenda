<script lang="ts">
    import {_, locale} from 'svelte-i18n';

    import {fade} from "svelte/transition";
    import Clickable from "$lib/components/Clickable.svelte";
    import Heading from "$lib/components//Heading.svelte";
    import {Calendar} from "lucide-svelte";
    import type {Event, Media} from "$lib/types";
    import moment from "moment/moment";
    import 'moment/locale/fr-ch';
    import 'moment/locale/en-gb';
    import 'moment/locale/de';
    import {CldImage} from "svelte-cloudinary";

    // trick to bypass error type...
    const key: "fr" | "en" | "de" | "it" | "es" = ($locale ?? "en") as "fr" | "en" | "de" | "it" | "es";

    export let draggable: boolean = false;
    export let event: Event;

    export let preventClick: boolean = false;

    const media: Media | undefined = event.medias.find(x => x.is_cover);

    // TODO Remove hardcoded first dates
    const isSameDays = event.schedules.dates[0].periods[0].start === event.schedules.dates[0].periods[event.schedules.dates[0].periods.length - 1].end;
    const date = {
        start: moment(event.schedules.dates[0].periods[0].start, "YYYY-MM-DD"),
        end: moment(event.schedules.dates[0].periods[event.schedules.dates[0].periods.length - 1].end, "YYYY-MM-DD")
    };

    let mouse
    const mouseDown = (e: Event) => {
        // e.clientX
        console.log(e)
    }
    $: preventClick;
</script>

<div class="card h-full w-56 sm:w-72 rounded-none shadow-none p-4 {preventClick ? 'pointer-events-none' : '' } {$$props.class ?? ''}"
     {draggable} transition:fade>

    <Clickable class="h-full flex flex-col" href="{import.meta.env.VITE_LT_URL}{event.seo.hreflang[key]}"
               on:mousedown={mouseDown}>
        <div class="card-body flex flex-col h-full">
            <!--        TODO add placeholder -->
            <div class="aspect-square sm:h-64">
                {#if media}
                    <CldImage
                            src="{media.cloudinary_id}"
                            alt="{media.copyright}"
                            title="{media.copyright}"
                            height="{500}"
                            width="{500}"
                            sizes="100vw"
                            class="object-cover bg-gray-300"
                            draggable="false"
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
            </div>
            <Heading class="title flex-grow line-clamp-2 max-h-18 text-clip align-middle" tag="h3"
                     title="{event.seo.name[key]}"> {event.seo.name[key]}
            </Heading>
            <div class="flex items-center">
                <div class="mb-1 mr-2">
                    <Calendar class="text-black" size="24px"/>
                </div>

                <p class="flex w-full text-sm">
                    {#if isSameDays}
                        <span class="hidden sm:inline-block"
                              title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}"
                        >
                            {date.start.locale($_('date.locale')).format('DD.MM.YY')}
                        </span>
                    {:else}
                        <span title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}">
                            {date.start.locale($_('date.locale')).format('DD.MM.YY')}
                        </span>

                        <span class="px-1" title="{$_('date.separator')}"> - </span>

                        <span title="{date.end.locale($_('date.locale')).format('DD MMMM YYYY')}">
                            {date.end.locale($_('date.locale')).format('DD.MM.YY')}
                        </span>
                    {/if}


                </p>
            </div>
        </div>
    </Clickable>
</div>

<style lang="scss">
</style>