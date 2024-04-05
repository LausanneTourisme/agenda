<script lang="ts">

    export let tag: string = "h2";

</script>

{#if tag === 'h1'}
    <svelte:element this="{tag}"
                    class="text-5xl leading-tight tracking-tighter py-3 {$$props.class ?? ''}"
                    title="{$$props.title}">
        <slot/>
    </svelte:element>
{:else if tag === 'h2'}
    <svelte:element this="{tag}"
                    class="text-4xl leading-tight tracking-tighter py-3 {$$props.class ?? ''}"
                    title="{$$props.title}">
        <slot/>
    </svelte:element>
{:else if tag === 'h3'}
    <svelte:element this="{tag}"
                    class="text-2xl leading-snug tracking-tight font-semibold mb-2 {$$props.class ?? ''}"
                    title="{$$props.title}">
        <slot/>
    </svelte:element>
{:else if tag === 'h4'}
    <svelte:element this="{tag}"
                    class="text-xl leading-snug tracking-tight font-medium mb-2 {$$props.class??''}"
                    title="{$$props.title}">
        <slot/>
    </svelte:element>
{:else}
    <svelte:element this="{tag}"
                    class="text-lg {$$props.class??''}"
                    title="{$$props.title}">
        <slot/>
    </svelte:element>
{/if}
