import { type FC } from "van-jsx";
declare class Attr extends Map {
    toString(): string;
    toJSON(): any;
}
export type HelmetRewind = {
    head: string[];
    footer: string[];
    attr: {
        body: Attr;
        html: Attr;
    };
    body?: string;
};
type FCHelmet = FC<{
    footer?: boolean;
}> & {
    rewind: (component?: JSX.Element) => HelmetRewind;
    writeHeadTag?: () => string[];
    writeFooterTag?: () => string[];
    writeHtmlAttr?: () => Attr;
    writeBodyAttr?: () => Attr;
};
export declare const Helmet: FCHelmet;
export {};
