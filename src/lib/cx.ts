export function cx(...args: Array<string | false | undefined | null>) {
  return args.filter(Boolean).join(' ');
}
