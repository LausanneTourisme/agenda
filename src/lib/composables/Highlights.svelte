<script lang="ts">
    import {_} from 'svelte-i18n'
    import HighlightCard from "$lib/components/HighlightCard.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import type {Event} from "$lib/types";
    import Swiper from "$lib/components/Swiper.svelte";
    import IntersectionObserver from "$lib/components/IntersectionObserver.svelte";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher<{
        loadMore: { event: any };
    }>();

    export let events: Event[];
    export let title: string | null | undefined;

    let isDragging: boolean = false;

    let lastEvent: Event | null = null

    $: events, lastEvent = events[events.length - 1] ?? null;
    $: isDragging;
</script>

<div class="w-full bg-honey-500">
    <div class="pt-7 md:px-7">
        <Heading tag="h3" class="pl-5 md:pl-12 whitespace-nowrap" {title}>
            {title ?? $_('hightlights.title', {default: 'Home'})}
        </Heading>
    </div>

    {#if events.length!==0}
        <Swiper
                class="highlights pb-4 px-2 sm:px-16 select-none"
                maxContent="{events.length}"
                on:dragging={(e) => isDragging = e.detail.isDragging}
        >
            {#each events as event (event.id)}
                <IntersectionObserver enable="{event.id===lastEvent?.id}" on:intersecting={(e) => {dispatch("loadMore", { event: e })}}>
                    <HighlightCard preventClick="{isDragging}" {event} draggable="{false}"/>
                </IntersectionObserver>
            {/each}
        </Swiper>
    {:else}
        <div class="highlights pb-4 px-2 sm:px-16 select-none">
            <p class="h-full rounded-none shadow-none p-4 h-[430px]">
                Aucun événement prévu pour les dates sélectionnées. Veuillez choisir d'autres dates.
            </p>
        </div>
    {/if}
</div>

<style lang="scss">
</style>