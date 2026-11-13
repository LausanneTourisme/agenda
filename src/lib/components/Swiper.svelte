<script lang="ts">
    import type {Snippet} from "svelte";

    interface Props {
        maxContent: number;
        class?: string;
        ondragging?: (isDragging: boolean) => void;
        children?: Snippet;
    }

    let {maxContent, class: className = "", ondragging, children}: Props = $props();

    let carousel: HTMLElement;
    let startX: number = 0;
    let startY: number = 0;
    let isDragging: boolean = false;
    let mouseDown: boolean = false;

    const startDragging = (event: PointerEvent) => {
        startX = event.clientX;
        startY = event.clientY;
        mouseDown = true;
    }

    const stopDragging = () => {
        isDragging = false;
        ondragging?.(isDragging);
        mouseDown = false;
    }

    const move = (event: PointerEvent) => {
        const distX = Math.abs(event.clientX - startX);
        const distY = Math.abs(event.clientY - startY);
        const bounds = carousel.getBoundingClientRect();

        if (event.clientX < bounds.x || event.clientX > bounds.x + bounds.width) {
            ondragging?.(isDragging);
            isDragging = false;
        }

        if (mouseDown && (distX > 5 || distY > 5)) {
            isDragging = true;
            ondragging?.(isDragging);
            carousel.scrollLeft -= event.movementX;
        }

        event.preventDefault();
    }
</script>

<div
        aria-roledescription="carousel"
        aria-valuemax={maxContent}
        aria-valuemin={0}
        aria-valuenow={0}
        bind:this={carousel}
        class="swipper flex flex-nowrap overflow-y-hidden overflow-x-scroll no-scrollbar {className}"
        onpointerdown={startDragging}
        onpointerleave={stopDragging}
        onpointermove={move}
        onpointerup={stopDragging}
        role="slider"
        tabindex="0"
>
    {@render children?.()}
</div>
