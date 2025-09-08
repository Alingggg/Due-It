function toSnakeCase(obj: Record<string, any>): Record<string, any> {
  if (!obj || typeof obj !== "object") return obj;

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(
      /[A-Z]/g,
      (letter) => `_${letter.toLowerCase()}`
    );
    result[snakeKey] = value;
  }

  return result;
}

function toCamelCase<T = Record<string, any>>(obj: Record<string, any>): T {
  if (!obj || typeof obj !== "object") return obj as T;

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
    result[camelKey] = value;
  }

  return result as T;
}

export { toSnakeCase, toCamelCase };
