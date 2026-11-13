<script lang="ts">
    import type {Event} from "$lib/types";
    import {_} from 'svelte-i18n'
    import HighlightCard from "$lib/components/HighlightCard.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import Swiper from "$lib/components/Swiper.svelte";
    import IntersectionObserver from "$lib/components/IntersectionObserver.svelte";
    import {log} from "$lib/utils";
    import HighlightCardPlaceholder from "$lib/components/HighlightCardPlaceholder.svelte";
    import Loader from "$lib/components/Loader.svelte";

    interface Props {
        baseUrl: string;
        selectedDates: { start: string, end: string | undefined | null };
        events: Event[];
        title: string | null | undefined;
        hideTitle?: boolean | null | undefined;
        loading?: boolean;
        loadingAllContent?: boolean;
        onloadmore?: (detail: { event: any }) => void;
    }

    let {
        baseUrl,
        selectedDates,
        events,
        title,
        hideTitle = false,
        loading = false,
        loadingAllContent = false,
        onloadmore,
    }: Props = $props();

    let isDragging: boolean = $state(false);

    const lastEvent: Event | null = $derived(events.slice(-1)[0] ?? null);

    // ids of last interaction observe, prevent multiple calls
    const lastIntersections: number[] = [];
</script>

<div part="highlights" class="w-full bg-honey-500 min-h-100 max-h-104 sm:min-h-128.75 md:max-h-132">
    {#if !hideTitle}
        <div class="flex pt-7 md:px-7">
            <Heading tag="h2" class="text-2xl! font-semibold pl-5 md:pl-12 whitespace-nowrap" part="highlights-title" {title}>
                {title ?? $_('highlights.title', {default: 'Home'})}
            </Heading>
        </div>
    {/if}
    {#if loading}
        <div class="flex justify-center pt-7 md:px-7">
            <Loader class="ml-3" size={30}/>
        </div>
        <Swiper
                class="highlights pb-4 px-2 sm:px-16 select-none"
                maxContent={events.length}
                ondragging={(dragging) => isDragging = dragging}
        >
            {#each {length: 20} as _}
                <HighlightCardPlaceholder/>
            {/each}
        </Swiper>
    {:else}
        {#if events.length !== 0}
            <Swiper
                    class="highlights pb-4 px-2 sm:px-16 select-none"
                    maxContent={events.length}
                    ondragging={(dragging) => isDragging = dragging}
            >
                {#each events as event (event.seo.slug.fr)}
                    <IntersectionObserver enable={!loadingAllContent && event.id === lastEvent?.id} onintersecting={(e) => {
                        if (lastIntersections.includes(event.id)) return;

                        lastIntersections.push(event.id)
                        onloadmore?.({event: e});
                        log('load more highlights!', {event, lastEvent: lastEvent?.name})
                    }}>
                        <HighlightCard preventClick={isDragging} {baseUrl} {selectedDates} {event}
                                       draggable={false}/>
                    </IntersectionObserver>
                {/each}
            </Swiper>
        {:else}
            <div class="highlights pb-4 px-2 sm:px-16 select-none">
                <p class="rounded-none shadow-none p-4 h-100 sm:h-128.75">
                    {$_('highlights.nothing')}
                </p>
            </div>
        {/if}
    {/if}
</div>
