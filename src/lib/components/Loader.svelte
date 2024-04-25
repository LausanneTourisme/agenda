<script lang="ts">
    import {Moon} from "svelte-loading-spinners";

    export let size: number = 60;
</script>

<div class="flex justify-center items-center {$$props.class ?? ''}" style="{$$props.style}">
    <Moon duration="1s" {size} unit="px"/>
</div>