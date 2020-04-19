
import { expect } from 'chai';
import { rateLimiterTokenBucket, RateLimiterTokenBucket, WAIT_IMPOSSIBLE } from '../src';
import { TimeSourceAdjustable, TimeSourceZero } from './timesources-for-testing';
 
const timeSourceZero = new TimeSourceZero();

describe("RateLimiter", function() {
  it('creates an instance', function() {
    const limiter = rateLimiterTokenBucket(1, 1);
    expect(limiter).to.be.not.null;
    expect(limiter).to.be.not.undefined;
  });
  it('uses defaults in constructor', function() {
    const limiter = new RateLimiterTokenBucket(1, 1);
    expect(limiter).to.be.not.null;
    expect(limiter).to.be.not.undefined;
    expect(limiter.consumeAmount(1)).to.be.false;
    expect(limiter.waitTimeForAmount(1)).to.be.lte(1000);
  });
  it('waits until amount available', function() {
    const limiter = rateLimiterTokenBucket(1, 1, 0, timeSourceZero);
    expect(limiter.waitTimeForAmount(1)).to.be.equals(1000);
  });
  it('never makes an impossible amount available', function() {
    const limiter = rateLimiterTokenBucket(1, 1);
    expect(limiter.waitTimeForAmount(2)).to.be.equals(WAIT_IMPOSSIBLE);    
  });
  it('recognizes an impossible wait time', function() {
    const limiter = rateLimiterTokenBucket(1e-9, 1e10, 0, timeSourceZero);
    expect(limiter.waitTimeForAmount(1e9)).to.be.equals(WAIT_IMPOSSIBLE);    
  });
  it('returns an infeasible wait time if asked to', function() {
    const limiter = rateLimiterTokenBucket(1, 1e10, 0, timeSourceZero);
    expect(limiter.waitTimeForAmount(1e9)).to.be.equals(1e12);    
  });
  it('makes the initial amount available immediately', function() {
    const limiter = rateLimiterTokenBucket(1, 2, 1, timeSourceZero);
    expect(limiter.waitTimeForAmount(1)).to.be.equals(0);
    expect(limiter.waitTimeForAmount(2)).to.be.equals(1000);    
  });
  it('makes additional amount available after some time', function() {
    const timeSource = new TimeSourceAdjustable();
    const limiter = rateLimiterTokenBucket(1, 2, 1, timeSource);
    expect(limiter.waitTimeForAmount(1)).to.be.equals(0);
    expect(limiter.waitTimeForAmount(2)).to.be.equals(1000);

    timeSource.addTime(999);
    expect(limiter.waitTimeForAmount(1)).to.be.equals(0);
    expect(limiter.waitTimeForAmount(2)).to.be.equals(1);

    timeSource.addTime(1);
    expect(limiter.waitTimeForAmount(1)).to.be.equals(0);
    expect(limiter.waitTimeForAmount(2)).to.be.equals(0);
  });
  it('consumes the correct amount', function() {
    const limiter = rateLimiterTokenBucket(1, 1, 1, timeSourceZero);
    expect(limiter.consumeAmount(1)).to.be.true;
    expect(limiter.consumeAmount(1)).to.be.false;
    expect(limiter.waitTimeForAmount(1)).to.be.equals(1000);
  });
  it('consumes the default amount without arg', function() {
    const limiter = rateLimiterTokenBucket(1, 2, 2, timeSourceZero);
    expect(limiter.consumeAmount()).to.be.true;
    expect(limiter.consumeAmount(1)).to.be.true;
    expect(limiter.waitTimeForAmount(1)).to.be.equals(1000);
    expect(limiter.waitTimeForAmount()).to.be.equals(1000);
  });
  it('returns a realistic wait time with default timesource', function() {
    const limiter = rateLimiterTokenBucket(1, 1, 1);
    expect(limiter.consumeAmount()).to.be.true;
    expect(limiter.waitTimeForAmount(1)).to.be.lte(1000);
    expect(limiter.waitTimeForAmount(1)).to.be.gte(950);
  });
});