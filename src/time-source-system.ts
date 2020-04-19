import { ITimeSource } from "./api";

export class TimeSourceSystem implements ITimeSource {
  currentTimeMillis() {
    return Date.now();
  }
}