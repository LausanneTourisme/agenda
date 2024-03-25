<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import DateRangePicker from "$lib/components/DateRangePicker.svelte";
    import {Calendar} from "lucide-svelte";
    import {_} from "svelte-i18n";
    import EventCard from "$lib/components/EventCard.svelte";
    import type {Event} from "$lib/types";
    import TagsSwiper from "$lib/components/TagsSwiper.svelte";

    export let events: Event[];

    let tags = events.flatMap(x => x.tags).filter((a, i) => events.flatMap(x => x.tags).findIndex((s) => a.name === s.name) === i);

    $: events;
</script>

<div class="agenda p-5 md:p-7 md:px-12">
    <Heading tag="h2" class="">{$_('agenda.title')}</Heading>

    <div class="search-section py-3">

        <label for="today"
               class="inline-block text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
            {$_('agenda.search-section.today')}
            <input name="search_zone" id="today" value="today" type="radio" class="accent-indigo-500" hidden checked>
        </label>
        <label for="week-end"
               class="inline-block text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
            {$_('agenda.search-section.weekend')}
            <input name="search_zone" id="week-end" value="week-end" type="radio" class="accent-indigo-500" hidden>
        </label>

        <label for="date"
               class="inline-block text-black border border-black hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2">
            <Calendar class="inline-block mr-2 -mt-1.5"/>
            <span>
                {$_('agenda.search-section.date')}
            </span>
            <input name="search_zone" id="date" value="date" type="radio" class="accent-indigo-500" hidden>
        </label>
    </div>

        <DateRangePicker/>
    <TagsSwiper class="tags-section py-3 cursor-pointer"
                {tags}
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

    <p class="text-3xl font-semibold leading-tight tracking-tighter py-3">
        {events.length} événement{events.length > 1 ? 's' : ''} correspond{events.length > 1 ? 'ent' : ''} à ces
        critères
    </p>

    <div class="grid xl:grid-cols-2 gap-4">
        {#each events as event, index}
            <EventCard class="" {event}/>
        {/each}
    </div>


</div>

<style>

</style>