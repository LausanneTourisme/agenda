<script lang="ts">
    import {_, locale} from 'svelte-i18n';

    import {fade} from "svelte/transition";
    import Clickable from "$lib/components/Clickable.svelte";
    import Heading from "$lib/components//Heading.svelte";
    import {Calendar} from "lucide-svelte";
    import type {Event, Media, Period, ScheduleDate} from "$lib/types";
    import moment from "moment/moment";
    import 'moment/locale/fr-ch';
    import 'moment/locale/en-gb';
    import 'moment/locale/de';
    import {CldImage} from "svelte-cloudinary";

    // trick to bypass error type...
    const key: "fr" | "en" | "de" | "it" | "es" = ($locale ?? "en") as "fr" | "en" | "de" | "it" | "es";

    export let event: Event;

    const media: Media | undefined = event.medias.find(x => x.is_cover);

    const isSameDays = event.schedules.dates[0].periods[0].start === event.schedules.dates[0].periods[0].end;
    const date = {
        start: moment(event.schedules.dates[0].periods[0].start, "YYYY-MM-DD"),
        end: moment(event.schedules.dates[0].periods[0].end, "YYYY-MM-DD")
    };
</script>

<div class="card w-56 sm:w-72 rounded-none shadow-none flex-shrink-0 {$$props.class}" transition:fade>

    <Clickable href="{'#TODO'}" class="h-full">
        <div class="card-body p-4">
            <!--        TODO add placeholder -->
            <div class="aspect-square sm:h-64">
                {#if media}
                    <CldImage
                            src="{media.cloudinary_id}"
                            alt="{media.copyright}"
                            title="{media.copyright}"
                            height="{500}"
                            width="{500}"
                            sizes="100vw"
                            class="object-cover bg-gray-300"
                    />
                {:else}
                    <img src="./TODO_placeholder.png"
                         alt="image invalide"
                         title="image invalided"
                         height="500"
                         width="500"
                         class="object-cover"
                    />
                {/if}
            </div>
            <Heading tag="h3" class="title line-clamp-2 h-14 max-h-14 text-clip" title="{event.seo.name[key]}">
                {event.seo.name[key]}
            </Heading>
            <div class="flex items-center">
                <div class="mb-1 mr-2">
                    <Calendar class="text-black" size="24px"/>
                </div>

                <p class="flex w-full text-sm">
                    {#if isSameDays}
                        <span class="hidden sm:inline-block"
                              title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}"
                        >
                            {date.start.locale($_('date.locale')).format('DD MMM')}
                        </span>
                    {:else}
                        <span title="{date.start.locale($_('date.locale')).format('DD MMMM YYYY')}">
                            {date.start.locale($_('date.locale')).format('DD MMM')}
                        </span>

                        <span class="px-1" title="{$_('date.separator')}"> - </span>

                        <span title="{date.end.locale($_('date.locale')).format('DD MMMM YYYY')}">
                            {date.end.locale($_('date.locale')).format('DD MMM')}
                        </span>
                    {/if}


                </p>
            </div>
        </div>
    </Clickable>
</div>

<style lang="scss">
  .card {
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