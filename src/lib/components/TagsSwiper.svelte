<script lang="ts">
    import type {Locales, Tag} from "$lib/types";
    import {_, locale} from "svelte-i18n";
    import Swiper from "$lib/components/Swiper.svelte";
    import {defaultLocale} from "$lib/utils";
    import Pill from "$lib/components/Pill.svelte";

    interface Props {
        tags: Tag[];
        displayBtnAll?: boolean;
        selectedTags?: Tag[];
        tagClass?: string;
        tagPart?: string;
        class?: string;
        ontagselect?: (tag: Tag | null) => void;
    }

    let {tags, displayBtnAll = false, selectedTags = [], tagClass = "", tagPart = "tag", class: className = "", ontagselect}: Props = $props();

    let isDragging: boolean = false;

    const pills = $derived(tags.map(t => {
        const selected = selectedTags.some(x => x.name === t.name);

        return {
            title: t.public_name[($locale ?? defaultLocale) as Locales] ?? t.public_name.fr,
            selected,
            class: selected ? `${tagClass} border-honey-500 bg-honey-500` : tagClass,
            part: selected ? `${tagPart} ${tagPart}-selected` : tagPart,
            tag: t,
        };
    }));
</script>

<Swiper
        class="text-nowrap pb-2 {className}"
        maxContent={tags.length + (displayBtnAll ? 1 : 0)}
        ondragging={(dragging) => {
            if (!dragging) {
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
            onclick={() => {
                if (isDragging) return;
                ontagselect?.(null)
            }}
            class="{selectedTags && selectedTags.length === 0 ? 'border-honey-500 bg-honey-500' : ''} {tagClass}"
            part={selectedTags.length === 0 ? `${tagPart} ${tagPart}-selected` : tagPart}
            title={$_('agenda.tags.display_all')}
        />
    {/if}
    {#each pills as pill}
        <Pill
            onclick={() => {
                if (isDragging) return;
                ontagselect?.(pill.tag)
            }}
            class={pill.class}
            part={pill.part}
            title={pill.title}
        />
    {/each}
</Swiper>
