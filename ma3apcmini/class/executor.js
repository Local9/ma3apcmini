export default class Executor {
  colorEmpty = 0;
  colorOff = 0;
  colorOn = 0;
  fx = 8;
  constructor(colorEmpty, colorOff, colorOn, fx) {
    this.colorEmpty = colorEmpty;
    this.colorOff = colorOff;
    this.colorOn = colorOn;
    this.fx = fx;
  }
}
