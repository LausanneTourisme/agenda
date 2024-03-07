<script lang="ts">
import {Moon} from "svelte-loading-spinners";
import {ClassList} from "$lib/ClassList";

let style: ClassList = ClassList.make();

$: style;
</script>

<div class="{style.merge($$props.class)}" style="{$$props.style}">
    <Moon size="60" color="#E7302F" unit="px" duration="1s" />
</div>