<script lang="ts">
    import Heading from "$lib/components/Heading.svelte";
    import DateRangePicker from "$lib/components/DateRangePicker.svelte";
    import {Calendar} from "lucide-svelte";
    import {_} from "svelte-i18n";

    let tags = events.flatMap(x => x.tags).filter((a, i) => events.flatMap(x => x.tags).findIndex((s) => a.public_name === s.public_name) === i).map(x => x.public_name);

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

    <!--    <DateRangePicker/>-->

    <div class="tags-section py-3">
        {#each tags as tag}
            <button class="inline-block text-black border border-black rounded-full hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent px-6 mr-2"
                    title="{tag}">{tag}
            </button>
        {/each}
    </div>
    <div class="tags-section py-3">
        {#each tags as tag}
            <button class="inline-block text-black border border-black rounded-tl-lg rounded-br-lg hover:border-yellow-400 has-[:checked]:border-yellow-400 hover:bg-yellow-400 has-[:checked]:bg-yellow-400 items-center gap-6 p-4 ring-2 ring-transparent mr-2"
                    title="{tag}">{tag}
            </button>
        {/each}
    </div>

    {events.length} événement{events.length > 1 ? 's' : ''} correspond{events.length > 1 ? 'ent' : ''} à ces critères


</div>

<style>

</style>