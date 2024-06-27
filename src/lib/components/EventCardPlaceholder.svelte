<script lang="ts">
</script>

<div data-id="lt-agenda-placeholder"
     class="lt-agenda-event-card animate-pulse flex flex-row bg-slate-100 w-full rounded-sm overflow-hidden {$$props.class ?? ''}">
    <div class="lt-agenda-image-wrapper aspect-square h-40 sm:h-64">
        <div class="aspect-square sm:w-full bg-gray-300"></div>
    </div>
    <div class="informations flex flex-col flex-1 overflow-hidden">
        <!--TAGS-->
        <div class="text-nowrap pb-2 tags px-2 mt-1.5 sm:mt-4 sm:px-4 cursor-pointer h-[30px] w-full flex">
            {#each {length: 4} as _}
                <div class="flex justify-content items-center w-[300px] text-sm  mr-2 sm:text-md px-3 sm:py-1 sm:px-2 w-[200px] bg-gray-300 rounded-full"></div>
            {/each}
        </div>


        <div class="px-2 pb-2 sm:px-4 sm:pb-4 flex-grow flex flex-col">
            <!--TITLE-->
            <div class="flex-grow flex items-center">
                <p class="title my-1 line-clamp-2 max-h-12 sm:max-h-14 text-md sm:text-xl leading-snug tracking-tight font-semibold align-middle h-2/3 bg-gray-300 w-full">
                </p>
            </div>
            <!--DATE-->
            <div class="lt-agenda-date text-sm sm:text-md flex items-center sm:mt-2 w-full">
                <div class="mr-2 bg-gray-300 aspect-square h-[24px]"></div>
                <p class="flex leading-snug tracking-tight truncate h-[24px] bg-gray-300 w-full"></p>
            </div>
            <!--SCHEDULE-->
            <div class="lt-agenda-schedule text-sm sm:text-md hidden sm:flex w-full sm:mt-4 ">
                <div class="mr-2 bg-gray-300 aspect-square h-[24px]"></div>
                <p class="leading-snug tracking-tight h-[24px] bg-gray-300 w-full"></p>
            </div>
            <!--LOCATION-->
            <div class="lt-agenda-location text-sm sm:text-md flex w-full mt-2 sm:mt-4 h-[24px]">
                <div class="mr-2 bg-gray-300 aspect-square h-[24px]"></div>
                <p class="leading-snug tracking-tight truncate h-[24px] bg-gray-300 w-full"></p>
            </div>
        </div>
    </div>
</div>
