<script lang="ts">
    import {_} from "svelte-i18n";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import Drawer from "svelte-drawer-component";
    import type {DispatchTagSelect, Tag} from "$lib/types";
    import {createEventDispatcher} from "svelte";
    import Heading from "$lib/components/Heading.svelte";
    import {Cross1} from "svelte-radix";

    const dispatch = createEventDispatcher<{tagSelect: { tag: Tag }}>();

    let openDrawer = false;

    export let tags: Tag[];
    export let selectedTags: Tag[] = [];

    export let tagClass: string = "";

    export const eventsQuantity: number = 0;

    const handle = (event: DispatchTagSelect) => {
        dispatch('tagSelect', event.detail)
    }

    $: tags;
    $: selectedTags;
</script>

<button on:click={() => openDrawer = true} class="sm:hidden w-full inline-block text-black border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 items-center gap-6 p-2 ring-2 ring-transparent">
    {$_('agenda.by-tags')}
</button>

<TagsSwiper class="hidden sm:block py-3 cursor-pointer"
            {tags}
            {selectedTags}
            on:tagSelect={handle}
            tagClass="{tagClass}"
            withPagination="{false}"
            perPage="{10}"
            swipeBreakpoints="{{
                                500: {
                                    perPage: 3
                                },
                                600 : {
                                    perPage: 4
                                },
                                700 : {
                                    perPage: 5
                                },
                                900 : {
                                    perPage: 6
                                },
                                1200 : {
                                    perPage: 8
                                },
                                1400 : {
                                    perPage: 9
                                },
                                1600 : {
                                    perPage: 10
                                },
                            }}"
/>

<Drawer open="{ openDrawer }" placement="bottom" size='400px' on:clickAway="{() => openDrawer = false}">
    <div on:click={() => openDrawer = false} class=" flex w-full px-2">
        <Heading tag="h3" class="flex-grow mt-2">
            {$_('agenda.tags')}
        </Heading>

        <button><Cross1/></button>
    </div>

</Drawer>