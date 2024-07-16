type Param =
  | "q"
  | "mandatory"
  | "alternative"
  | "early"
  | "passed"
  | "failed"
  | "my-studies"
  | "my-semester"
  | "not-taken"
  | "tab";

class UrlParams {
  public get(key: Param) {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(new URL(location.href).searchParams.get(key) ?? "null");
    } catch (err) {
      return new URL(location.href).searchParams.get(key);
    }
  }
  public setMany(record: Partial<Record<Param, string | boolean>>) {
    if (typeof window === "undefined") return;

    const url = new URL(location.href);

    for (const [key, value] of Object.entries(record)) {
      if (value) {
        url.searchParams.set(key, JSON.stringify(value).replace(/"/g, ""));
      } else url.searchParams.delete(key);
    }
    history.pushState({}, "", url.toString());
  }
  public set(key: Param, value?: string | boolean) {
    if (typeof window === "undefined") return;

    const url = new URL(location.href);

    if (value) {
      url.searchParams.set(key, JSON.stringify(value).replace(/"/g, ""));
    } else url.searchParams.delete(key);

    history.pushState({}, "", url.toString());
  }
}
export const urlParams = new UrlParams();
