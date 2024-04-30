import {type Writable, writable} from "svelte/store";
import {now} from "$lib/date-utils";
import type {RawDate} from "$lib/types";

export const blankableLinks: Writable<boolean> = writable<boolean>(true);

export const startDate: Writable<string | RawDate> = writable<string | RawDate>(now);
export const endDate: Writable<string | undefined | null | RawDate> = writable<string | undefined | null | RawDate>(null);
