/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

/* mapRouter type */
// 처음에 setting할 router값을 받기위한 타입(home.tsx, auth.tsx 에서 mapRouter의 인자로 children을 받기위한 타입)
export type IRouterChildren = { [key: string]: IRouter };

// router config를 위한 기본타입
export type IRouter<P = string, C = IRouterChildren> = {
  regexPath: P;
  title: string;
  component: (args: any) => React.ReactElement;
  children?: C;
};

// router adapter에서 추가되는 타입
export type IRouterAddedProperty = {
  path: string;
};

// router adapter가 적용된 후의 children의 타입
type IRouterAdaptedChildren<C> = C extends IRouterChildren ? { [key in keyof C]: IMapRouterReturn<C[key]> } : never;

// mapRouter함수가 리턴하는 타입
export type IMapRouterReturn<C extends IRouter<C["regexPath"]>> = IRouter<
  C["regexPath"],
  IRouterAdaptedChildren<C["children"]>
> &
  IRouterAddedProperty;

/* param type */
/**
 * 구분자(D)를 통해 문자열분리
 * @example
 * // return "" | "home" | ":param1(a|b)" | ":param2(c|d)?"
 * PathSeparate<"/home/:param1(a|b)/:param2(c|d)", "/">
 */
type PathSeparate<P extends string, D extends string> = P extends `${infer L}${D}${infer R}`
  ? [L, ...PathSeparate<R, D>]
  : [P];

/**
 * @example
 * // return "param(a|b) | param2(c|d)?"
 * ExtractParam<"" | "home" | ":param1(a|b)" | ":param2(c|d)?">
 */
type ExtractParam<T extends string> = T extends `:${infer P}` ? P : never;

type Param<N = string, V = unknown, R = boolean> = {
  name: N;
  value: V;
  required: R;
};

/**
 * required(?) 의 유무에따라 param을 parsing
 * @example
 * // return {name:param, value: a | b, required:true} | {name:param2?, value: c | d, required:false}
 * ParseParam<"param(a|b) | param2(c|d)?">
 */
type ParseParam<K extends string> = K extends `${infer N}(${infer P})`
  ? Param<N, PathSeparate<P, "|">[number], true>
  : K extends `${infer N}(${infer P})?`
  ? Param<N, PathSeparate<P, "|">[number], false>
  : Param<K, string, true>;

type GetParseParams<P extends string> = ParseParam<ExtractParam<PathSeparate<P, "/">[number]>>;

type ExtractValueOfParam<O extends Param, K> = Extract<O, { name: K }>["value"];

/**
 * required(?) 값에따라 param value의 key값을 다르게 parsing
 * @example
 * // return {param1:a | b, param2?: c | d}
 * ParseParam<"/home/:param1(a|b)/:param2(c|d)">
 */
export type ParamsFromPath<P extends string, O extends Param = GetParseParams<P>> = {
  [key in Extract<O, { required: true }>["name"]]: ExtractValueOfParam<O, key>;
} &
  { [key in Extract<O, { required: false }>["name"]]?: ExtractValueOfParam<O, key> };
