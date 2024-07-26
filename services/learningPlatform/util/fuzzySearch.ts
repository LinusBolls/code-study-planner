import FuzzySearch from "fuzzy-search";

export const useFuzzySearch = <T extends Record<string, any>>(
  items: T[],
  fields: string[],
  searchQuery?: string | null,
) => {
  const search = new FuzzySearch(items, fields, {
    sort: true,
  });
  if (!searchQuery) return items;

  return search.search(searchQuery.trim());
};
