<script lang="ts">
    import type {Event} from "$lib/types";
    import {_} from 'svelte-i18n'
    import HighlightCard from "$lib/components/HighlightCard.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import Swiper from "$lib/components/Swiper.svelte";
    import IntersectionObserver from "$lib/components/IntersectionObserver.svelte";
    import {createEventDispatcher} from "svelte";
    import {log} from "$lib/utils";
    import HighlightCardPlaceholder from "$lib/components/HighlightCardPlaceholder.svelte";
    import Loader from "$lib/components/Loader.svelte";

    const dispatch = createEventDispatcher<{
        loadMore: { event: any };
    }>();

    export let baseUrl: string;
    export let selectedDates: { start: string, end: string | undefined | null };

    export let events: Event[];
    export let title: string | null | undefined;

    export let loading: boolean = false;
    export let loadingAllContent: boolean = false;

    let isDragging: boolean = false;

    let lastEvent: Event | null = null

    //ids of last interaction observe, prevent multiple calls
    let lastIntersections: number[] = []

    $: events, lastEvent = events.slice(-1)[0]
    $: lastEvent
    $: loading;
    $: isDragging;
</script>

<div class="w-full bg-honey-500 min-h-[400px] max-h-fit sm:min-h-[515px]">
    <div class="flex pt-7 md:px-7">
        <Heading tag="h2" class="!text-2xl font-semibold pl-5 md:pl-12 whitespace-nowrap" {title}>
            {title ?? $_('highlights.title', {default: 'Home'})}
        </Heading>
        {#if loading}
            <Loader class="ml-3" size="{30}"/>
        {/if}
    </div>
    {#if loading}
        <Swiper
                class="highlights pb-4 px-2 sm:px-16 select-none"
                maxContent="{events.length}"
                on:dragging={(e) => isDragging = e.detail.isDragging}
        >
            {#each {length: 20} as _}
                <HighlightCardPlaceholder/>
            {/each}
        </Swiper>
    {:else}
        {#if events.length !== 0}
            <Swiper
                    class="highlights pb-4 px-2 sm:px-16 select-none"
                    maxContent="{events.length}"
                    on:dragging={(e) => isDragging = e.detail.isDragging}
            >
                {#each events as event, index (event.seo.slug.fr)}
                    <IntersectionObserver enable="{!loadingAllContent && event.id===lastEvent?.id}" on:intersecting={(e) => {
                        if (lastIntersections.includes(event.id)) return;

                        lastIntersections.push(event.id)
                        dispatch("loadMore", { event: e });
                        log('load more highlights!', {event, lastEvent: lastEvent?.name})
                    }}>
                        <HighlightCard preventClick="{isDragging}" {baseUrl} {selectedDates} {event}
                                       draggable="{false}"/>
                    </IntersectionObserver>
                {/each}
            </Swiper>
        {:else}
            <div class="highlights pb-4 px-2 sm:px-16 select-none">
                <p class="rounded-none shadow-none p-4 h-[400px] sm:h-[515px]">
                    {$_('highlights.nothing')}
                </p>
            </div>
        {/if}
    {/if}
</div>
