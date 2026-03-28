const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function formatDate(isoString: string): string {
  return formatter.format(new Date(isoString));
}
