<script lang="ts">
    //TODO use shadcn-svelte
    import {_} from 'svelte-i18n'
    import {Splide, SplideSlide} from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css/skyblue';
    import HighlightCard from "$lib/components/HighlightCard.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import type {Event, Period, ScheduleDate} from "$lib/types";
    import {Moon} from "svelte-loading-spinners";
    import {onMount} from "svelte";

    import moment from "moment";
    import {sortEvents} from "$lib/date-utils";

    //TODO pass parameters to call back
    export let onLoad: () => Promise<Event[]>;

    let loading = true;
    let highlights: Event[] = [];

    onMount(async () => {
        const events = await onLoad();

        highlights = sortEvents(events, {onlyAvailable: false, onlyHighlights: true})
        loading = false;
    });

    $: loading;

    export let title: string | null;
</script>

<div class="w-full bg-yellow-400">
    {#if loading}
        <Moon size="60" color="#FCBD05" unit="px" duration="1s"/>
    {:else}
        <div class="pt-7 md:px-7">
            <Heading tag="h2" class="p-5 md:pl-12" {title}>
                {title ?? $_('hightlights.title', {default: 'Home'})}
            </Heading>
        </div>

        <div class="highlights pb-4">
            <Splide options={{
                rewind: false,
                drag: 'free',
                fixedWidth : 'auto',
                padding: "4rem",
                snap: true,
                arrows: false,
                pagination: false,
                breakpoints: {
                    767: {
                        padding: "0.5rem",
                    },
                }
            }}>
                {#each highlights as highlight}
                    <SplideSlide>
                        <HighlightCard event="{highlight}"/>
                    </SplideSlide>
                {/each}
            </Splide>
        </div>
    {/if}
</div>

<style lang="scss">
</style>