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
export type FC<T extends unknown = unknown> = (props: JsxProps & T) => JSX.Element;
type MountedCallback = () => void;
type HookId<T = HTMLElement> = {
    id: string;
} & T;
type Hooked<T = HTMLElement, F = TRet> = () => [HookId<T>, FC<F>];
type UseHook = {
    [k in keyof HTMLElementTagNameMap]: Hooked<HTMLElementTagNameMap[k], HTMLAttributes>;
} & {
    element: <T = HTMLElement, F = TRet>(type: keyof HTMLElementTagNameMap | FC<F>) => [HookId<T>, FC<F>];
    bind: <S, K extends keyof S>(state: S, key: K, callback: (val: S[K]) => void) => void;
    mount: (callback: MountedCallback) => void;
};
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
    style?: {
        [k: string]: TRet;
    } | string;
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
export declare const options: Options;
export declare const isValidElement: (elem: JSX.Element) => boolean;
export declare function render(component: JSX.Element, root: HTMLElement | null): void;
export declare function h(type: string | TRet, props?: TRet | null | undefined, ...args: TRet): any;
export declare namespace h {
    var Fragment: FC<unknown>;
}
export declare const Fragment: FC;
export declare const use: UseHook;
export {};
