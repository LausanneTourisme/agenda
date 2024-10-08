<script lang="ts">
    import type {Event, Locales, Query, Tag,} from "$lib/types";
    import Heading from "$lib/components/Heading.svelte";
    import {Calendar, ChevronDown, Search} from "lucide-svelte";
    import {_} from "svelte-i18n";
    import EventCard from "$lib/components/EventCard.svelte";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";
    import Drawer from "svelte-drawer-component";
    import {Cross1} from "svelte-radix";
    import {afterUpdate, createEventDispatcher, onMount} from "svelte";
    import Loader from "$lib/components/Loader.svelte";
    import {dateFormat, getWeekend, now} from "$lib/date-utils";
    import moment from "moment";

    import {debounce, log} from "$lib/utils";
    import EventCardPlaceholder from "$lib/components/EventCardPlaceholder.svelte";

    /*****************************************************************************
     /* START CALENDAR SECTION
     /*****************************************************************************/
    import AirDatepicker from "air-datepicker";
    import localeEn from 'air-datepicker/locale/en';
    import localeFr from 'air-datepicker/locale/fr';
    import localeDe from 'air-datepicker/locale/de';
    import {searchEvents, sort} from "$lib/event-utils";

    /*****************************************************************************
     /* END CALENDAR SECTION
     /*****************************************************************************/

    const dispatch = createEventDispatcher<{
        loadMore: { event: any };
        updateDates: { query: Query, dates: [string, string | undefined | null] };
        search: { query: Query, events: Event[] };
        selectedTags: {tags: string[]};
    }>();

    export let locale: Locales;

    export let disableButtons: boolean = true;
    export let startDate: string;
    export let endDate: string | undefined | null;

    export let baseUrl: string;
    export let hasMoreEvents: boolean = true;
    export let title: string | null | undefined;
    export let events: Event[];
    export let eventsPerChunk: number;

    export let loading: boolean = false;
    export let loadingAllContent: boolean = true;

    const thisWeekend = getWeekend(moment());
    let todaySelected: boolean;
    let weekendSelected: boolean;

    let isLoading: boolean = true;
    let eventsToDisplay: Event[] = []; // All sorted events (by date, tags, name)
    let eventsDisplayed: Event[] = []; // events that user is currently seeing

    let searchValue: string | undefined | null;
    let oldSearchValue: string | undefined | null;

    let selectedTags: Tag[] = [];
    let selectedTagsName: string[] = [];

    let allTags: Tag[] = [];
    let openTagsDrawer = false;

    /*****************************************************************************
     /* START CALENDAR SECTION
     /*****************************************************************************/

    const smallScreen: number = 640;
    let isMobile: boolean = window.innerWidth < smallScreen;

    const calendarLocales = (locale: Locales) => {
        switch (locale) {
            case "fr":
                return localeFr;
            case "de":
                return localeDe;
            case "en":
            default:
                return localeEn;
        }
    }

    let calendar: AirDatepicker | AirDatepicker<HTMLInputElement> | AirDatepicker<HTMLElement> | null = null;
    let dpDates: string = ""
    let dpField: HTMLInputElement;

    const buildCalendar = () => {
        try {
            calendar?.destroy()
        } catch (e) {
            console.error('Trying to reset calendar too early')
        }

        calendar = new AirDatepicker('#dp', {
            locale: calendarLocales(locale),
            range: true,
            selectedDates: startDate && endDate ? [startDate, endDate] : undefined,
            multipleDatesSeparator: `,`,
            onSelect: ({date}) => {
                if (date instanceof Array && date.length === 2) {
                    startDate = moment(date[0]).format(dateFormat);
                    endDate = moment(date[1]).format(dateFormat);
                    selectedTags = [];
                    selectedTagsName = [];

                    dispatch("updateDates", {query: searchValue?.toLowerCase(), dates: [startDate, endDate]});
                }
            },
            toggleSelected: ({datepicker}) => {
                return datepicker.selectedDates.length === 2;
            },
            buttons: [
                {
                    content: $_('datepicker.today'),
                    className: 'custom-button-classname',
                    onClick: (dp) => {
                        startDate = now;
                        endDate = now;
                        const dates = [new Date(startDate), new Date(endDate)]
                        selectedTags = [];
                        selectedTagsName = [];

                        dp.selectDate(dates);
                        dp.setViewDate(dates[0]);
                        dispatch("updateDates", {query: searchValue?.toLowerCase(), dates: [startDate, endDate]});
                    }
                },
                {
                    content: $_('datepicker.weekend'),
                    className: 'custom-button-classname',
                    onClick: (dp) => {
                        startDate = thisWeekend.saturday.format(dateFormat);
                        endDate = thisWeekend.sunday.format(dateFormat);
                        const dates = [new Date(startDate), new Date(endDate)]
                        selectedTags = [];
                        selectedTagsName = [];

                        dp.selectDate(dates);
                        dp.setViewDate(dates[0]);
                        dispatch("updateDates", {query: searchValue?.toLowerCase(), dates: [startDate, endDate]});
                    }
                },
                {
                    content: $_('datepicker.clear'),
                    className: 'custom-button-classname',
                    onClick: (dp) => {
                        startDate = now;
                        endDate = null;
                        selectedTags = [];
                        selectedTagsName = [];

                        dp.clear()
                        dp.hide()
                        dp.setViewDate(new Date());

                        dispatch("updateDates", {query: searchValue?.toLowerCase(), dates: [startDate, endDate]})
                    }
                },
            ],
            autoClose: true,
            isMobile: document.body.offsetWidth < smallScreen,
            // startDate,
        });
    }

    /*****************************************************************************
     /* END CALENDAR SECTION
     /*****************************************************************************/

    function handleLoadMore() {
        const tempEvents = [...eventsToDisplay].slice(eventsDisplayed.length, eventsDisplayed.length + eventsPerChunk)
        eventsDisplayed = [...eventsDisplayed, ...tempEvents];

        log("Handle more events!", {new: tempEvents, eventsDisplayed: eventsDisplayed})
    }

    const sortEventsToDisplay = (locale: string | Locales, options: {
        firstLoad?: boolean,
    } = {}) => {
        options = {
            firstLoad: false,
            ...options
        }

        if (options.firstLoad) {
            return sort(events, {
                startingDate: moment(startDate, dateFormat),
                endingDate: endDate ? moment(endDate, dateFormat) : undefined,
                locale: locale,
                onlyAvailable: true,
            });
        } else {
            return sortByName(
                locale as Locales,
                searchValue,
                sortByTags(
                    selectedTagsName,
                    // get available events
                    sort(events, {
                        startingDate: moment(startDate, dateFormat),
                        endingDate: endDate ? moment(endDate, dateFormat) : undefined,
                        locale: locale,
                        onlyAvailable: true,
                    }),
                ),
            );
        }
    }

    const sortByTags = (tags: string[] | null | undefined = null, events: Event[]): Event[] => {
        if (!tags) return events;

        if (tags.length === 0) return events;

        return events.filter((event: Event) => {
            return event.tags.some((tag) =>
                tags.includes(tag.name),
            );
        });
    }

    const sortByName = (locale: Locales, query: string | null | undefined, events: Event[]): Event[] => {
        if (!query || query.trim().length === 0) {
            log("no query")
            return events;
        }

        const result = searchEvents(searchValue, locale, events);
        dispatch("search", {query: searchValue?.toLowerCase(), events: result})

        return result;
    }

    const onTagClick = (tag: Tag | null | undefined = null) => {
        if (!tag) { //reset Tags
            selectedTags = [];
        } else if (selectedTags.includes(tag)) { // remove Tag
            selectedTags = selectedTags.filter((t) => t != tag);
        } else { // add Tag
            selectedTags = [...selectedTags, tag];
        }

        selectedTagsName = selectedTags.map((t) => t.name);
        dispatch('selectedTags', {tags: selectedTagsName});

        debounce(() => {
            eventsToDisplay = sortEventsToDisplay(locale);
            eventsDisplayed = [...eventsToDisplay].slice(0, eventsPerChunk)
        }, 400)(); //reduce lag when user select multiple tags;
    }

    const onInput = () => {
        isLoading = true; //will be false on props 'events' update
        debounce(() => {
            if (searchValue !== oldSearchValue) {
                oldSearchValue = searchValue

                selectedTags = [];
                selectedTagsName = [];
                eventsToDisplay = sortEventsToDisplay(locale);
                eventsDisplayed = [...eventsToDisplay].slice(0, eventsPerChunk)
            }

            isLoading = false;
        }, 600)();
    }

    async function onDateChanges() {
        sortEventsToDisplay(locale)
    }

    function resetDisplay() {
        isLoading = true;
        eventsToDisplay = sortEventsToDisplay(locale);
        eventsDisplayed = [...eventsToDisplay].slice(0, eventsPerChunk)
        isLoading = false;
    }

    onMount(() => {
        log("Agenda: mounting", {events})
        buildCalendar();
        log("Agenda: mounted", {events})
    })

    afterUpdate(() => {
        //prevent destroy and miss build after window resize
        buildCalendar();
        hasMoreEvents = eventsDisplayed.length < eventsToDisplay.length;

        log("Agenda: updated", {events, eventsToDisplay, eventsDisplayed, hasMoreEvents})
    })

    $: events, (() => {
        allTags = events
            .flatMap((x) => x.tags)
            .filter(
                (a, i) =>
                    events
                        .flatMap((x) => x.tags)
                        .findIndex((s) => a.name === s.name) === i,
            );
        isLoading = false;

        todaySelected = now === startDate && now === endDate;
        weekendSelected = thisWeekend.saturday.format(dateFormat) === startDate && thisWeekend.sunday.format(dateFormat) === endDate;
        resetDisplay();
    })();

    $: hasMoreEvents;
    $: isMobile;
    $: isLoading;
    $: disableButtons;
    $: loadingAllContent;
    $: loading;
    $: selectedTags;
    $: selectedTagsName;
    $: eventsToDisplay;
    $: eventsDisplayed;
