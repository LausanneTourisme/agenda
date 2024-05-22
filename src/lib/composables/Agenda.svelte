<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import {Calendar, ChevronDown, Search} from "lucide-svelte";
    import {_, locale} from "svelte-i18n";
    import EventCard from "$lib/components/EventCard.svelte";
    import type {Event, Locales, Tag,} from "$lib/types";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import Drawer from "svelte-drawer-component";
    import {Cross1} from "svelte-radix";
    import {createEventDispatcher, onMount} from "svelte";
    import Loader from "$lib/components/Loader.svelte";
    import {dateFormat, getWeekend, now} from "$lib/date-utils";
    import moment from "moment";
    import {debounce, defaultLocale, log} from "$lib/utils";
    import EventCardPlaceholder from "$lib/components/EventCardPlaceholder.svelte";

    const dispatch = createEventDispatcher<{
        loadMore: { event: any };
        updateDates: { query: string | undefined, dates: [string, string | undefined | null] };
        search: { query: string | undefined, events: Event[] };
    }>();

    let key: string | Locales;

    export let startDate: string;
    export let endDate: string | undefined | null;

    export let baseUrl: string;
    export let hasMoreEvents: boolean = true;
    export let title: string | null | undefined;
    export let events: Event[];

    export let loading: boolean = false;

    const thisWeekend = getWeekend(moment());
    let todaySelected: boolean;
    let weekendSelected: boolean;

    let isLoading: boolean = true;
    let eventsToDisplay: Event[] = events;
    let searchValue: string | undefined | null;
    let oldSearchValue: string | undefined | null;

    let selectedTags: Tag[] = [];
    let selectedTagsName: string[] = [];

    let tags: Tag[] = [];
    let openTagsDrawer = false;

    if (selectedTags?.length > 0) {
        tags = tags.filter((tag: Tag) => selectedTags.includes(tag));
    }

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

        if (selectedTags.length === 0) {
            selectedTagsName = []
            eventsToDisplay = events;
            return;
        }

        selectedTagsName = selectedTags.map((t) => t.name);

        debounce(() => eventsToDisplay = events.filter((event: Event) => {
            return event.tags.some((tag) =>
                selectedTagsName.includes(tag.name),
            );
        }), 400)(); //reduce lag when user select multiple tags
    }

    const onTagSelected = (tag: Tag | null | undefined = null) => {
        sortEventsByTags(tag)
        searchValue = "";
    }

    const onInput = () => {
        if (searchValue !== oldSearchValue) {
            isLoading = true; //will be false on props 'events' update
            debounce(() => {
                if (searchValue !== oldSearchValue) {
                    selectedTags = [];
                    selectedTagsName = [];
                    dispatch("search", {query: searchValue?.toLowerCase(), events: eventsToDisplay});
                    oldSearchValue = searchValue
                }
            }, 400)();
        }
    }

    $: events, eventsToDisplay = events, isLoading = false;
    $: hasMoreEvents;
    $: tags = events
        .flatMap((x) => x.tags)
        .filter(
            (a, i) =>
                events
                    .flatMap((x) => x.tags)
                    .findIndex((s) => a.name === s.name) === i,
        );
    $: isLoading;
    $: loading;
    $: tags;
    $: selectedTags;
    $: selectedTagsName;
    $: eventsToDisplay;
    $: key = $locale ?? defaultLocale;
    $: endDate, todaySelected = now === startDate && now === endDate, weekendSelected = thisWeekend.saturday.format(dateFormat) === startDate && thisWeekend.sunday.format(dateFormat) === endDate
</script>

