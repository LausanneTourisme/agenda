<script lang="ts">
  import EventCard from "$lib/components/EventCard.svelte";
  import Heading from "$lib/components/Heading.svelte";
  import Loader from "$lib/components/Loader.svelte";
  import TagsSwiper from "$lib/components/TagsSwiper.svelte";
  import Drawer from "$lib/components/Drawer.svelte";
  import EventCardPlaceholder from "$lib/components/EventCardPlaceholder.svelte";
  import { dateFormat, getWeekend, now } from "$lib/date-utils";
  import type { Event, Locales, Query, Tag } from "$lib/types";
  import { Calendar, ChevronDown, Search } from "@lucide/svelte";
  import moment from "moment";
  import { untrack } from "svelte";
  import { _ } from "svelte-i18n";
  import { Cross1 } from "svelte-radix";
  import { debounce, error, log } from "$lib/utils";
  import { getUniqueTagsFromEvents, sortEventsToDisplay } from "$lib/event-utils";
  import AirDatepicker, { type AirDatepickerLocale } from "air-datepicker";
  import localeDe from "air-datepicker/locale/de";
  import localeEn from "air-datepicker/locale/en";
  import localeFr from "air-datepicker/locale/fr";

  type Dates = [string, string | undefined | null];
  type ChangeDetail = { locale: string; query: Query; dates: Dates; tags: string[] };

  interface Props {
    locale: Locales;
    disableButtons?: boolean;
    startDate: string;
    endDate: string | undefined | null;
    baseUrl: string;
    title: string | null | undefined;
    hideTitle?: boolean | null | undefined;
    events: Event[];
    eventsPerChunk: number;
    loading?: boolean;
    loadingAllContent?: boolean;
    onchange?: (detail: ChangeDetail) => void;
    onloadmore?: (detail: ChangeDetail) => void;
    onupdatedates?: (detail: { query: Query; dates: Dates }) => void;
    onsearch?: (detail: { locale: string; query: Query; events: Event[] }) => void;
    onselectedtags?: (detail: { tags: string[] }) => void;
  }

  let {
    locale,
    disableButtons = true,
    startDate = $bindable(),
    endDate = $bindable(),
    baseUrl,
    title,
    hideTitle = false,
    events,
    eventsPerChunk,
    loading = false,
    loadingAllContent = true,
    onchange,
    onloadmore,
    onupdatedates,
    onsearch,
    onselectedtags,
  }: Props = $props();

  const thisWeekend = getWeekend(moment());
  const todaySelected = $derived(now === startDate && now === endDate);
  const weekendSelected = $derived(
    thisWeekend.saturday.format(dateFormat) === startDate &&
      thisWeekend.sunday.format(dateFormat) === endDate
  );
  const customDatesSelected = $derived(
    !todaySelected && !weekendSelected && !!startDate && !!endDate
  );
  const selectedDatesLabel = $derived.by(() => {
    if (!customDatesSelected || !endDate) return null;
    const start = moment(startDate, dateFormat);
    const end = moment(endDate, dateFormat);
    const sameYear = start.year() === end.year() && start.year() === moment().year();
    const formatter = new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      ...(sameYear ? {} : { year: "numeric" }),
    });
    return start.isSame(end, "day")
      ? formatter.format(start.toDate())
      : formatter.formatRange(start.toDate(), end.toDate());
  });

  let isLoading: boolean = $state(true);
  let eventsToDisplay: Event[] = $state.raw([]); // All sorted events (by date, tags, name)
  let eventsDisplayed: Event[] = $state.raw([]); // events that user is currently seeing
  let currentChunk: number = 1;
  const hasMoreEvents = $derived(eventsDisplayed.length < eventsToDisplay.length);

  let searchValue: string | undefined | null = $state();
  let oldSearchValue: string | undefined | null;

  let selectedTags: Tag[] = $state.raw([]);
  let selectedTagsName: string[] = $state.raw([]);

  const allTags: Tag[] = $derived(
    getUniqueTagsFromEvents(
      events,
      { start: startDate, end: endDate ?? undefined },
      searchValue,
      locale
    )
  );
  let openTagsDrawer = $state(false);

  const resetSelectedTags = () => {
    selectedTags = [];
    selectedTagsName = [];
  };

  const emitChange = (query: Query = searchValue?.toLowerCase()) => {
    onchange?.({ locale, query, tags: selectedTagsName, dates: [startDate, endDate] });
  };

  /*****************************************************************************
     /* START CALENDAR SECTION
     /*****************************************************************************/

  const smallScreen: number = 640;
  let isMobile: boolean = $state(document.body.offsetWidth < smallScreen);

  // air-datepicker locales are CommonJS: Vite 8 interop may wrap them in a `default` key.
  const unwrapLocale = (l: AirDatepickerLocale): AirDatepickerLocale =>
    (l as AirDatepickerLocale & { default?: AirDatepickerLocale }).default ?? l;

  const calendarLocales = (locale: Locales): AirDatepickerLocale => {
    switch (locale) {
      case "fr":
        return unwrapLocale(localeFr);
      case "de":
        return unwrapLocale(localeDe);
      case "en":
      default:
        return unwrapLocale(localeEn);
    }
  };

  let calendar: AirDatepicker<HTMLInputElement> | null = null;
  let dpDates: string = $state("");
  let dpField: HTMLInputElement;
  let agendaElement: HTMLElement;

  const selectCalendarDates = (dp: AirDatepicker<HTMLInputElement>, start: string, end: string) => {
    startDate = start;
    endDate = end;
    const dates = [new Date(startDate), new Date(endDate)];
    resetSelectedTags();

    dp.selectDate(dates);
    dp.setViewDate(dates[0]);
    onupdatedates?.({ query: searchValue?.toLowerCase(), dates: [startDate, endDate] });
  };

  const buildCalendar = () => {
    try {
      calendar?.destroy();
    } catch (e) {
      error("Trying to reset calendar too early");
    }

    // air-datepicker appends its mobile overlay to its global container, which it skips building when given a custom container.
    if (isMobile && !document.getElementById(AirDatepicker.defaultGlobalContainerId)) {
      AirDatepicker.buildGlobalContainer(AirDatepicker.defaultGlobalContainerId);
    }

    calendar = new AirDatepicker<HTMLInputElement>(dpField, {
      locale: calendarLocales(locale),
      container: agendaElement,
      range: true,
      selectedDates: startDate && endDate ? [startDate, endDate] : undefined,
      multipleDatesSeparator: `,`,
      onSelect: ({ date }) => {
        if (date instanceof Array && date.length === 2) {
          startDate = moment(date[0]).format(dateFormat);
          endDate = moment(date[1]).format(dateFormat);
          resetSelectedTags();

          onupdatedates?.({ query: searchValue?.toLowerCase(), dates: [startDate, endDate] });
          emitChange();
        }
      },
      toggleSelected: ({ datepicker, date }) => {
        if (datepicker.selectedDates.length === 2) {
          datepicker.clear({ silent: true });
          datepicker.selectDate(date);
        }
        return false;
      },
      buttons: [
        {
          content: $_("datepicker.today"),
          className: "custom-button-classname",
          onClick: (dp) => {
            selectCalendarDates(dp, now, now);
            emitChange(searchValue);
          }
        },
        {
          content: $_("datepicker.weekend"),
          className: "custom-button-classname",
          onClick: (dp) => {
            selectCalendarDates(
              dp,
              thisWeekend.saturday.format(dateFormat),
              thisWeekend.sunday.format(dateFormat)
            );
            emitChange();
          }
        },
        {
          content: $_("datepicker.clear"),
          className: "custom-button-classname",
          onClick: (dp) => {
            startDate = now;
            endDate = null;
            resetSelectedTags();

            dp.clear();
            dp.hide();
            dp.setViewDate(new Date());

            onupdatedates?.({ query: searchValue?.toLowerCase(), dates: [startDate, endDate] });
            emitChange();
          }
        }
      ],
      autoClose: true,
      isMobile
    });

    const overlay = document.querySelector(".air-datepicker-overlay");
    if (overlay) agendaElement.appendChild(overlay);
  };

  $effect(() => {
    buildCalendar();
    log("Agenda: calendar built", { events: untrack(() => events) });
  });

  /*****************************************************************************
     /* END CALENDAR SECTION
     /*****************************************************************************/

  const showFirstChunk = (sorted: Event[]) => {
    eventsToDisplay = sorted;
    eventsDisplayed = sorted.slice(0, eventsPerChunk);
    currentChunk = 1;
  };

  function handleLoadMore() {
    const start: number = Number(currentChunk) * Number(eventsPerChunk);
    const end = Number(start) + Number(eventsPerChunk);

    const tempEvents = eventsToDisplay.slice(start, end);
    eventsDisplayed = [...eventsDisplayed, ...tempEvents];
    currentChunk++;

    onloadmore?.({
      locale: locale as string,
      query: searchValue?.toLowerCase(),
      tags: selectedTagsName,
      dates: [startDate, endDate]
    });

    log("Handle more events!", { new: tempEvents, eventsDisplayed });
  }

  const handleTagClick = (tag: Tag | null | undefined = null) => {
    if (!tag) {
      selectedTags = [];
    } else if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter((t) => t != tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }

    selectedTagsName = selectedTags.map((t) => t.name);
    onselectedtags?.({ tags: selectedTagsName });

    debounce(() => {
      showFirstChunk(
        sortEventsToDisplay(locale, events, startDate, {
          endDate: endDate ?? undefined,
          query: searchValue,
          selectedTagsName
        })
      );
      emitChange();
    }, 400)(); //reduce lag when user select multiple tags;
  };

  const handleInput = () => {
    isLoading = true;
    debounce(() => {
      if (searchValue !== oldSearchValue) {
        oldSearchValue = searchValue;

        resetSelectedTags();
        showFirstChunk(
          sortEventsToDisplay(locale, events, startDate, {
            endDate: endDate ?? undefined,
            query: searchValue,
            selectedTagsName: []
          })
        );

        onsearch?.({ locale, query: searchValue?.toLowerCase(), events: eventsToDisplay });
        onchange?.({ locale, query: searchValue, tags: [], dates: [startDate, endDate] });
      }

      isLoading = false;
    }, 600)();
  };

  $effect(() => {
    const sorted = sortEventsToDisplay(locale, events, startDate, {
      endDate: endDate ?? undefined,
      query: searchValue,
      selectedTagsName: untrack(() => selectedTagsName)
    });

    untrack(() => {
      showFirstChunk(sorted);
      isLoading = false;
    });
  });

  $effect(() => {
    log("Agenda: updated", {
      events,
      eventsToDisplay,
      eventsDisplayed,
      hasMoreEvents
    });
  });

  const selectQuickDates = (start: string, end: string | null) => {
    startDate = start;
    endDate = end;

    calendar?.clear();
    resetSelectedTags();
    log("updateDates", { query: searchValue?.toLowerCase(), dates: [startDate, endDate] });
    emitChange();
  };
