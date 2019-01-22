export async function asyncMap<T, U>(arr: T[], mapFn: (value: T) => U): Promise<U[]> {
  return new Promise<U[]>(resolve => {
    const length = arr.length;
    const result = new Array(length);
    let index = 0;
    (function nextElement() {
      if (index < length) {
        result[index] = mapFn(arr[index]);
        index++;
        setImmediate(nextElement);
      } else resolve(result);
    })();
  });
}
