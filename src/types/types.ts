export type FixMeLater = any;

// TODO: Imported images does have this structure but typescript still sees them as simple strings.
// Find out why, uncomment this and fix it:
// type ImageFileTypes = "png" | "jpg" | "jpeg"
// export type Image = `static/media/${string}.${ImageFileTypes}`
export type Image = string;
