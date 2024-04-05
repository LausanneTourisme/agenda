<script lang="ts">
    import {blankable, type NullableString} from "../Helpers";
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";

    export let href: string;
    export let overflow: boolean = false;
    export let preload: true | "" | "hover" | "tap" | "off" | null | undefined = "tap";

    let target: NullableString = blankable(href)

    let ready: boolean = false;

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

<style lang="scss">
</style>