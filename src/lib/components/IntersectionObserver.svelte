<script lang="ts">
    import {afterUpdate, createEventDispatcher, onMount, tick} from 'svelte';
    import type {Event} from '$lib/types'

    const dispatch = createEventDispatcher<{
        intersecting: { event: any };
    }>();
    export let once = false;
    export let enable: boolean = false;
    export let event: Event;

    let element: HTMLElement;

    /**
     * Whether the element is intersecting.
     */
    export let intersecting = false;
    let triggered : boolean = false
    let observer: IntersectionObserver;

    onMount(() => {
        if(!enable) return;

        observer = new IntersectionObserver((entries, _) => {
            intersecting = entries[0].isIntersecting;

            if (!triggered && once && intersecting) {
                dispatch('intersecting', {event: element});
                observer.disconnect();
                triggered = true
            } else if (intersecting && !once) {
                dispatch('intersecting', {event: element});
            }
        });

        return () => {
            observer.disconnect();
        };
    });

    afterUpdate(async () => {
        if(!enable) return;

        await tick();

        if (element) {
            observer.observe(element);
        }
    });
</script>
<div bind:this={element}>
    <slot {intersecting} />
</div>
