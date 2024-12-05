//* Utils:

export function CleanDashes(text: string) {
  return text.replaceAll("-", "");
}

export function CleanSplit(text: string, separator: string) {
  return text.split(separator).filter((str) => str.trim() !== "");
}

export function CleanBrackets(text: string) {
  return text.replaceAll("[", "").replaceAll("]", "");
}
