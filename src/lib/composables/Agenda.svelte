<script lang="ts">
    import Fuse from 'fuse.js'
    import Heading from "$lib/components/Heading.svelte";
    import {Calendar, ChevronDown, Search} from "lucide-svelte";
    import {_, locale} from "svelte-i18n";
    import EventCard from "$lib/components/EventCard.svelte";
    import type {DispatchTagSelect, Event, Tag,} from "$lib/types";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import Drawer from "svelte-drawer-component";
    import {Cross1} from "svelte-radix";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher<{
        loadMore: { event: any };
        search: { value: string };
    }>();

    let key: string;

    export let hasMoreEvents: boolean = true;
    export let title: string | null | undefined;
    export let events: Event[];

    let eventsToDisplay: Event[] = events;

    let selectedTags: Tag[] = [];
    let selectedTagsName: string[] = [];

    let tags: Tag[];
    let openTagsDrawer = false;

    if (selectedTags.length > 0) {
        tags = tags.filter((tag: Tag) => selectedTags.includes(tag));
    }

    const handle = (event: DispatchTagSelect) => {
        sortEventsByTags(event.detail.tag);
    };

    function sortEventsByTags(tag: Tag | null | undefined = null): void {
        if (!tag) {
            selectedTags = [];
        }
        // add / remove Tag
        else if (selectedTags.includes(tag)) {
            selectedTags = selectedTags.filter((t) => t != tag);
        } else {
            selectedTags = [...selectedTags, tag];
        }

        selectedTagsName = selectedTags.map((t) => t.name);

        if (selectedTags.length === 0) {
            eventsToDisplay = events;
            return;
        }

        eventsToDisplay = events.filter((event: Event) => {
            return event.tags.some((tag) =>
                selectedTagsName.includes(tag.name),
            );
        });
    }

    let oldSearchValue: string | undefined | null;
    let searchValue: string | undefined | null;

    const searchEvents = () => {
        selectedTags = [];

        if (!searchValue) {
            eventsToDisplay = events;
            return;
        }
        oldSearchValue = searchValue;
        searchValue = searchValue.toLowerCase();

        const fuse = new Fuse(events, {
            includeScore: true,
            includeMatches: true,
            findAllMatches: true,
            threshold: 0.3,
            location: 0,
            distance: 100,
            keys: [
                {
                    name:`name.${key}`,
                    weight:1,
                },
                {
                    name:`seo.name.${key}`,
                    weight:0.9,
                },
                {
                    name:`categories.public_name.${key}`,
                    weight:0.3,
                },
                {
                    name:`tags.public_name.${key}`,
                    weight:0.1,
                },
            ]
        })

        eventsToDisplay = fuse.search(searchValue).map(e => e.item);
    };

    const debounce = (fn: Function, delay = 1000) => {
        let timerId: NodeJS.Timeout | undefined;

        return (...args: any[]) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => fn(...args), delay);
        };
    };

    const onInput = debounce(() => {
        if (oldSearchValue !== searchValue) {
            dispatch("search", {value: searchValue});
            if (searchValue) searchEvents();
            else eventsToDisplay = events
        }
    }, 500);

    $: events;
    $: hasMoreEvents;
    $: tags = events
        .flatMap((x) => x.tags)
        .filter(
            (a, i) =>
                events
                    .flatMap((x) => x.tags)
                    .findIndex((s) => a.name === s.name) === i,
        );
    $: tags, sortEventsByTags();
    $: searchValue, searchEvents();
    $: selectedTags;
    $: selectedTagsName;
    $: eventsToDisplay;
    $: key = $locale ?? "en";
</script>

