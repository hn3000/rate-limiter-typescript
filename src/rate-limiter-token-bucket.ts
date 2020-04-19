import { IRateLimiter, ITimeSource, WAIT_IMPOSSIBLE } from "./api";
import { TimeSourceSystem } from "./time-source-system";

const MS_PER_SECOND = 1000;

export class RateLimiterTokenBucket {
  constructor(
    ratePerSecond: number,
    maxAmount: number,
    initAmount: number = 0.0,
    timeSource: ITimeSource | undefined = undefined
  ) {
    this._ratePerMS = ratePerSecond / MS_PER_SECOND;
    this._maxAmount = maxAmount;
    this._currentAmount = Math.min(initAmount, maxAmount);
    this._timeSource = timeSource ?? new TimeSourceSystem();
    this._lastUpdateMS = this._timeSource.currentTimeMillis();
  }

  consumeAmount(amount: number = 1.0) {
    this._updateAmount();
    if (amount <= this._currentAmount) {
      this._currentAmount -= amount;
      return true;
    }

    return false;
  }

  waitTimeForAmount(amount: number = 1.0) {
    if (amount <= this._currentAmount) {
      return 0;
    }
    this._updateAmount();
    if (amount <= this._currentAmount) {
      return 0;
    }
    if (amount > this._maxAmount) {
      return WAIT_IMPOSSIBLE;
    }
    const lack = amount - this._currentAmount;
    const waitTime = Math.ceil(lack / this._ratePerMS);
    if (waitTime >= WAIT_IMPOSSIBLE) {
      return WAIT_IMPOSSIBLE;
    }

    return waitTime;
  }

  _updateAmount() {
    let now = this._timeSource.currentTimeMillis();
    let delta = now - this._lastUpdateMS;
    if (delta > 0) {
      let add = delta * this._ratePerMS;
      let newAmount = Math.min(this._maxAmount, this._currentAmount + add);
  
      this._lastUpdateMS = now;
      this._currentAmount = newAmount;
    }
  }
  private _ratePerMS: number;
  private _maxAmount: number;
  private _currentAmount: number;
  private _lastUpdateMS: number;
  private _timeSource: ITimeSource;

}

export function rateLimiterTokenBucket(
  ratePerSecond: number,
  maxAmount: number,
  initAmount: number = 0.0,
  timeSource: ITimeSource | undefined = undefined
): IRateLimiter {
  return new RateLimiterTokenBucket(ratePerSecond, maxAmount, initAmount, timeSource);
}
