<script lang="ts">
    import {ClassList} from "../ClassList";

    export let tag: string = "h2";
    let style: ClassList = ClassList.make("font-bold");

    $: style;

    switch (tag) {
        case 'h1':
            style.merge('text-3xl md:text-5xl leading-tight tracking-tighter py-3')
            break;
        case "h2":
            style.merge('text-2xl md:text-4xl leading-tight tracking-tighter py-3')
            break;
        case "h3":
            style.merge('text-xl md:text-2xl leading-snug tracking-tight font-semibold mb-2 mt-4')
            break;
        case "h4":
            style.merge('text-lg md:text-xl leading-snug tracking-tight font-medium mb-2 mt-4')
            break;
        default:
            style.merge('text-lg')
    }
</script>

<svelte:element this="{tag}" class="{style.merge($$props.class)}" title="{$$props.title}">
    <slot/>
</svelte:element>