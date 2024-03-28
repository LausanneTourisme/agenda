<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import {Calendar} from "lucide-svelte";
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
    <Heading tag="h2" class="">{$_('agenda.title')}</Heading>

    <div class="search-section">
        <div class="flex justify-between sm:block search-section sm:w-full">
            <!--    TODAY    -->
            <button class="by-today text-center flex-grow inline-block text-black border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 items-center gap-6 p-3 ring-2 ring-transparent mr-2">
                {$_('agenda.search-section.today')}
            </button>

            <!--    WEEKEND   -->
            <button class="by-weekend text-center flex-grow inline-block text-black border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 items-center gap-6 p-3 ring-2 ring-transparent mr-2">
                {$_('agenda.search-section.weekend')}
            </button>

            <!--    DATE    -->
            <button class="by-date text-center flex-grow inline-block text-black border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 items-center gap-6 p-3 ring-2 ring-transparent"
                    on:click={() => console.log('agenda opened')}
            >
                <Calendar class="inline-block mr-2 -mt-1.5"/>
                <span>
                    {$_('agenda.search-section.date')}
                </span>
            </button>
        </div>

        <div class="by-tags my-3">
            {#key selectedTags.map(t => t.name)}
                <Tags
                        {tags}
                        {selectedTags}
                        tagClass="px-5"
                        on:tagSelect={handle}
                />
            {/key}
        </div>

        <!-- TODO bind to var an search in loaded events -->
        <div class="by-name w-full">
            <input type="search" class="bg-stone-100 w-full focus:outline-none p-4 font-semibold border-0 focus:ring-0"
                   name="search-event" placeholder="{$_('agenda.search-section.by-name-placeholder')}">
        </div>
    </div>

    <hr class="mt-4">
    <p class="text-xl sm:text-2xl font-semibold leading-tight tracking-tighter my-5">
        {$_(`agenda.event${events.length === 1 ? '' : 's'}-found`, {values: {quantity: events.length}})}
    </p>

    <div class="grid xl:grid-cols-2 gap-4">
        {#each eventsToDisplay as event, index}
            <EventCard class="" {event}/>
        {/each}
    </div>

</div>

<style>

</style>