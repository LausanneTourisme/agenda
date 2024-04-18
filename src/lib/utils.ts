import type {NullableString, Event, GqlOptions, GqlItems, GqlResponse} from "$lib/types";

/**
 * @param size max 36
 */
export const randomString = (size: number = 8) => Math.random().toString(36).slice(-size);

export const warn = (information: string, content: any) => console.warn({ information, content })

/**
 *
 * min and max included
 * @param min
 * @param max
 *
 * @return {number}
 */
export const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);

export const blankable = (href: NullableString): NullableString => (href && href.includes('http')) ? "_blank" : null;

export async function fetchEvents(url: string | null | undefined, options: GqlOptions): Promise<GqlItems | null> {
    if (url) {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");

        const params: URLSearchParams = new URLSearchParams()
        params.append("options", options.option)
        params.append("page", options.page?.toString() ?? '1');

        const response: Response = await fetch(`${url}?${params}`, {redirect: 'follow'});

        const gqlResponse = await response.json();

        return gqlResponse?.result?.data?.items;
    }

    console.error('no api url defined')
    return null;
}
