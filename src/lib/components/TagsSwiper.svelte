<script lang="ts">
    import type {Tag} from "$lib/types";
    import {_, locale} from "svelte-i18n";
    import {afterUpdate, createEventDispatcher} from 'svelte';
    import Swiper from "$lib/components/Swiper.svelte";
    import {defaultLocale} from "$lib/utils";
    import Pill from "$lib/components/Pill.svelte";

    const dispatch = createEventDispatcher<{ tagSelect: { tag: Tag | null | undefined } }>();

    let key: string;

    export let tags: Tag[];
    export let displayBtnAll: boolean = false
    export let selectedTags: Tag[] = [];

    export let tagClass: string = ''

    let pills: { title: string, selected: boolean, class: string, tag: Tag }[] = [];

    let isDragging: boolean = false;

    afterUpdate(() => {
        pills = tags.map(t => {
            const selected = selectedTags.some(x => x.name === t.name);

            return {
                title: t.public_name[$locale ?? defaultLocale],
                selected,
                class: selected ? `${tagClass} border-honey-500 bg-honey-500` : tagClass,
                tag: t,
            };
        })
    })

    $: isDragging;
    $: selectedTags;
    $: key = ($locale ?? defaultLocale);
</script>

<Swiper
        class="text-nowrap pb-2 {$$props.class ?? ''}"
        maxContent="{tags.length + (displayBtnAll ? 1:0)}"
        on:dragging={(e) => {
            if(!e.detail.isDragging) {
                setTimeout(() => {
                    isDragging = false
                }, 100);
                return;
            }

            isDragging = true
        }}
>
    {#if displayBtnAll}
        <Pill
            on:click={() => {
                if (isDragging) return;
                dispatch('tagSelect', {tag: null})
            }}
            class="{selectedTags && selectedTags.length===0? 'border-honey-500 bg-honey-500' : ''} {tagClass}"
            title={$_('agenda.tags.display_all')}
        />
    {/if}
    {#each pills as pill}
        <Pill
            on:click={() => {
                if (isDragging) return;
                dispatch('tagSelect', {tag: pill.tag})
            }}
            class={pill.class}
            title={pill.title}
        />
    {/each}
</Swiper>