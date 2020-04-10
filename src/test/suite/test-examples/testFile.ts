type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K
}[keyof T];

type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

type AType = {
  test: () => void,
};

type T1 = NonFunctionProperties<AType>;
type T2 = NonFunctionPropertyNames<AType>; 