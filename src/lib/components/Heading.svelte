<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        tag?: string;
        class?: string;
        title?: string | null;
        part?: string;
        children?: Snippet;
    }

    let {tag = "h2", class: className = "", title, part, children}: Props = $props();

    // Classes must stay statically written for Tailwind to detect them.
    const tagClasses: Record<string, string> = {
        h1: "text-5xl leading-tight tracking-tighter py-3",
        h2: "text-4xl leading-tight tracking-tighter py-3",
        h3: "text-2xl leading-snug tracking-tight font-semibold mb-2",
        h4: "text-xl leading-snug tracking-tight font-medium mb-2",
    };
</script>

<svelte:element this={tag}
                class="{tagClasses[tag] ?? 'text-lg'} {className}"
                {title}
                {part}>
    {@render children?.()}
</svelte:element>
