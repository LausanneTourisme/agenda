<script lang="ts">
    import {_} from 'svelte-i18n'
    import '@splidejs/svelte-splide/css/skyblue';
    import HighlightCard from "$lib/components/HighlightCard.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import type {Event, HistoryStatus} from "$lib/types";
    import {Moon} from "svelte-loading-spinners";
    import {onMount} from "svelte";
    import {sortEvents} from "$lib/date-utils";
    import Swiper from "$lib/components/Swiper.svelte";

    //TODO pass parameters to call back
    export let onLoad: () => Promise<Event[]>;
    export let title: string | null | undefined;

    export let historyStatus: HistoryStatus;

    let loading: boolean = true;
    let isDragging: boolean = false;
    let highlights: Event[] = [];


    onMount(async () => {
        const events = await onLoad();

        highlights = sortEvents(events, {onlyAvailable: false, onlyHighlights: true})
        loading = false;
    });

    $: loading;
    $: isDragging;
</script>

<div class="w-full bg-honey-500">
    {#if loading}
        <Moon size="60" color="#FCBD05" unit="px" duration="1s"/>
    {:else}
        <div class="pt-7 md:px-7">
            <Heading tag="h3" class="pl-5 md:pl-12" {title}>
                {title ?? $_('hightlights.title', {default: 'Home'})}
            </Heading>
        </div>

        <Swiper
                class="highlights pb-4 px-2 sm:px-16 select-none"
                maxContent="{highlights.length}"
                on:dragging={(e) => isDragging = e.detail.isDragging}
        >
            {#each highlights as highlight}
                <HighlightCard preventClick="{isDragging}" event="{highlight}" draggable="{false}"/>
            {/each}
        </Swiper>
    {/if}
</div>

<style lang="scss">
</style>