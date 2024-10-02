export const joinClasses = (...args: Array<string | boolean | null | undefined>) => args.filter(Boolean).join(' ');
