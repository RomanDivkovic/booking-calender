type Http = 'http://' | 'https://';
type LinkStartsWith = Http | 'www.' | 'tel:' | 'mailto:' | '/' | '#';

export type To = `${LinkStartsWith}${string}`;

export type Targets = '_self' | '_blank' | '_parent' | '_top';
