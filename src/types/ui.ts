export type ValidationErrors<T extends object> = Partial<Record<keyof T, string[]>>;
