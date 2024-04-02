<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import {Calendar, Search} from "lucide-svelte";
    import {_, locale} from "svelte-i18n";
    import EventCard from "$lib/components/EventCard.svelte";
    import type {DispatchTagSelect, Event, Tag} from "$lib/types";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import Drawer from "svelte-drawer-component";
    import {Cross1} from "svelte-radix";

    // trick to bypass error type...
    const key: "fr" | "en" | "de" | "it" | "es" = ($locale ?? "en") as "fr" | "en" | "de" | "it" | "es";

    export let events: Event[];

    let eventsToDisplay: Event[] = events;

    let selectedTags: Tag[] = []
    let selectedTagsName: string[] = []

    let tags: Tag[] = events
        .flatMap(x => x.tags)
        .filter((a, i) => events.flatMap(x => x.tags).findIndex((s) => a.name === s.name) === i);

    let openTagsDrawer = false;

    if (selectedTags.length > 0) {
        tags = tags.filter((tag: Tag) => selectedTags.includes(tag));
    }

    const handle = (event: DispatchTagSelect) => {
        sortEventsByTags(event.detail.tag)
    }

    function sortEventsByTags(tag: Tag | null | undefined = null): void {
        if (!tag) {
            selectedTags = []
        }
        // add / remove Tag
        else if (selectedTags.includes(tag)) {
            selectedTags = selectedTags.filter(t => t != tag);
        } else {
            selectedTags = [...selectedTags, tag];
        }

        selectedTagsName = selectedTags.map(t => t.name)

        if (selectedTags.length === 0) {
            eventsToDisplay = events;
            return;
        }


        eventsToDisplay = events.filter((event: Event) => {
            return event.tags.some(tag => selectedTagsName.includes(tag.name))
        })
    }

    $: events;
    $: eventsToDisplay;
    $: selectedTags;
</script>

<div class="agenda p-5 md:p-7 md:px-12">
    <Heading tag="h3" class="mb-5">{$_('agenda.title')}</Heading>

    <div class="search-section">
        <div class="w-full xs:flex xs:justify-start search-section">
            <!--    TODAY    -->
            <button class="block w-full p-3 mb-3 xs:mr-1 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent">
                {$_('agenda.search-section.today')}
            </button>

            <!--    WEEKEND   -->
            <button class="block w-full p-3 mb-3 xs:mr-1 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent">
                {$_('agenda.search-section.weekend')}
            </button>

            <!--    DATE    -->
            <button class="block w-full p-3 mb-3 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent">
                <span class="flex justify-center items-center w-max  m-auto">
                    <Calendar class="w-5 h-5 -mt-1"/>
                    &nbsp;
                    {$_('agenda.search-section.date')}
                </span>
            </button>

            <div class="by-name hidden sm:flex sm:items-center border-b border-honey-500 ring-transparent active:ring-transparent">
                <input type="search"
                       class="h-full w-full"
                       name="search-event" placeholder="{$_('agenda.search-section.by-name-placeholder')}"
                />
                <Search class="text-honey-500"/>
            </div>

        </div>

        <div class="by-tags sm:mt-4">
            {#key selectedTags.map(t => t.name)}
                <button on:click={() => openTagsDrawer = true}
                        class="sm:hidden block w-full p-3 mb-3 border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent">
                    {$_('agenda.by-tags')}
                </button>

                <TagsSwiper class="hidden sm:block py-3 cursor-pointer"
                            {tags}
                            {selectedTags}
                            displayAllBtn="{true}"
                            on:tagSelect={handle}
                            tagClass="px-5"
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
            {/key}


            <Drawer open="{ openTagsDrawer }" placement="bottom" size='400px'
                    on:clickAway="{() => openTagsDrawer = false}">
                <button on:click={() => openTagsDrawer = false} class="flex w-full px-2 text-left">
                    <Heading tag="h3" class="flex-grow mt-2">
                        {$_('agenda.tags.title')}
                    </Heading>

                    <span class="mt-3"><Cross1/></span>
                </button>
                <div class="mt-2 h-72 overflow-y-scroll flex flex-wrap">
                    <button on:click={() => {sortEventsByTags()}}
                            class="inline-flex justify-center items-center py-2 m-2  text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent {selectedTags.length===0? 'border-honey-500 bg-honey-500' : ''} px-5"
                            title="{$_('agenda.tags.display-all')}">{$_('agenda.tags.display-all')}</button>

                    {#each tags as tag}
                        {@const elementSelected =  selectedTagsName.includes(tag.name) ? 'border-honey-500 bg-honey-500' : ''}

                        <button on:click={() => sortEventsByTags(tag)}
                                class="inline-flex justify-center items-center py-2 m-2  text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent px-5 {elementSelected} "
                                title="{tag.public_name[key]}">{tag.public_name[key]}</button>

                    {/each}

                </div>
                <div class="w-full p-2">
                    <button on:click={() => openTagsDrawer = false}
                            class="border border-honey-500 bg-honey-500 py-2 px-4 float-right">{$_(`agenda.tags-drawer.${eventsToDisplay.length === 1 ? 'singular' : 'plural'}`, {values: {quantity: eventsToDisplay.length}})}</button>
                </div>
            </Drawer>
        </div>

        <!-- TODO bind to var an search in loaded events -->
        <div class="by-name w-full sm:hidden">
            <input type="search" class="bg-stone-100 w-full focus:outline-none p-4 font-light border-0 focus:ring-0"
                   name="search-event" placeholder="{$_('agenda.search-section.by-name-placeholder')}">
        </div>
    </div>

    <hr class="mt-4 sm:hidden">
    <p class="text-xl sm:text-2xl font-semibold leading-tight tracking-tighter my-5">
        {$_(`agenda.event${eventsToDisplay.length === 1 ? '' : 's'}-found`, {values: {quantity: eventsToDisplay.length}})}
    </p>

    <div class="grid xl:grid-cols-2 gap-4">
        {#each eventsToDisplay as event, index}
            <EventCard class="" {event}/>
        {/each}
    </div>

</div>

<style>

</style>