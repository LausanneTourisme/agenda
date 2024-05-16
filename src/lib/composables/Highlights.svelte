<script lang="ts">
    import {_} from 'svelte-i18n'
    import HighlightCard from "$lib/components/HighlightCard.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import type {Event} from "$lib/types";
    import Swiper from "$lib/components/Swiper.svelte";
    import IntersectionObserver from "$lib/components/IntersectionObserver.svelte";
    import {createEventDispatcher} from "svelte";
    import {log} from "$lib/utils";
    import HighlightCardPlaceholder from "$lib/components/HighlightCardPlaceholder.svelte";

    const dispatch = createEventDispatcher<{
        loadMore: { event: any };
    }>();

    export let events: Event[];
    export let title: string | null | undefined;

    export let loading: boolean = false;

    const placeholders = Array.from({length: 20}, () => HighlightCardPlaceholder)
    let isDragging: boolean = false;

    let lastEvent: Event | null = null


    $: events, lastEvent = events.slice(-1)[0]
    $: lastEvent
    $: loading;
    $: isDragging;

    //TODO add loader + state loading
</script>

<div class="w-full bg-honey-500">
    <div class="pt-7 md:px-7">
        <Heading tag="h3" class="pl-5 md:pl-12 whitespace-nowrap" {title}>
            {title ?? $_('hightlights.title', {default: 'Home'})}
        </Heading>
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
                {#each events as event (event.id)}
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
                <p class="rounded-none shadow-none p-4 h-[320px] sm:h-[440px]">
                    Aucun événement prévu pour les dates sélectionnées. Veuillez choisir d'autres dates.
                </p>
            </div>
        {/if}
    {/if}
</div>

<style lang="scss">
</style>