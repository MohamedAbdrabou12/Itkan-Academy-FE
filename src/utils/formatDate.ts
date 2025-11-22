export const formatDate = (value: unknown) => {
  return new Date(value as string).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const toISOStringWithoutTime = (date: Date) =>
  date.toISOString().split("T")[0];
