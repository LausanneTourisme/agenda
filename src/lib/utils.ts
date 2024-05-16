import {Environment, type History, type NullableString} from "$lib/types";

/**
 * trick to bypass problem with tailwind and shadow dom
 */
export const applyStyling = (element: HTMLElement | undefined): void => {
    if (!element) return;
    const template = document.getElementById("swc-lt-agenda-styling");

    // @ts-ignore
    if (!template?.content) return;
    // @ts-ignore
    const node = document.importNode(template.content, true);
    element?.parentNode?.appendChild(node);
}
/**
 * @param {number} [size = 8] size max 36
 */
export const randomString = (size: number = 8): string => Math.random().toString(36).slice(-size);

export const log = (information: string, content: any = undefined): void | null => import.meta.env.VITE_ENV === Environment.dev ? console.log({information, ...content}) : null;
export const warn = (information: string, content: any = undefined): void | null => import.meta.env.VITE_ENV === Environment.dev ? console.warn({information, ...content}) : null;

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