</script>

<svelte:window
  onresize={() => {
    isMobile = document.body.offsetWidth < smallScreen;
    try {
      if (calendar?.visible) calendar?.hide();
    } catch (e) {
      error(`calendar element is not yet created: ${calendar?.visible}`);
    }
  }}
/>

<div class="agenda relative p-5 md:p-7 md:px-12" part="agenda" bind:this={agendaElement}>
  {#if !hideTitle}
    <Heading tag="h2" class="mb-5 text-2xl! font-semibold" part="agenda-title">
      {title ?? $_("agenda.title")}
    </Heading>
  {/if}
  <div class="search-section">
    <div class="w-full flex flex-wrap sm:flex-nowrap sm:justify-start search-section">
      <!--    TODAY    -->
      <button
        class="flex-1 p-3 mb-3 mr-1 sm:flex-none sm:mb-0 sm:mr-3 border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent
                    {todaySelected ? 'border-honey-500 bg-honey-500' : ''}
                    {disableButtons
          ? 'cursor-progress text-gray-500 border-gray-500 hover:border-gray-500 hover:bg-transparent'
          : ''}"
        part="filter-button{todaySelected ? ' filter-button-active' : ''}"
        disabled={disableButtons}
        onclick={() => {
          if (disableButtons) return;

          selectQuickDates(now, todaySelected ? null : now);
        }}
      >
        {$_("agenda.search_section.today")}
      </button>

      <!--    WEEKEND   -->
      <button
        class="flex-1 p-3 mb-3 sm:flex-none sm:mb-0 sm:mr-3 border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent break-keep whitespace-break-spaces
                    {weekendSelected ? 'border-honey-500 bg-honey-500' : ''}
                    {disableButtons
          ? 'cursor-progress text-gray-500 border-gray-500 hover:border-gray-500 hover:bg-transparent'
          : ''}"
        part="filter-button{weekendSelected ? ' filter-button-active' : ''}"
        disabled={disableButtons}
        onclick={() => {
          if (disableButtons) return;

          if (weekendSelected) {
            selectQuickDates(now, null);
          } else {
            selectQuickDates(
              thisWeekend.saturday.format(dateFormat),
              thisWeekend.sunday.format(dateFormat)
            );
          }
        }}
      >
        {$_("agenda.search_section.this_weekend")}
      </button>

      <!--    DATE    -->
      <div
        class="flex relative basis-full mb-3 sm:basis-auto sm:mb-0 sm:mr-3 border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent
                {customDatesSelected
          ? 'border-honey-500 bg-honey-500'
          : ''}
                {disableButtons
          ? 'cursor-progress text-gray-500 border-gray-500 hover:border-gray-500 hover:bg-transparent'
          : ''}"
        part="filter-button{customDatesSelected ? ' filter-button-active' : ''}"
      >
        <input
          type="text"
            class="absolute bottom-0 left-0 w-0 outline-0 ring-transparent outline-hidden"
          bind:value={dpDates}
          bind:this={dpField}
        />
        <button
          disabled={disableButtons}
          onclick={() => {
            if (disableButtons) return;

            dpField?.focus();
          }}
          class="block w-full p-3 ring-transparent
                    {customDatesSelected
            ? 'border-honey-500 bg-honey-500'
            : ''}
                    {disableButtons ? 'cursor-progress' : ''}"
        >
          <span class="flex justify-center items-center w-max m-auto">
            <Calendar class="w-5 h-5 -mt-1" />
            &nbsp;
            {selectedDatesLabel ?? $_("agenda.search_section.dates")}
          </span>
        </button>
      </div>

      <!--    SEARCH    -->
      <div
        class="by-name hidden sm:flex sm:items-center border-b border-honey-500"
      >
        <input
          class="h-full w-full outline-0 ring-transparent outline-hidden {disableButtons
            ? 'cursor-progress'
            : ''}"
          name="search-event"
          part="search"
          disabled={disableButtons}
          placeholder={$_("agenda.search_section.by_name_placeholder")}
          type="search"
          bind:value={searchValue}
          onkeyup={handleInput}
        />
        <Search class="text-honey-500" />
      </div>
    </div>

    <!--    TAGS    -->
    <div class="by-tags sm:mt-4">
      <button
        onclick={() => (openTagsDrawer = true)}
        part="filter-button"
        class="sm:hidden block w-full p-3 mb-3 border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent"
      >
        {$_("agenda.by_tags")}
        {#if selectedTagsName.length}({selectedTagsName.length}){/if}
      </button>

      {#if loading}
        <div class="hidden! sm:flex text-nowrap pb-2 h-[45px] w-full">
          {#each { length: 20 } as _}
            <div
              class="mr-2 sm:text-md px-3 sm:py-1 sm:px-2 rounded-full w-[200px] bg-gray-300 pointer-events-none"
            ></div>
          {/each}
        </div>
      {:else}
        <TagsSwiper
          class="hidden sm:flex cursor-grab active:cursor-grabbing"
          tags={allTags}
          {selectedTags}
          displayBtnAll={true}
          ontagselect={handleTagClick}
          tagClass="py-2 mr-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 ring-transparent px-5"
        />
      {/if}

      <Drawer
        onclickaway={() => (openTagsDrawer = false)}
        open={openTagsDrawer}
        placement="bottom"
        size="400px"
      >
        <button
          class="flex w-full px-2 text-left"
          onclick={() => (openTagsDrawer = false)}
        >
          <Heading class="grow mt-2" tag="h3" part="drawer-title">
            {$_("agenda.tags.title")}
          </Heading>

          <span class="mt-3">
            <Cross1 />
          </span>
        </button>
        <div
          class="drawer-categories absolute mt-2 h-72 overflow-y-scroll flex flex-wrap"
        >
          <button
            class="inline-flex justify-center items-center h-min py-2 m-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent {selectedTags.length ===
            0
              ? 'border-honey-500 bg-honey-500'
              : ''} px-5"
            onclick={() => handleTagClick()}
            part="tag{selectedTags.length === 0 ? ' tag-selected' : ''}"
            title={$_("agenda.tags.display_all")}
            >{$_("agenda.tags.display_all")}</button
          >

          {#each allTags as tag}
            {@const elementSelected = selectedTagsName.includes(tag.name)
              ? "border-honey-500 bg-honey-500"
              : ""}

            <button
              onclick={() => handleTagClick(tag)}
              part="tag{elementSelected ? ' tag-selected' : ''}"
              class="inline-flex justify-center items-center h-min py-2 m-2 text-black border border-black rounded-full hover:border-honey-500 hover:bg-honey-500 gap-6 ring-2 ring-transparent px-5 {elementSelected} "
              title={tag.public_name[locale]}>{tag.public_name[locale]}</button
            >
          {/each}
        </div>
        <div class="w-full p-2 absolute bottom-0 right-0">
          <button
            class="border border-honey-500 bg-honey-500 py-2 px-4 float-right"
            part="drawer-button"
            onclick={() => (openTagsDrawer = false)}
            >{$_(
              `agenda.tags_drawer.${eventsDisplayed.length === 1 ? "singular" : "plural"}`,
              { values: { quantity: eventsDisplayed.length } }
            )}</button
          >
        </div>
      </Drawer>
    </div>

    <!--    SEARCH    -->
    <div class="by-name w-full sm:hidden">
      <input
        class="bg-stone-100 w-full outline-hidden p-4 font-light border-0 ring-0"
        name="search-event"
        part="search"
        placeholder={$_("agenda.search_section.by_name_placeholder")}
        type="search"
        bind:value={searchValue}
        onkeyup={handleInput}
      />
    </div>
  </div>

  <hr class="mt-4 sm:hidden" />
  <div class="flex">
    <p
      class="text-xl sm:text-2xl font-semibold leading-tight tracking-tighter my-5"
      part="results-count"
    >
      {$_(`agenda.event${eventsToDisplay.length === 1 ? "" : "s"}_found`, {
        values: { quantity: eventsToDisplay.length }
      })}
    </p>
    {#if isLoading || loading}
      <Loader class="ml-3" size={30} />
    {/if}
  </div>
  <div class="grid xl:grid-cols-2 3xl:grid-cols-3 gap-4">
    {#if loading}
      {#each { length: 20 } as _}
        <EventCardPlaceholder />
      {/each}
    {:else}
      {#each eventsDisplayed as event (event.seo.slug.fr)}
        <EventCard
          {event}
          {baseUrl}
          selectedDates={{ start: startDate, end: endDate }}
        />
      {/each}
    {/if}
  </div>
  <div class="flex flex-col items-center mt-5">
    {#if isLoading || loadingAllContent}
      <p>
        <Loader class="ml-3" size={30} />

        {$_("agenda.getting_data")}
      </p>
    {/if}
    {#if !isLoading && hasMoreEvents && !loading && !loadingAllContent}
      <button
        onclick={handleLoadMore}
        part="load-more"
        class="flex justify-center w-full xs:w-max px-4 py-3 m-3 border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent"
      >
        <ChevronDown />
        &nbsp;
        {$_("agenda.search_section.load_more")}
      </button>
    {/if}
    {#if ((!isLoading && !hasMoreEvents) || loading) && !loadingAllContent}
      <p class="w-full align-middle text-center">
        {$_("agenda.search_section.load_complete")}
      </p>
      <button
        class="block w-max px-4 py-3 m-3 border border-black hover:border-honey-500 hover:bg-honey-500 ring-transparent"
        part="back-to-top"
        onclick={() => {
          agendaElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }}
      >
        {$_("agenda.search_section.again")}
      </button>
    {/if}
  </div>
</div>

<style>
  .drawer-categories::after {
    content: "";
    position: sticky;
    z-index: 1;
    bottom: 0;
    left: 0;
    pointer-events: none;
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 1) 90%
    );
    width: 100%;
    height: 4em;
  }
</style>
