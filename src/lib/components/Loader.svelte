<script lang="ts">
    import {Moon} from "svelte-loading-spinners";
</script>

<div class="w-full h-full flex justify-center items-center {$$props.class}" style="{$$props.style}">
    <Moon size="60" unit="px" duration="1s"/>
</div>