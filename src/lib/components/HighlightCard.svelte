<script lang="ts">
    import {fade} from "svelte/transition";
    import CalendarIcon from "./icons/CalendarIcon.svelte";
    import Clickable from "./Clickable.svelte";
    import Heading from "./Heading.svelte";
    import moment from "moment/moment";
    import 'moment/locale/en-gb';
    import 'moment/locale/fr-ch';
    import 'moment/locale/de';
    import 'moment/locale/it';
    import 'moment/locale/es';

    export let imgSrc: string;
    export let imgTitle: string;
    export let title: string;
    export let href: string;

    //Y-m-d
    export let dates: string[]

    moment().locale('fr')
    //TODO convert dates to Date and display day 3letters month year
</script>

<div class="card w-72 rounded-none shadow-none flex-shrink-0" transition:fade>
    <Clickable {href} class="h-full">
        <div class="card-body p-4">
            <figure class="h-64">
                <img src="{imgSrc}" alt="{imgTitle}" title="{imgTitle}" class="object-cover w-full h-full"/>
            </figure>
            <div class="title">
                <Heading tag="h3" class="line-clamp-2 text-clip" {title}>
                    {title}
                </Heading>
            </div>
            <div class="flex items-center">
                <div class="mb-1 mr-2">
                    <CalendarIcon/>
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