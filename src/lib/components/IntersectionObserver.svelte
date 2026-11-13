<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        once?: boolean;
        enable?: boolean;
        intersecting?: boolean;
        onintersecting?: (detail: { event: HTMLElement }) => void;
        children?: Snippet<[boolean]>;
    }

    let {once = false, enable = false, intersecting = $bindable(false), onintersecting, children}: Props = $props();

    let element: HTMLElement;
    let triggered: boolean = false;

    $effect(() => {
        if (!enable || (once && triggered)) return;

        const observer = new IntersectionObserver((entries) => {
            intersecting = entries[0].isIntersecting;
            if (!intersecting) return;

            onintersecting?.({event: element});

            if (once) {
                triggered = true;
                observer.disconnect();
            }
        });
        observer.observe(element);

        return () => observer.disconnect();
    });
</script>

<div bind:this={element}>
    {@render children?.(intersecting)}
</div>
