export const requestCounter = {}

export const rateLimiter = (req, res, next) => {
    
    const ip = req?.ip;
    const now = Date.now();

    if (!requestCounter[ip]) {
        requestCounter[ip] = {count: 1, lastRequest: now};
    } else {
        const timeSinceLastRequest = now -requestCounter[ip].lastRequest;
        const timeLimit = 15 * 60 *1000  // 15 minutes

        if (timeSinceLastRequest < timeLimit) {
            requestCounter[ip].count += 1;
        } else {
            requestCounter[ip] = {count: 1, lastRequest: now}  // Reset after time window
        }
    }

    const maxRequests = 100; // max requests per window
    if (requestCounter[ip].count > maxRequests) {
        return res.status(429).json({message: 'Too many requests, please try again later.'})
    }

    requestCounter[ip].lastRequest = now
    next();
}