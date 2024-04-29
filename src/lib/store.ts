import {type Writable, writable} from "svelte/store";

export const blankableLinks: Writable<boolean> = writable<boolean>(true);