</script>

<svelte:window on:resize={() => {
    isMobile = document.body.offsetWidth < smallScreen
    try{
        if(calendar?.visible) calendar?.hide()
    }
    catch (e){
        console.error(`calendar element is not yet created: ${calendar?.visible}`)
    }
}}/>

<div class="agenda p-5 md:p-7 md:px-12">
    <Heading tag="h2" class="mb-5 !text-2xl font-semibold">{title ?? $_("agenda.title")}</Heading>

    <div class="search-section">
        <div class="w-full xs:flex xs:justify-start search-section">
            <!--    TODAY    -->
            <button
                    class="block w-full p-3 mb-3 xs:mr-1 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent
                    {todaySelected ? 'border-honey-500 bg-honey-500' : ''}
                    {disableButtons ? 'cursor-progress text-gray-500 border-gray-500 hover:border-gray-500 hover:bg-transparent' : ''}"
                    disabled="{disableButtons}"
                    on:click={(_) => {
                        if(disableButtons) return;

                        if (!todaySelected){
                            startDate = now;
                            endDate = todaySelected ? null : now;
                        } else {
                            startDate = now;
                            endDate = null;
                        }

                        calendar?.clear()
                        selectedTags = [];
                        selectedTagsName = [];
                        log("updateDates", { query: searchValue?.toLowerCase(), dates: [startDate, endDate] })
                    }}
            >
                {$_("agenda.search_section.today")}
            </button>

            <!--    WEEKEND   -->
            <button
                    class="block w-full p-3 mb-3 xs:mr-1 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent break-keep whitespace-break-spaces
                    {weekendSelected ? 'border-honey-500 bg-honey-500' : ''}
                    {disableButtons ? 'cursor-progress text-gray-500 border-gray-500 hover:border-gray-500 hover:bg-transparent' : ''}"
                    disabled="{disableButtons}"
                    on:click={(_) => {
                        if(disableButtons) return;

                        if (weekendSelected){
                            startDate = now;
                            endDate = null;
                        } else {
                            startDate = thisWeekend.saturday.format(dateFormat);
                            endDate = thisWeekend.sunday.format(dateFormat);
                        }

                        todaySelected = false;
                        calendar?.clear()
                        selectedTags = [];
                        selectedTagsName = [];
                        log("updateDates", { query: searchValue?.toLowerCase(), dates: [startDate, endDate] })
                    }}
            >
                {$_("agenda.search_section.this_weekend")}
            </button>

            <!--    DATE    -->
            <div class="flex relative w-full mb-3 sm:mb-0 sm:mr-3 sm:w-auto border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent
                {!todaySelected && !weekendSelected && startDate && endDate ? 'border-honey-500 bg-honey-500' : ''}
                {disableButtons ? 'cursor-progress text-gray-500 border-gray-500 hover:border-gray-500 hover:bg-transparent' : ''}"
            >
                <input type="text" id="dp" class="absolute bottom-0 left-0 w-0 outline-0 ring-transparent outline-none"
                       bind:value={dpDates}
                       bind:this={dpField}/>
                <button
                        disabled="{disableButtons}"
                        on:click={(_) => {
                            if(disableButtons) return;

                            dpField?.focus()
                        }}
                        class="block w-full p-3 ring-transparent
                    {startDate && endDate && !todaySelected && !thisWeekend ? 'border-honey-500 bg-honey-500' : ''}
                    {disableButtons ? 'cursor-progress' : ''}"
                >
                    <span class="flex justify-center items-center w-max m-auto">
                        <Calendar class="w-5 h-5 -mt-1"/>
                        &nbsp;
                        {$_("agenda.search_section.dates")}
                    </span>
                </button>
            </div>

            <!--    SEARCH    -->
            <div class="by-name hidden sm:flex sm:items-center border-b border-honey-500">
                <input
                        class="h-full w-full outline-0 ring-transparent outline-none {disableButtons ? 'cursor-progress' : ''}"
                        name="search-event"
                        disabled="{disableButtons}"
                        placeholder={$_("agenda.search_section.by_name_placeholder")}
                        type="search"
                        bind:value={searchValue}
                        on:keyup={onInput}
                />
                <Search class="text-honey-500"/>
            </div>
        </div>

        <!--    TAGS    -->
        <div class="by-tags sm:mt-4">
            <button
                    on:click={() => (openTagsDrawer = true)}
                    class="sm:hidden block w-full p-3 mb-3 border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
            >
                {$_("agenda.by_tags")}
                {#if (selectedTagsName.length)}({selectedTagsName.length}){/if}
            </button>

            {#if loading}
                <div class="!hidden sm:flex text-nowrap pb-2 h-[45px] w-full">
                    {#each {length: 20} as _}
                        <div class="mr-2 sm:text-md px-3 sm:py-1 sm:px-2 rounded-full w-[200px] bg-gray-300 pointer-events-none"></div>
                    {/each}
                </div>
            {:else}
                <TagsSwiper
                        class="hidden sm:flex cursor-grab active:cursor-grabbing"
                        tags={allTags}
                        {selectedTags}
                        displayBtnAll={true}
                        on:tagSelect={(event) => onTagClick(event.detail.tag)}
                        tagClass="py-2 mr-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 ring-transparent px-5"
                />
            {/if}

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

                    <span class="mt-3">
                        <Cross1/>
                    </span>
                </button>
                <div class="drawer-categories absolute mt-2 h-72 overflow-y-scroll flex flex-wrap">
                    <button
                            class="inline-flex justify-center items-center h-min py-2 m-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent {selectedTags.length ===
                        0
                            ? 'border-honey-500 bg-honey-500'
                            : ''} px-5"
                            on:click={() => onTagClick()}
                            title={$_("agenda.tags.display_all")}
                    >{$_("agenda.tags.display_all")}</button
                    >

                    {#each allTags as tag}
                        {@const elementSelected = selectedTagsName.includes(
                            tag.name,
                        )
                            ? "border-honey-500 bg-honey-500"
                            : ""}

                        <button
                                on:click={() => onTagClick(tag)}
                                class="inline-flex justify-center items-center h-min py-2 m-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent px-5 {elementSelected} "
                                title={tag.public_name[locale]}
                        >{tag.public_name[locale]}</button
                        >
                    {/each}
                </div>
                <div class="w-full p-2 absolute bottom-0 right-0">
                    <button
                            class="border border-honey-500 bg-honey-500 py-2 px-4 float-right"
                            on:click={() => (openTagsDrawer = false)}
                    >{$_(
                        `agenda.tags_drawer.${eventsDisplayed.length === 1 ? "singular" : "plural"}`,
                        {values: {quantity: eventsDisplayed.length}},
                    )}</button
                    >
                </div>
            </Drawer>
        </div>

        <!--    SEARCH    -->
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
            {#each eventsDisplayed as event, index (event.seo.slug.fr)}
                <EventCard {event} {baseUrl} selectedDates={({start: startDate, end: endDate})}/>
            {/each}
        {/if}
    </div>
    <div class="flex flex-col items-center mt-5">
        {#if isLoading || loadingAllContent}
            <p>
                <Loader class="ml-3" size="{30}"/>

                {$_("agenda.getting_data")}
            </p>
        {/if}
        {#if !isLoading && hasMoreEvents && !loading && !loadingAllContent}
            <button
                    on:click={handleLoadMore}
                    class="flex justify-center w-full xs:w-max px-4 py-3 m-3 border border-black hover:border-honey-500 focus:border-honey-500 hover:bg-honey-500 focus:bg-honey-500 ring-transparent"
            >
                <ChevronDown/>
                &nbsp;
                {$_("agenda.search_section.load_more")}
            </button>
        {/if}
        {#if ((!isLoading && !hasMoreEvents) || loading) && !loadingAllContent }
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

<style lang="scss">

  .drawer-categories::after {
    content: "";
    position: sticky;
    z-index: 1;
    bottom: 0;
    left: 0;
    pointer-events: none;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 90%);
    width: 100%;
    height: 4em;
  }
</style>

