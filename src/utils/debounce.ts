/* eslint-disable @typescript-eslint/no-explicit-any */
type TimerId = ReturnType<typeof setTimeout>; // Ack this sidesteps that window.setTimeout and Node's setTimeout return different types

type Cancellable<A extends Array<any>> = ((...args: A) => void) & {
  cancel(finish?: boolean): void;
};

/** returns a debounced function that only runs after `delay` milliseconds
 * of quiet-time.
 * The returned function also has a nice `.cancel()` method.
 */
const debounce = <A extends Array<any>>(
  func: (...args: A) => void,
  delay: number,
  immediate?: boolean
): Cancellable<A> => {
  let timeout: TimerId | undefined;
  let _args: A;
  let _this: unknown;

  const debouncedFn: Cancellable<A> = function (this: any, ...args) {
    _args = args;
    _this = this;

    immediate && !timeout && func.apply(_this, _args);

    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      debouncedFn.cancel(true);
    }, delay);
  };

  debouncedFn.cancel = (finish) => {
    timeout && clearTimeout(timeout);
    finish && !!timeout && func.apply(_this, _args);
    timeout = undefined;
  };

  return debouncedFn;
};

export default debounce;
