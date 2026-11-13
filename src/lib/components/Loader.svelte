<script lang="ts">
    import {Moon} from "svelte-loading-spinners";

    interface Props {
        size?: number;
        class?: string;
        style?: string;
    }

    let {size = 60, class: className = "", style}: Props = $props();
</script>

<div class="flex justify-center items-center {className}" {style}>
    <Moon duration="1s" {size} unit="px"/>
</div>
