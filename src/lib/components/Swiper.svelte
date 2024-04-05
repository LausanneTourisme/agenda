<script lang="ts">

    import {createEventDispatcher} from "svelte";

    export let maxContent: number;
    let carousel = HTMLElement;
    let startX: number = 0;
    let startY: number = 0;
    let isDragging: boolean = false;
    let mouseDown: boolean = false

    const dispatch = createEventDispatcher();

    const startDragging = (event: Event) => {
        // Store the initial mouse coordinates
        startX = event.clientX;
        startY = event.clientY;

        // Set dragging state to false initially
        mouseDown = true;
    }

    const stopDragging = (event: Event) => {
        // If dragging didn't occur, treat it as a click event
        if (isDragging) {
            // If dragging occurred, reset the dragging state
            isDragging = false;
        }
        dispatch("dragging", {isDragging})
        mouseDown = false
    }
    const move = (event: Event) => {

        const distX = Math.abs(event.clientX - startX);
        const distY = Math.abs(event.clientY - startY);

        // If the distance moved is greater than a threshold (e.g., 5 pixels),
        // consider it as dragging
        if (mouseDown && (distX > 5 || distY > 5)) {
            isDragging = true
            dispatch("dragging", {isDragging})
            carousel.scrollLeft -= event.movementX
        }
    }

    $:maxContent
    $:isDragging
</script>

<div
        aria-roledescription="carousel"
        aria-valuemax={maxContent}
        aria-valuemin=0
        aria-valuenow=0
        bind:this={carousel}
        class="swipper flex flex-nowrap py-3 overflow-y-hidden overflow-x-scroll text-nowrap {$$props.class ?? ''}"
        on:pointerdown={startDragging}
        on:pointerleave={stopDragging}
        on:pointermove={move}
        on:pointerup={stopDragging}
        role="slider"
        tabindex="0"
>
    <slot/>
</div>