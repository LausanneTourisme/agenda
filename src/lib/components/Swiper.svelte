<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import type {Event, Query} from "$lib/types";

    export let maxContent: number;
    let carousel: HTMLElement|HTMLDivElement;
    let startX: number = 0;
    let startY: number = 0;
    let isDragging: boolean = false;
    let mouseDown: boolean = false

    const dispatch = createEventDispatcher();

    const startDragging = (event: MouseEvent) => {
        // Store the initial mouse coordinates
        startX = event.clientX;
        startY = event.clientY;

        // Set dragging state to false initially
        mouseDown = true;
    }

    const stopDragging = (event: MouseEvent) => {
        // If dragging didn't occur, treat it as a click event
        if (isDragging) {
            // If dragging occurred, reset the dragging state
            isDragging = false;
        }
        dispatch("dragging", {isDragging})
        mouseDown = false
    }

    const move = (event: MouseEvent) => {
        const distX = Math.abs(event.clientX - startX);
        const distY = Math.abs(event.clientY - startY);

        if(event.clientX< carousel.getBoundingClientRect().x || event.clientX > (carousel.getBoundingClientRect().x + carousel.getBoundingClientRect().width)){
            dispatch("dragging", {isDragging})
            isDragging = false
        }

        // If the distance moved is greater than a threshold (e.g., 5 pixels),
        // consider it as dragging
        if (mouseDown && (distX > 5 || distY > 5)) {
            isDragging = true
            dispatch("dragging", {isDragging})
            carousel.scrollLeft -= event.movementX
        }

        event.preventDefault()
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
        class="swipper flex flex-nowrap overflow-y-hidden overflow-x-scroll no-scrollbar {$$props.class ?? ''}"
        on:pointerdown={startDragging}
        on:pointerleave={stopDragging}
        on:pointermove={move}
        on:pointerup={stopDragging}
        role="slider"
        tabindex="0"
>
    <slot />
</div>
