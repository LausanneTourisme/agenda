<script lang="ts">
    import {ClassList} from "../../ClassList";
    import {fade} from "svelte/transition";

    const style = ClassList.make(['loading loading-ring loading-lg']);
</script>


<span class="{style.merge($$props.class)}" out:fade></span>