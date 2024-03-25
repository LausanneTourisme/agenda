<script lang="ts">
    import type {Tag} from "$lib/types";
    import {Splide, SplideSlide} from "@splidejs/svelte-splide";
    import {locale} from "svelte-i18n";

    // trick to bypass error type...
    const key: "fr" | "en" | "de" | "it" | "es" = ($locale ?? "en") as "fr" | "en" | "de" | "it" | "es";

    export let tags: Tag[];
    export let withArrow: boolean = false;
    export let withPagination: boolean = false;
    export let perPage: number = 1;
    /**
     * look ResponsiveOptions of splideSvelte's package
     */
    export let swipeBreakpoints: Record<string | number, Object> = {};
    export let swipePadding: string = "0"
    export let tagClass: string = "inline-block text-black border border-black rounded-full hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent px-6 mr-2"
</script>

<div class="{$$props.class}">
    <Splide options={{
        wheel:true,
                        drag: 'free',
                        rewind : false,
                        fixedWidth : 'auto',
                        fixedHeight : 'auto',
                        isNavigation : false,
                        gap : 0,
                        padding: swipePadding,
                        pagination : withPagination,
                        perPage: perPage,
                        snap : true,
                        cover : false,
                        arrows : withArrow,
                        dragMinThreshold: {
                            mouse: 4,
                            touch: 10,
                        },
                        breakpoints: swipeBreakpoints,
                    }}>
        {#each tags as tag}
            <SplideSlide>
                <div class="{tagClass}" title="{tag.public_name[key]}">{tag.public_name[key]}</div>
            </SplideSlide>
        {/each}
    </Splide>
</div>