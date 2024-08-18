class SpanSum {
  constructor(windowSize = 10, weight = 0.1) {
    this.windowSize = windowSize;
    this.windowFrom = [];
    this.windowTo = [];
  }

  compare(newValue) {
    if (this.windowFrom.length < this.windowSize) {
      this.windowFrom.push(newValue);
      return 0;
    }
    if (this.windowTo.length < this.windowSize) {
      this.windowTo.push(newValue);
      if (this.windowTo.length === this.windowSize) {
        const ret =
          this.windowTo.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0) -
          this.windowFrom.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
        this.windowFrom = this.windowTo;
        this.windowTo = [];
        return ret / this.windowSize;
      }
      return 0;
    }
  }
}

export {SpanSum};
