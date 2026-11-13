<script lang="ts">
    interface Props {
        title: string;
        class?: string;
        part?: string;
        onclick?: (event: MouseEvent) => void;
    }

    let {title, class: className = "", part, onclick}: Props = $props();
</script>

<button {onclick}
        class={className}
        {part}
        {title}>
    {title}
</button>
