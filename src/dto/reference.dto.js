export const referenceId = (reference) => {
  if (reference == null) return null;
  if (typeof reference !== "object") return reference;
  if (reference._id != null) return String(reference._id);
  if (typeof reference.toHexString === "function") {
    return reference.toHexString();
  }
  if (reference.id != null) return String(reference.id);
  return null;
};