<div class="agenda p-5 md:p-7 md:px-12">
    <Heading class="mb-5" tag="h3">{title ?? $_("agenda.title")}</Heading>

    <div class="search-section">
        <div class="w-full xs:flex xs:justify-start search-section">
            <!--    TODAY    -->
            <button
                    class="block w-full p-3 mb-3 xs:mr-1 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent
                    {todaySelected ? 'border-honey-500 bg-honey-500' : ''}"
                    on:click={(_) => {
                        if(!todaySelected){
                            startDate = now;
                            endDate = todaySelected ? null : now;
                        } else {
                            startDate = now;
                            endDate = null;
                        }

                        dispatch("updateDates", { query: searchValue?.toLowerCase(), dates: [startDate, endDate] })
                    }}
            >
                {$_("agenda.search_section.today")}
            </button>

            <!--    WEEKEND   -->
            <button
                    class="block w-full p-3 mb-3 xs:mr-1 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent break-keep whitespace-break-spaces
                    {weekendSelected ? 'border-honey-500 bg-honey-500' : ''}"
                    on:click={(_)=>{
                        if(weekendSelected){
                            startDate = now;
                            endDate = null;
                        } else {
                            startDate = thisWeekend.saturday.format(dateFormat);
                            endDate = thisWeekend.sunday.format(dateFormat);
                        }

                        dispatch("updateDates", { query: searchValue?.toLowerCase(), dates: [startDate, endDate] })
                    }}
            >
                {$_("agenda.search-section.weekend")}
            </button>

            <!--    DATE    -->
            <button
                    class="block w-full p-3 mb-3 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent
                    {startDate && endDate && !todaySelected && !thisWeekend ? 'border-honey-500 bg-honey-500' : ''}"
            >
                <span class="flex justify-center items-center w-max m-auto">
                    <Calendar class="w-5 h-5 -mt-1"/>
                    &nbsp;
                    {$_("agenda.search_section.date")}
                </span>
            </button>

            <div class="by-name hidden sm:flex sm:items-center border-b border-honey-500">
                <input
                        class="h-full w-full outline-0 ring-transparent outline-none"
                        name="search-event"
                        placeholder={$_("agenda.search_section.by_name_placeholder")}
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
                    {$_("agenda.by_tags")}
                    {#if (selectedTagsName.length)}({selectedTagsName.length}){/if}
                </button>

                {#if loading}
                    <div class="hidden sm:flex text-nowrap pb-2 h-[45px] w-full">
                        {#each {length: 20} as _}
                            <div class="mr-2 sm:text-md px-3 sm:py-1 sm:px-2 rounded-full w-[200px] bg-gray-300 pointer-events-none"></div>
                        {/each}
                    </div>
                {:else}
                    <TagsSwiper
                            class="hidden sm:flex"
                            {tags}
                            {selectedTags}
                            displayBtnAll={true}
                            on:tagSelect={(event) => onTagSelected(event.detail.tag)}
                            tagClass="py-2 mr-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 ring-transparent px-5"
                    />
                {/if}
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
                            on:click={() => onTagSelected()}
                            title={$_("agenda.tags.display_all")}
                    >{$_("agenda.tags.display_all")}</button
                    >

                    {#each tags as tag}
                        {@const elementSelected = selectedTagsName.includes(
                            tag.name,
                        )
                            ? "border-honey-500 bg-honey-500"
                            : ""}

                        <button
                                on:click={() => onTagSelected(tag)}
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
                        `agenda.tags_drawer.${eventsToDisplay.length === 1 ? "singular" : "plural"}`,
                        {values: {quantity: eventsToDisplay.length}},
                    )}</button
                    >
                </div>
            </Drawer>
        </div>

        <div class="by-name w-full sm:hidden">
            <input
                    class="bg-stone-100 w-full focus:outline-none p-4 font-light border-0 focus:ring-0"
                    name="search-event"
                    placeholder={$_("agenda.search_section.by_name_placeholder")}
                    type="search"
                    bind:value={searchValue}
                    on:keyup={() => onInput()}
            />
        </div>
    </div>

    <hr class="mt-4 sm:hidden"/>
    <div class="flex">
        <p
                class="text-xl sm:text-2xl font-semibold leading-tight tracking-tighter my-5"
        >
            {$_(`agenda.event${eventsToDisplay.length === 1 ? "" : "s"}_found`, {
                values: {quantity: eventsToDisplay.length},
            })}
        </p>
        {#if isLoading || loading}
            <Loader class="ml-3" size="{30}"/>
        {/if}
    </div>
    <div class="grid xl:grid-cols-2 3xl:grid-cols-3 gap-4">
        {#if loading}
            {#each {length: 20} as _}
                <EventCardPlaceholder/>
            {/each}
        {:else}
            {#each eventsToDisplay as event}
                <EventCard {event} {baseUrl}/>
            {/each}
        {/if}
    </div>
    <div class="flex flex-col items-center mt-5">
        {#if isLoading}
            <Loader class="ml-3" size="{30}"/>
        {/if}
        {#if !isLoading && hasMoreEvents && !loading}
            <button
                    on:click={(e) => {
                        isLoading = true;
                        dispatch("loadMore", { event: e })
                    }}
                    class="flex justify-center w-full xs:w-max px-4 py-3 m-3 border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
            >
                <ChevronDown/>
                &nbsp;
                {$_("agenda.search_section.load_more")}
            </button>
        {/if}
        {#if (!isLoading && !hasMoreEvents) || loading }
            <p class="w-full align-middle text-center">
                {$_("agenda.search_section.load_complete")}
            </p>
            <button
                    class="block w-max px-4 py-3 m-3 border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
                    on:click={() => {
                        document.querySelector(".agenda")?.scrollIntoView({
                          behavior: 'smooth',
                          block: 'start',
                        });
                    }}
            >
                {$_("agenda.search_section.again")}
            </button>
        {/if}
    </div>
</div>

