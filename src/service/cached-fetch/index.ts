const cache = new Map<string, Response>()

export function cachedFetch(
    input: RequestInfo,
    init?: RequestInit
): Promise<Response> {
    const key = JSON.stringify({ input, init })

    if (cache.has(key)) {
        console.log('Cache hit')
        return Promise.resolve(cache.get(key)!.clone())
    }

    return fetch(input, init).then((response) => {
        console.log('Cache miss')
        cache.set(key, response.clone())
        return response
    })
}

setInterval(() => {
    cache.clear()
    console.log('Cache cleared')
}, 1000 * 60 * 3)
