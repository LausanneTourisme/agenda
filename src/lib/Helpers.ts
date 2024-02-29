export type NullableString = string | null;

export function blankable(href: NullableString): NullableString {
    if (href && href.includes('http')) {
        return "_blank";
    }

    return null;
}
