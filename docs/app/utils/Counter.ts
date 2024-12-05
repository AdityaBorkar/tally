export default class Counter {
  value: NonNullable<any> = {};
  strict = true;

  constructor(initValues: NonNullable<any>, options?: { strict: boolean }) {
    this.value = initValues;
    this.strict = options?.strict || true;
  }

  add(obj: any) {
    if (typeof obj !== typeof this.value) return new Error("Mismatch in type");
    if (!this.strict) return; // TODO - Write function for non-strict operations

    this.value = this.#ProcessObject(obj, this.value);
  }

  #ProcessObject(OBJECT: { [key: string]: any }, OldSummary: any) {
    let summary = OldSummary;
    for (const key in OBJECT) {
      const VALUE = OBJECT[key];
      switch (typeof VALUE) {
        case "undefined":
          break;
        case "number":
          if (Number.isNaN(VALUE)) break;
          if (summary[key] === undefined) summary[key] = 0;
          summary[key] += VALUE;
          break;
        case "string":
          // TODO - Functionality shall be added when case identified
          break;
        case "boolean":
          // TODO - Functionality shall be added when case identified
          break;
        case "function":
          // TODO - Functionality shall be added when case identified
          break;
        case "object":
          if (VALUE === null) break;
          switch (VALUE.constructor) {
            case Date:
              // TODO - Functionality shall be added when case identified
              break;
            case Array:
              // TODO - Functionality shall be added when case identified
              // if (summary[key] === undefined) summary[key] = [];
              // summary[key] = VALUE.map(pair => {})
              break;
            case Object:
              if (summary[key] === undefined) summary[key] = {};
              summary[key] = this.#ProcessObject(VALUE, summary[key]);
              break;
            default:
              // TODO - Support Custom Objects / Classes in future
              break;
          }
          break;
      }
    }
    return summary;
  }
}
