<script lang="ts">
    import type {NullableString} from "$lib/types";
    import {blankable} from "$lib/utils";
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";
    import {blankableLinks} from "$lib/store";

    export let href: string;
    export let overflow: boolean = false;
    export let preload: true | "" | "hover" | "tap" | "off" | null | undefined = "tap";

    let ready: boolean = false;
    let blankableLinks_value: boolean = true;
    let target: NullableString = blankableLinks_value ? blankable(href) : null;

    blankableLinks.subscribe((value: boolean) => {
        blankableLinks_value = value;
    });

    onMount(() => {
        ready = true;
    })
</script>

{#if ready}
    <a {href} {target}
       class="clickable block group/clickable cursor-pointer {!overflow ? 'overflow-hidden' : ''} {$$props.class ?? ''}"
       on:click
       data-sveltekit-preload-data="{preload}"
       draggable="false"
       transition:fade>
        <slot/>
    </a>
{/if}