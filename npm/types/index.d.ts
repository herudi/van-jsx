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
export interface Hook<T, V> {
    __watcher: Watchers<V>;
    __idx: number;
    id: string;
    each: <K = HTMLElement>(callback: (node: K) => void) => void;
    value: V;
    elem: T;
    watch: (callback: (value: V) => void) => void;
    on: <K extends keyof HTMLElementEventMap>(type: K, listener: EventListenerOrEventListenerObject) => void;
}
interface HookElement<T, V> extends Hook<T, V> {
    template: JSX.Element;
}
type Watchers<V> = ((value: V) => void)[];
export declare const IS_BROWSER: boolean;
export declare const isValidElement: (elem: JSX.Element) => any;
export declare const tick: any;
export declare function renderToString(component: JSX.Element): string;
export declare function onMounted(callback: MountedCallback): void;
export declare function render(component: JSX.Element, root: HTMLElement | null): void;
export declare function h(type: string | TRet, props: TRet | null | undefined, ...args: TRet): {
    type: any;
    props: any;
    key: any;
    _t?: undefined;
} | {
    type: any;
    props: any;
    key: any;
    _t: () => string;
};
export declare namespace h {
    var Fragment: FC<unknown>;
}
export declare const Fragment: FC;
export declare function useId<T = HTMLElement, V = TRet>(value?: V): Hook<T, V>;
export declare function useElement<T = HTMLElement, V = TRet, F = TRet>(type: keyof HTMLElementTagNameMap | FC<F>, value?: V, template?: (value: V) => JSX.Element): [HookElement<T, V>, FC<F>];
export {};
