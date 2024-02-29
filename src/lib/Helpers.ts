export type NullableString = string | null;

export function blankable(href: NullableString): NullableString {
    if (href && href.includes('http')) {
        return "_blank";
    }

    return null;
}

export function getRandomNumber(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
