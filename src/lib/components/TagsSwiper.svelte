<script lang="ts">
    import type {Tag} from "$lib/types";
    import {_, locale} from "svelte-i18n";
    import {createEventDispatcher} from 'svelte';
    import Swiper from "$lib/components/Swiper.svelte";
    import {defaultLocale} from "$lib/utils";

    const dispatch = createEventDispatcher<{ tagSelect: { tag: Tag | null | undefined } }>();

    let key: string;

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
    $: key = ($locale ?? defaultLocale);
</script>

<Swiper class="text-nowrap pb-2 {$$props.class ?? ''}" maxContent="{tags.length + (displayBtnAll ? 1:0)}">
    {#if displayBtnAll}
        <button on:click={() => dispatch('tagSelect', {tag: null})}
                class="{selectedTags && selectedTags.length===0? 'border-honey-500 bg-honey-500' : ''} {tagClass}"
                title="{$_('agenda.tags.display_all')}">{$_('agenda.tags.display_all')}
        </button>
    {/if}
    {#each tags as tag, i}
        {@const elementSelected = selectedTagsName.includes(tag.name) ? 'border-honey-500 bg-honey-500' : ''}

        <button on:click={() => dispatch('tagSelect', {tag})}

                class="{elementSelected} {tagClass}"
                title="{tag.public_name[key]}">{tag.public_name[key]}
        </button>
    {/each}
</Swiper>