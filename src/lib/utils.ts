import {Environment, type Locales} from "$lib/types";
import euclidFlexFonts from "../assets/fonts/euclid-flex.css?inline";

export const defaultLocale: Locales = import.meta.env.VITE_LOCALE ?? 'en';

export const getShadowRoot = (element: HTMLElement | undefined): ShadowRoot | null => {
    const root = element?.getRootNode();
    return root instanceof ShadowRoot ? root : null;
}

// Prepended so that any stylesheet added after it can override it.
export const injectShadowStyles = (root: ShadowRoot, css: string): void => {
    const style = document.createElement("style");
    style.textContent = css;
    root.prepend(style);
}

const FONTS_STYLE_ID = "swc-lt-agenda-fonts";

// @font-face is ignored inside shadow roots, so fonts are registered on the document.
export const registerFonts = (): void => {
    if (document.getElementById(FONTS_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = FONTS_STYLE_ID;
    style.textContent = euclidFlexFonts;
    document.head.appendChild(style);
}

/**
 * @param {number} [size = 8] size max 36
 */
export const randomString = (size: number = 8): string => Math.random().toString(36).slice(-size);

export const log = (information: string, content: any = undefined): void | null => import.meta.env.VITE_ENV === Environment.dev ? console.log({information, ...content}) : null;
export const warn = (information: string, content: any = undefined): void | null => import.meta.env.VITE_ENV === Environment.dev ? console.warn({information, ...content}) : null;
export const error = (information: string, content: any = undefined): void | null => import.meta.env.VITE_ENV === Environment.dev ? console.error({information, ...content}) : console.error(`Please contact admin and explain how to obtain this error. Additional information: ${information}`);

/**
 *
 * min and max included
 * @param min
 * @param max
 *
 * @return {number}
 */
export const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1) + min);


export const debounce = (callback: Function, wait: number) => {
    let timeoutId: NodeJS.Timeout | number | undefined;

    return (...args: any[]): void => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
            callback(...args);
        }, wait);
    };
}

export const arrayUniqueByKey = <T extends Record<string, any>>(array: T[], key: string):T[] => [...new Map(array.map(item =>
    [item[key], item])).values()]
