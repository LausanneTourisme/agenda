<script lang="ts">
    import {_, locale} from 'svelte-i18n';

    import {fade} from "svelte/transition";
    import Clickable from "$lib/components/Clickable.svelte";
    import Heading from "$lib/components//Heading.svelte";
    import {Calendar} from "lucide-svelte";
    import type {Event, Media} from "$lib/types";
    import 'moment/locale/fr-ch';
    import 'moment/locale/en-gb';
    import 'moment/locale/de';
    import {CldImage} from "svelte-cloudinary";
    import {extractStartEndDate, isSameDays} from "$lib/date-utils";
    import type {Moment} from "moment";

    let key: string;

    export let preventClick: boolean = false;
    export let draggable: boolean = false;
    export let event: Event;


    const media: Media | undefined = event.medias.find(x => x.is_cover);


    let date: { start: Moment, end: Moment };

    const mouseDown = (e: Event) => {
        // e.clientX
        console.log(e)
    }

    $: preventClick;
    $: locale;
    $: date = extractStartEndDate(event);
    $: key = ($locale ?? "en");
</script>

{#key event.id}
    <div data-id="{event.id}"
         class="card h-full rounded-none shadow-none p-4 {preventClick ? 'pointer-events-none' : '' } {$$props.class ?? ''}"
         {draggable}
         transition:fade
    >
        <Clickable class="h-full flex flex-col" href="{import.meta.env.VITE_LT_URL}{event?.seo?.hreflang[key]}"
                   on:mousedown={(e) => mouseDown(e)}>
            <div class="card-body flex flex-col h-full">
                <!--        TODO add placeholder -->
                <div class="aspect-square w-44 sm:w-72">
                    {#if media}
                        <CldImage
                                src="{media.cloudinary_id}"
                                alt="{media.copyright}"
                                title="{media.copyright}"
                                height={500}
                                width={500}
                                sizes="100vw"
                                class="object-cover bg-honey-800"
                                draggable="false"
                        />
                    {:else}
                        <img src="./TODO_placeholder.png"
                             alt="invalide"
                             title="invalided"
                             height=500
                             width=500
                             class="object-cover bg-honey-800"
                        />
                    {/if}
                </div>
                <Heading class="title line-clamp-2 h-16 max-h-16 text-clip my-2"
                         tag="h3"
                         title="{event.name[key]}">
                    {event.name[key]}
                </Heading>
                <div class="flex items-center">
                    <div class="mb-1 mr-2">
                        <Calendar class="text-black" size="24px"/>
                    </div>

                    <p class="flex w-full text-sm">
                        {#if isSameDays(event)}
                        <span title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}">
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
{/key}

<style lang="scss">
</style>