<script lang="ts">
    import {ClassList} from "../../ClassList";

    export let width: number = 20;
    export let height: number = 20;

    let style: ClassList = ClassList.make();

    $: style;
</script>

<svg class="{style.merge($$props.class)}" width="{width}" height="{height}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 4.5H19C19.8284 4.5 20.5 5.17157 20.5 6V20C20.5 20.8284 19.8284 21.5 19 21.5H5C4.17157 21.5 3.5 20.8284 3.5 20V6C3.5 5.17157 4.17157 4.5 5 4.5Z" stroke="#E7302F" stroke-width="2px"/>
    <path d="M16 2V6" stroke="#E7302F" stroke-width="2px"/>
    <path d="M8 2V6" stroke="#E7302F" stroke-width="2px"/>
    <path d="M3 10H21" stroke="#E7302F" stroke-width="2px"/>
</svg>