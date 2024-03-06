<script lang="ts">
    import Highlights from "./lib/composables/Highlights.svelte";
    import {onMount} from "svelte";

    //this is an example pf the concept
    let queryHighlights = `{
        evetns(language, highlight){
            name
        }
    }`;
    // simulate external calls
    onMount(async () => {
        // call highlights and return it to Highlights component
    });
</script>

<main>
    <Highlights title="Our recommandations"/>

</main>

<style>

</style>
