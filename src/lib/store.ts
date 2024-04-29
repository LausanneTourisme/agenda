import {type Writable, writable} from "svelte/store";
import moment from "moment/moment";

export const blankableLinks: Writable<boolean> = writable<boolean>(true);

export const startDate: Writable<string> = writable<string>(moment().format("YYYY-MM-DD"));
export const endDate: Writable<string | undefined | null> = writable<string | undefined | null>(null);
