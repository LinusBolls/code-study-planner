export default async function consumePaginatedQuery<T>(
  func: (pagination: { limit: number; offset: number }) => Promise<T>,
  total: number,
  amountPerQuery: number,
) {
  let results: T[] = [];

  const numQueries = Math.ceil(total / amountPerQuery);

  for (let i = 0; i < numQueries; i++) {
    const pagination = { limit: amountPerQuery, offset: i * amountPerQuery };

    const maxRetries = 3;

    let retries = 0;

    while (retries < maxRetries) {
      try {
        results.push(await func(pagination));

        break;
      } catch (err) {
        retries++;
      }
    }
  }
  return results;
}
