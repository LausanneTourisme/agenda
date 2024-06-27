<script lang="ts">
    import {fade} from "svelte/transition";
    import Heading from "$lib/components//Heading.svelte";
</script>

<div data-id="placeholder"
     class="lt-agenda-highlight-card animate-pulse h-full rounded-none shadow-none p-4 {$$props.class ?? ''}"
     transition:fade
>
    <div class="h-full flex flex-col">
        <div class="lt-agenda-highlight-card-body w-min flex flex-col h-full">
            <div class="aspect-square w-44 sm:w-72 bg-honey-800"></div>
            <Heading class="lt-agenda-title line-clamp-2 h-16 max-h-16 text-clip my-2" tag="h3">
                <div class="w-full h-2/3 bg-honey-800"></div>
            </Heading>
            <div class="lt-agenda-highlight-dates flex items-center">
                <div class="mr-2 bg-honey-800 aspect-square h-[24px]"></div>

                <p class="flex w-full h-[24px] bg-honey-800 text-sm"></p>
            </div>
        </div>
    </div>
</div>
