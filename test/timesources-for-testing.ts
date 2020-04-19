import { ITimeSource } from "../src/api";

export class TimeSourceZero implements ITimeSource {
  currentTimeMillis() {
    return 0;
  }
}

export class TimeSourceAdjustable implements ITimeSource {
  constructor(time: number = 0) {
    this._time = time;
  }
  currentTimeMillis() {
    return this._time;
  }

  addTime(time: number) {
    this._time += time;
  }

  setTime(time: number) {
    this._time = time;
  }

  private _time: number;
}
