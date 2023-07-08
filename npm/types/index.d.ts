export type TRet = any;
declare global {
    export namespace JSX {
        type Element = TRet;
        interface IntrinsicElements {
            [k: string]: TRet;
        }
    }
}
type JsxProps = {
    children?: TRet;
};
type Merge<A, B> = {
    [K in keyof (A & B)]: (K extends keyof B ? B[K] : (K extends keyof A ? A[K] : never));
};
type HTMLBasicElement = HTMLElement & HTMLInputElement;
export type RefElement = {
    [k: string]: HTMLBasicElement;
};
export type CTR<Ref extends unknown = unknown> = (ref: Ref) => void;
export type FC<T extends unknown = unknown> = (props: JsxProps & T) => JSX.Element;
type Options = {
    elem?: (elem: JSX.Element) => void;
    fc?: (elem: JSX.Element) => void;
};
export interface HTMLAttributes {
    accessKey?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    class?: string;
    className?: string;
    contentEditable?: boolean | "inherit";
    contextMenu?: string;
    dir?: string;
    draggable?: boolean;
    hidden?: boolean;
    id?: string;
    lang?: string;
    nonce?: string;
    placeholder?: string;
    slot?: string;
    spellCheck?: boolean;
    style?: string;
    tabIndex?: number;
    title?: string;
    translate?: "yes" | "no";
    dangerouslySetInnerHTML?: {
        __html: string;
    };
    type?: string;
    name?: string;
    [k: string]: TRet;
}
export declare const IS_BROWSER: boolean;
export declare const options: Options;
export declare function render(elem: JSX.Element, root: HTMLElement | null): void;
export declare function h(type: string | TRet, props?: TRet | null | undefined, ...args: TRet): any;
export declare namespace h {
    var Fragment: FC<unknown>;
}
export declare const Fragment: FC;
export declare function createHost<R>(type?: keyof HTMLElementTagNameMap): FC<TRet> & {
    controller: CTR<Merge<RefElement, R>>;
};
export declare const lazy: <T = any>(importFn: () => Promise<TRet>, fallback?: JSX.Element) => FC<T>;
export {};
