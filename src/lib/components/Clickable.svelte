<script lang="ts">
    import {blankable, type NullableString} from "../Helpers";
    import {fade} from "svelte/transition";
    import {onMount} from "svelte";
    import {ClassList} from "../ClassList";

    export let href: string;
    export let overflow: boolean = false;
    export let preload: true | "" | "hover" | "tap" | "off" | null | undefined = "tap";

    let target: NullableString = blankable(href)

    let style: ClassList = ClassList.make([
        "block group/clickable cursor-pointer",
        !overflow && "overflow-hidden",
    ]);

    $: style;

    let ready: boolean = false;

    onMount(() => {
        ready = true;
    })
</script>

{#if ready}
    <a {href} {target} class="{style.merge($$props.class)}" on:click data-sveltekit-preload-data="{preload}"
       transition:fade>
        <slot/>
    </a>
{/if}