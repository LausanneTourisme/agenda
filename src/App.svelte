<svelte:options
        customElement={{
            tag: "swc-lt-agenda"
        }}
/>

<script lang="ts">
    import Highlights from "$lib/composables/Highlights.svelte";
    import {getLocaleFromNavigator, init, isLoading, locale, locales, register} from "svelte-i18n";
    import type {DispatchApiEvents, Event as ApiEvent, History, RawDate} from "$lib/types";
    import Loader from "$lib/components/Loader.svelte";
    import {sortEvents, uniqueEvents} from "$lib/date-utils";
    import Agenda from "$lib/composables/Agenda.svelte";
    import {createEventDispatcher, onMount} from "svelte";
    import moment from "moment";
    import {fetchEvents} from "$lib/utils";

    register("fr", () => import("$lib/i18n/fr.json"));
    register("en", () => import("$lib/i18n/en.json"));
    register("de", () => import("$lib/i18n/de.json"));

    init({
        fallbackLocale: "en",
        initialLocale: getLocaleFromNavigator()?.slice(0, 2) ?? "en"
    });
    export let disableHighlights: boolean | null | undefined = $$props["disable-highlights"] ?? false;
    export let disableAgenda: boolean | null | undefined = $$props["disable-agenda"] ?? false;

    export let highlightTitle: string | null | undefined = $$props["highlight-title"];
    export let agendaTitle: string | null | undefined = $$props["agenda-title"];
    export let apiUrl: string | null | undefined = $$props["api-url"];

    //default we display all events starting today to indefinitely
    export let startDate: RawDate | null | undefined = $$props["start-date"] ?? moment().format("YYYY-MM-DD");
    let endDate: RawDate | null = null;

    let divStyleElement: HTMLElement | undefined;
    const dispatch = createEventDispatcher();

    const history: History = {
        highlights: {
            hasMore: true,
            page: 0
        },
        events: {
            hasMore: true,
            page: 0
        }
    };

    let key: string;
    let events: ApiEvent[] = []; //fakeEvents

    //trick to bypass problem with tailwind and shadow dom
    function applyStyling(divStyleElement: HTMLElement | undefined) {
        if (!divStyleElement) return;
        const template = document.getElementById("swc-lt-agenda-styling");

        if (!template?.content) return;
        const node = document.importNode(template.content, true);
        divStyleElement?.parentNode?.appendChild(node);
    }

    async function updateEvents(type: "events" | "highlights" = "events"): Promise<void> {
        const items = await fetchEvents(apiUrl, {
            option: `get${type}`,
            page: history.events.page + 1
        });

        events = uniqueEvents(events, items?.data ?? []);

        history[type].page = items?.current_page ?? history[type].page;
        history[type].hasMore = items?.has_more_pages ?? history[type].hasMore;
    }

    async function handleMoreEvents(e: DispatchApiEvents) {
        await updateEvents();

        console.log("dispatch loadMore !");

        e.detail.event.target.dispatchEvent(
            new CustomEvent("loadMore", {
                detail: {
                    option: "getEvents",
                    page: history.events.page + 1
                },
                composed: true
            })
        );

        dispatch("loadMore", {
            option: "getEvents",
            page: history.events.page + 1
        });
    }

    onMount(async () => {
        console.log("Mounting App");

        if (!disableHighlights) {
            await updateEvents("highlights");
        }

        if (!disableAgenda) {
            await updateEvents();
        }

        console.log("App mounted");
    });

    $: applyStyling(divStyleElement);
    $: events;
    $: key = ($locale ?? "en");
</script>

<main bind:this={divStyleElement}>
    {#if $isLoading}
        <Loader/>
    {:else}
        <div class="lang-changer w-full flex justify-center fixed">
            <select
                    bind:value={$locale}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-2/12 p-2.5"
            >
                {#each $locales as locale}
                    <option value={locale}>{locale}</option>
                {/each}
            </select>
        </div>
        {#if !disableHighlights}
            <Highlights
                    title={highlightTitle}
                    events={sortEvents(events, {
                      locale: key,
                      onlyAvailable: true,
                      onlyHighlights: true,
                      startingDate: moment(startDate, "YYYY-MM-DD"),
                      endingDate: endDate ? moment(endDate, "YYYY-MM-DD") : null
                    })}
            />
        {/if}
        {#if !disableAgenda}
            <div class="md:px-7">
                <Agenda
                        title={agendaTitle}
                        events={sortEvents(events, {
                        locale: key,
                        onlyAvailable: true,
                        onlyHighlights: false,
                        startingDate: moment(startDate, "YYYY-MM-DD"),
                        endingDate: endDate ? moment(endDate, "YYYY-MM-DD") : null
                    })}
                        historyStatus={history.events}
                        on:search={(e) => {
                        const searchValue = e.detail.value;

                        if (!searchValue) return;
                    }}
                        on:loadMore={(e) => handleMoreEvents(e)}
                />
            </div>
        {/if}
    {/if}
</main>

<style>
    .lang-changer {
        z-index: 999;
    }
</style>
