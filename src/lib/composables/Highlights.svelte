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

    export let events: Event[];
    export let title: string | null | undefined;

    export let loading: boolean = false;

    let isDragging: boolean = false;

    let lastEvent: Event | null = null

    $: events, lastEvent = events.slice(-1)[0]
    $: lastEvent
    $: loading;
    $: isDragging;

    //TODO add loader + state loading
</script>

<div class="w-full bg-honey-500 h-[400px] sm:h-[515px]">
    <div class="flex pt-7 md:px-7">
        <Heading tag="h3" class="pl-5 md:pl-12 whitespace-nowrap" {title}>
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
                {#each events as event}
                    <IntersectionObserver enable="{event.id===lastEvent?.id}" once={true} on:intersecting={(e) => {
                        dispatch("loadMore", { event: e });
                        log('load more highlights!', {event, lastEvent: lastEvent?.name})
                    }}>
                        <HighlightCard preventClick="{isDragging}" {event} draggable="{false}"/>
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
