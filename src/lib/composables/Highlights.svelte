<script context="module" lang="ts">
    export type Highlight = {
        title: string,
        imgSrc: string,
        imgCopyright: string,
        href: string,
        dates: string[], //Y-m-d format
    }
</script>
<script lang="ts">
    //TODO use shadcn-svelte
    import {_} from 'svelte-i18n'
    import {Splide, SplideSlide} from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css/skyblue';
    import HighlightCard from "$lib/components/HighlightCard.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import {Moon} from "svelte-loading-spinners";

    //TODO pass parameters to call back
    export let onLoad: () => Highlight[];

    export let title: string | null;
</script>

<div class="w-full bg-yellow-400">
    <div class="pt-7 md:px-7">
        <Heading tag="h2" class="p-5 md:pl-12" {title}>
            {title ?? $_('hightlights.title', {default: 'Home'})}
        </Heading>
    </div>

    <div class="highlights pb-4">
        <Splide aria-label="{title}" options={{
            rewind: false,
            drag: 'free',
            fixedWidth : 'auto',
            padding: "4rem",
            snap: true,
            pagination: false,
            breakpoints: {
                500: {
                    padding: "3rem",
                },
            }
        }}>
            {#each onLoad() as highlight}
                <SplideSlide>
                    <HighlightCard {...highlight}
                    />
                </SplideSlide>
            {/each}
        </Splide>
    </div>
</div>

<style lang="scss">
  .highlights {
    min-height: 400px;
  }
</style>