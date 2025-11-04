export const formatDate = (value: unknown) => {
  return new Date(value as string).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
