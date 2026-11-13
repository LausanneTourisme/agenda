<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        open?: boolean;
        duration?: number;
        placement?: "left" | "right" | "top" | "bottom";
        size?: string | null;
        onclickaway?: () => void;
        children?: Snippet;
    }

    let {open = false, duration = 0.2, placement = "left", size = null, onclickaway, children}: Props = $props();

    $effect(() => {
        document.body.style.overflow = open ? "hidden" : "auto";
    });
</script>

<aside class="drawer" class:open style="--duration: {duration}s; --size: {size};">
    <div class="overlay" role="presentation" onclick={() => onclickaway?.()}></div>

    <div class="panel {placement}" class:size part="drawer">
        {@render children?.()}
    </div>
</aside>

<style>
    .drawer {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        z-index: -1;
        transition: z-index var(--duration) step-end;
    }

    .drawer.open {
        z-index: 99;
        transition: z-index var(--duration) step-start;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(100, 100, 100, 0.5);
        opacity: 0;
        z-index: 2;
        transition: opacity var(--duration) ease;
    }

    .drawer.open .overlay {
        opacity: 1;
    }

    .panel {
        position: fixed;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 3;
        transition: transform var(--duration) ease;
        overflow: auto;
    }

    .panel.left {
        left: 0;
        transform: translate(-100%, 0);
    }

    .panel.right {
        right: 0;
        transform: translate(100%, 0);
    }

    .panel.top {
        top: 0;
        transform: translate(0, -100%);
    }

    .panel.bottom {
        bottom: 0;
        transform: translate(0, 100%);
    }

    .panel.left.size,
    .panel.right.size {
        max-width: var(--size);
    }

    .panel.top.size,
    .panel.bottom.size {
        max-height: var(--size);
    }

    .drawer.open .panel {
        transform: translate(0, 0);
    }
</style>
