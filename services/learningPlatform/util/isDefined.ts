export const isDefined = <T>(value?: T | null): value is T => value != null;

export const isUnique = <T>(value: T, index: number, self: T[]) => {
  return self.indexOf(value) === index;
};
