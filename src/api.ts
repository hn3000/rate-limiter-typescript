
export const WAIT_IMPOSSIBLE: number = Number.MAX_SAFE_INTEGER;

export interface IRateLimiter {
  consumeAmount(amount?: number /* = 1.0 */);
  waitTimeForAmount(amount?: number /* = 1.0 */);

}

export interface ITimeSource {
  currentTimeMillis(): number;
}
