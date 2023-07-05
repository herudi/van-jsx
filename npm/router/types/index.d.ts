import { FC, HTMLAttributes } from "van-jsx";
type TRet = any;
type TObject = {
    [k: string]: TRet;
};
export type RouteProps = {
    pathname: string;
    path: string | RegExp;
    params: TObject;
    go: (pathname: string) => void;
};
export type TRouter = {
    path: string;
    component: (route: RouteProps) => JSX.Element;
    pattern: RegExp;
};
export type RouterOptions = {
    hash?: boolean;
    ssr_path?: string;
    redirect?: string;
    name?: string;
};
export declare const Link: FC<HTMLAttributes>;
export declare const createRouter: (opts?: RouterOptions) => FC<{
    path: string;
    component: (route: RouteProps) => JSX.Element;
}>;
export {};
