<script lang="ts">
    import type {Tag} from "$lib/types";
    import {_, locale} from "svelte-i18n";
    import {createEventDispatcher} from 'svelte';
    import Swiper from "$lib/components/Swiper.svelte";

    const dispatch = createEventDispatcher<{ tagSelect: { tag: Tag | null | undefined } }>();

    // trick to bypass error type...
    const key: "fr" | "en" | "de" | "it" | "es" = ($locale ?? "en") as "fr" | "en" | "de" | "it" | "es";

    export let tags: Tag[];
    export let displayBtnAll: boolean = false
    export let selectedTags: Tag[] | undefined = undefined;

    export let tagClass: string = ''

    const selectedTagsName: string[] = selectedTags?.map(t => t.name) ?? [];

    let carousel = HTMLElement;
    let mouseDown: boolean = false;

    const startDragging = (event: Event) => {
        mouseDown = true;
    }

    const stopDragging = (event: Event) => {
        mouseDown = false;
    }
    const move = (event: Event) => {
        if (!mouseDown) return;

        carousel.scrollLeft -= event.movementX
    }

    $: selectedTags;
</script>

<Swiper class="{$$props.class ?? ''}" maxContent="{tags.length + (displayBtnAll ? 1:0)}">
    {#if displayBtnAll}
        <button on:click={() => dispatch('tagSelect', {tag: null})}
                class="py-2 mr-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 ring-transparent {selectedTags && selectedTags.length===0? 'border-honey-500 bg-honey-500' : ''} {tagClass}"
                title="{$_('agenda.tags.display-all')}">{$_('agenda.tags.display-all')}
        </button>
    {/if}
    {#each tags as tag, i}
        {@const elementSelected = selectedTagsName.includes(tag.name) ? 'border-honey-500 bg-honey-500' : ''}

        <button on:click={() => dispatch('tagSelect', {tag})}

                class="py-2 mr-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 ring-transparent {elementSelected} {tagClass}"
                title="{tag.public_name[key]}">{tag.public_name[key]}
        </button>
    {/each}
</Swiper>