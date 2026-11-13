<script lang="ts">
    import type {Snippet} from "svelte";
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";
    import {blankableLinks} from "$lib/store";

    interface Props {
        href: string;
        overflow?: boolean;
        preload?: true | "" | "hover" | "tap" | "off" | null | undefined;
        class?: string;
        onclick?: (event: MouseEvent) => void;
        children?: Snippet;
    }

    let {href, overflow = false, preload = "tap", class: className = "", onclick, children}: Props = $props();

    let ready: boolean = $state(false);
    const target = $derived($blankableLinks ? "_blank" : null);

    onMount(() => {
        ready = true;
    })
</script>

{#if ready}
    <a {href} {target}
       class="lt-agenda-clickable block group/clickable cursor-pointer {!overflow ? 'overflow-hidden' : ''} {className}"
       {onclick}
       data-sveltekit-preload-data={preload}
       draggable="false"
       transition:fade>
        {@render children?.()}
    </a>
{/if}