<div class="agenda p-5 md:p-7 md:px-12">
    <Heading class="mb-5" tag="h3">{title ?? $_("agenda.title")}</Heading>

    <div class="search-section">
        <div class="w-full xs:flex xs:justify-start search-section">
            <!--    TODAY    -->
            <button
                    class="block w-full p-3 mb-3 xs:mr-1 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
            >
                {$_("agenda.search-section.today")}
            </button>

            <!--    WEEKEND   -->
            <button
                    class="block w-full p-3 mb-3 xs:mr-1 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent break-keep whitespace-break-spaces"
            >
                {$_("agenda.search-section.weekend")}
            </button>

            <!--    DATE    -->
            <button
                    class="block w-full p-3 mb-3 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
            >
                <span class="flex justify-center items-center w-max m-auto">
                    <Calendar class="w-5 h-5 -mt-1"/>
                    &nbsp;
                    {$_("agenda.search-section.date")}
                </span>
            </button>

            <div
                    class="by-name hidden sm:flex sm:items-center border-b border-honey-500"
            >
                <input
                        class="h-full w-full outline-0 ring-transparent outline-none"
                        name="search-event"
                        placeholder={$_(
                        "agenda.search-section.by-name-placeholder",
                    )}
                        type="search"
                        bind:value={searchValue}
                        on:keyup={() => onInput()}
                />
                <Search class="text-honey-500"/>
            </div>
        </div>

        <div class="by-tags sm:mt-4">
            {#key selectedTags.map((t) => t.name)}
                <button
                        on:click={() => (openTagsDrawer = true)}
                        class="sm:hidden block w-full p-3 mb-3 border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
                >
                    {$_("agenda.by-tags")}
                    {#if (selectedTagsName.length)}({selectedTagsName.length}){/if}
                </button>

                <TagsSwiper
                        class="hidden sm:flex"
                        {tags}
                        {selectedTags}
                        displayBtnAll={true}
                        on:tagSelect={(e) => handle(e)}
                        tagClass="py-2 mr-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 ring-transparent px-5"
                />
            {/key}

            <Drawer
                    on:clickAway={() => (openTagsDrawer = false)}
                    open={openTagsDrawer}
                    placement="bottom"
                    size="400px"
            >
                <button
                        class="flex w-full px-2 text-left"
                        on:click={() => (openTagsDrawer = false)}
                >
                    <Heading class="flex-grow mt-2" tag="h3">
                        {$_("agenda.tags.title")}
                    </Heading>

                    <span class="mt-3"><Cross1/></span>
                </button>
                <div class="mt-2 h-72 overflow-y-scroll flex flex-wrap">
                    <button
                            class="inline-flex justify-center items-center h-min py-2 m-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent {selectedTags.length ===
                        0
                            ? 'border-honey-500 bg-honey-500'
                            : ''} px-5"
                            on:click={() => {
                            sortEventsByTags();
                        }}
                            title={$_("agenda.tags.display-all")}
                    >{$_("agenda.tags.display-all")}</button
                    >

                    {#each tags as tag}
                        {@const elementSelected = selectedTagsName.includes(
                            tag.name,
                        )
                            ? "border-honey-500 bg-honey-500"
                            : ""}

                        <button
                                on:click={() => sortEventsByTags(tag)}
                                class="inline-flex justify-center items-center h-min py-2 m-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent px-5 {elementSelected} "
                                title={tag.public_name[key]}
                        >{tag.public_name[key]}</button
                        >
                    {/each}
                </div>
                <div class="w-full p-2">
                    <button
                            class="border border-honey-500 bg-honey-500 py-2 px-4 float-right"
                            on:click={() => (openTagsDrawer = false)}
                    >{$_(
                        `agenda.tags-drawer.${eventsToDisplay.length === 1 ? "singular" : "plural"}`,
                        {values: {quantity: eventsToDisplay.length}},
                    )}</button
                    >
                </div>
            </Drawer>
        </div>

        <!-- TODO bind to var an search in loaded events -->
        <div class="by-name w-full sm:hidden">
            <input
                    class="bg-stone-100 w-full focus:outline-none p-4 font-light border-0 focus:ring-0"
                    name="search-event"
                    placeholder={$_("agenda.search-section.by-name-placeholder")}
                    type="search"
            />
        </div>
    </div>

    <hr class="mt-4 sm:hidden"/>
    <p
            class="text-xl sm:text-2xl font-semibold leading-tight tracking-tighter my-5"
    >
        {$_(`agenda.event${eventsToDisplay.length === 1 ? "" : "s"}-found`, {
            values: {quantity: eventsToDisplay.length},
        })}
    </p>

    <div class="grid xl:grid-cols-2 3xl:grid-cols-3 gap-4">
        {#each eventsToDisplay as event, index}
            <EventCard {event}/>
        {/each}
    </div>
    <div class="flex flex-col items-center mt-5">
        {#if hasMoreEvents}
            <button
                    on:click={(e) => dispatch("loadMore", { event: e })}
                    class="flex justify-center w-full xs:w-max px-4 py-3 m-3 border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
            >
                <ChevronDown/>
                &nbsp;
                {$_("agenda.search-section.load-more")}
            </button>
        {:else}
            <p class="w-full align-middle text-center">
                {$_("agenda.search-section.load-complete")}
            </p>
            <button
                    class="block w-max px-4 py-3 m-3 border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
            >
                {$_("agenda.search-section.again")}
            </button>
        {/if}
    </div>
</div>

