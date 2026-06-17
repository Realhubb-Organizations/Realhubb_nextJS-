export const hasLiked = (id: string) =>
  typeof window !== "undefined" && localStorage.getItem(`liked_${id}`) === "1";

export const markLiked = (id: string) => {
  if (typeof window !== "undefined") localStorage.setItem(`liked_${id}`, "1");
};
