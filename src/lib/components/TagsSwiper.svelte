<script lang="ts">
    import type {Tag} from "$lib/types";
    import {Splide, SplideSlide} from "@splidejs/svelte-splide";
    import {locale} from "svelte-i18n";
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher<{tagSelect: { tag: Tag}}>();

    // trick to bypass error type...
    const key: "fr" | "en" | "de" | "it" | "es" = ($locale ?? "en") as "fr" | "en" | "de" | "it" | "es";

    export let tags: Tag[];
    export let selectedTags: Tag[] = [];
    export let withArrow: boolean = false;
    export let withPagination: boolean = false;
    export let perPage: number = 1;
    /**
     * look ResponsiveOptions of splideSvelte's package
     */
    export let swipeBreakpoints: Record<string | number, Object> = {};
    export let swipePadding: string = "0"
    export let tagClass: string = ''

    const selectedTagsName: string[] = selectedTags.map(t => t.name);

    $: selectedTags;
</script>

<div class="{$$props.class}">
    <Splide options={{
        wheel:false,
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
            {@const elementSelected = selectedTagsName.includes(tag.name)? 'border-honey-500 bg-honey-500' : ''}

            <SplideSlide class="pb-0.5">
                <button on:click={() => dispatch('tagSelect', {tag})} class="inline-flex justify-center items-center text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent  py-2 mr-2 {elementSelected} {tagClass}" title="{tag.public_name[key]}">{tag.public_name[key]}</button>
            </SplideSlide>
        {/each}
    </Splide>
</div>