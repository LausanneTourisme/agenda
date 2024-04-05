<script lang="ts">
    import {Moon} from "svelte-loading-spinners";
</script>

<div class="w-full h-full flex justify-center items-center {$$props.class ?? ''}" style="{$$props.style}">
    <Moon duration="1s" size="60" unit="px"/>
</div>