/**
 * Utilitários de serialização.
 * Aqui centralizei as regras de toJSON pra uniformizar.
 */

/**
 * Remove chaves que não devem ser expostas externamente.
 * @param obj Objeto a ser sanitizado
 * @param keys keys a serem omitidas
 */
export function omit<T extends Record<string, any>>(obj: T, keys: string[]): Partial<T> {
  const copy: Partial<T> = {};
  for (const k of Object.keys(obj)) {
    if (!keys.includes(k)) {
      // @ts-ignore
      copy[k] = obj[k];
    }
  }
  return copy;
}
