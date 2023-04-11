export {};

declare global {
  interface String {
    toSentenceCase(): string;
  }
}

Object.assign(String.prototype, {
  toSentenceCase() {
    const value = this as string;
    return value.charAt(0).toUpperCase() + value.slice(1);
  },
});
