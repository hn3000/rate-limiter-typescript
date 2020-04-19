# A (purposefully) Simple Rate Limiter Implementation

For security applications, e.g. when exposing an API, a rate limiter can help mitigate flooding.

In order to use the least amount of instructions for this rate-limiting activity, a simple rate limiter implementation using the token bucket algorithm is provided.

Having 100% branch coverage by unit tests should help ensure that the code can be used for actually making an API safer to expose. (It can not make your API safer, but if we avoid not limiting the rate of actual calls performed, we might at least not make it worse.)

While the guava rate limiter has some cool ideas about behavior after lull periods, the default rate limiting algorithm seems to be SmoothBursty -- the behavior of which, as far as I can tell, is more easily implemented using the token bucket algorithm. (That "as far as I can tell" is also a motivation for this library -- the code is supposed to be so simple, that there is no question as to what it does.)

Also, I wanted to make the implementation simpler by separating concerns: the guava rate limiter mixes synchronization, waiting and the actual rate limiting algorithm in two classes (and some helpers), this project has

- a rate limiter interface
- an implementation using the token bucket algorithm (others should be possible)

Additional goals

- support for async waiting for tokens without starvation
