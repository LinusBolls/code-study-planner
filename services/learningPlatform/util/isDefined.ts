export const isDefined = <T>(value?: T | null): value is T => value != null;

export const isUnique = (value: any, index: number, self: any[]) => {
  return self.indexOf(value) === index;
};
