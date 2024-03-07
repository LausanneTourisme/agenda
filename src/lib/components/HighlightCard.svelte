<script lang="ts">
    import {fade} from "svelte/transition";
    import Clickable from "$lib/components/Clickable.svelte";
    import Heading from "$lib/components//Heading.svelte";
    import {ClassList} from "$lib/ClassList";
    import {Calendar} from "lucide-svelte";

    import moment from "moment/moment";
    import 'moment/locale/en-gb';
    import 'moment/locale/fr-ch';
    import 'moment/locale/de';
    import 'moment/locale/it';
    import 'moment/locale/es';

    export let imgSrc: string;
    export let imgCopyright: string;
    export let title: string;
    export let href: string;

    //Y-m-d
    export let dates: string[]


    let style: ClassList = ClassList.make("card w-72 rounded-none shadow-none flex-shrink-0");

    $: style;
    moment().locale('fr')
    //TODO convert dates to Date and display day 3letters month year
</script>

<div class="{style.merge($$props.class)}" transition:fade>
    <Clickable {href} class="h-full">
        <div class="card-body p-4">
            <figure class="h-64">
                <img src="{imgSrc}" alt="{imgCopyright}" title="{imgCopyright}" class="object-cover w-full h-full"/>
            </figure>
            <div class="title">
                <Heading tag="h3" class="line-clamp-2 text-clip" {title}>
                    {title}
                </Heading>
            </div>
            <div class="flex items-center">
                <div class="mb-1 mr-2">
                    <Calendar color="#E7302F" size="24px"/>
                </div>

                <p class="flex w-full text-sm">
                    {#each dates as date, i}
                        {@const d =  moment(date, 'YYYY-MM-DD')}
                        <span title="{d.locale('fr-ch').format('DD MMMM YYYY')}">
                            {d.locale('fr-ch').format('DD MMM')}
                        </span>
                        {#if (i < (dates.length - 1))}
                            <span class="px-2">-</span>
                        {/if}
                    {/each}
                </p>
            </div>
        </div>
    </Clickable>
</div>

<style lang="scss">
  .card {
    height: 400px;

    .card-body {
      display: flex;
      flex-flow: column;
      height: 100%;

      .title {
        flex: 1 1 auto;
      }
    }
  }
</style>