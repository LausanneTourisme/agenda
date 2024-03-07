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
    import {Splide, SplideSlide} from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css/skyblue';
    import HighlightCard from "$lib/components/HighlightCard.svelte";
    import Heading from "$lib/components/Heading.svelte";
    import {Moon} from "svelte-loading-spinners";

    //TODO pass parameters to call back
    export let onLoad: () => Highlight[];

    export let title: string;
</script>

<div class="w-full bg-yellow-400">
    <Heading tag="h2" class="pt-7 pl-7" {title}>
        {title}
    </Heading>

    <div class="highlights">
        <Splide aria-label="{title}" options={{
            rewind: false,
            drag: 'free',
            snap: true,
            perPage: 10,
            padding: "4rem",
            pagination: false,
            breakpoints: {
                3000: {
                    padding: "4rem",
                    perPage:8
                },
                2500: {
                    padding: "4rem",
                    perPage:7
                },
                2000: {
                    padding: "4rem",
                    perPage:6
                },
                1700: {
                    padding: "4rem",
                    perPage:4
                },
                1190: {
                    padding: "4rem",
                    perPage:3
                },
                900: {
                    padding: "2rem",
                    perPage:3
                },
                850: {
                    padding: "4rem",
                    perPage:2
                },
                650: {
                    padding: "3rem",
                    perPage:2
                },
                630: {
                    padding: "auto",
                    focus: 'center',
                    perPage:2
                },
                620: {
                    padding: "2rem",
                    focus: 'center',
                  trimSpace  : true,
                    perPage:2
                },
                600: {
                    padding: '9rem',
                    perPage    : 1,

                    trimSpace  : true,
                },
                575: {
                    padding: '5rem',
                    perPage    : 1,
                    focus      : 'center',
                    trimSpace  : false,
                },
                420: {
                    padding: '2.5rem',
                    perPage    : 1,
                },
                340: {
                    padding: '1.5rem',
                    perPage    : 1,
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