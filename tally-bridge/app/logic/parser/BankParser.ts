//* Model:
export default class BankParserMaker {
  #model: ModelType;

  constructor(props: {
    GstConfig: GstConfigType;
    CleanTxnText: (txt: string) => string;
  }) {
    this.#model = {
      gst: props.GstConfig,
      guide: [],
      CleanTxnText: props.CleanTxnText,
    };
  }

  generate = () => {
    // ? The following things don't make sense because we follow multi-modal detection.
    // // Precedence = EQUALS > STARTSWITH > INCLUDES
    // const ModelGuide = this.#model.guide.sort((guide1, guide2) => {
    //   if (guide1.highPriority) return -1;
    //   const G1M = guide1.match;
    //   const G2M = guide2.match;
    //   const RESULT = (() => {
    //     if (G2M.equals !== undefined)
    //       return G2M.equals.localeCompare(G1M.equals || "");
    //     else if (G2M.startsWith !== undefined) {
    //       return G2M.startsWith.localeCompare(G1M.startsWith || "");
    //     } else if (G2M.includes !== undefined)
    //       return G2M.includes.localeCompare(G1M.includes || "");
    //     else if (G2M.test !== undefined) return 1;
    //     return 1;
    //   })();
    //   return RESULT === 0 ? 1 : RESULT;
    // });
    // return { gst: this.#model.gst, guide: ModelGuide };
    return this.#model;
  };

  train(UID: string, guide: GuideType) {
    this.#model.guide.push({ UID, ...guide });
  }
}
