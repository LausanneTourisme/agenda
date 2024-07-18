<script lang="ts">
    export let title: string;

    $: $$props.class;
</script>

<button on:click
        class={$$props.class}
        title="{title}">
    {title}
</button>