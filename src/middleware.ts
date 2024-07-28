import type { MiddlewareHandler } from 'astro'

interface SerialResponse {
    body: string
    header: Record<string, string>
    expiresAt: number
}

const createCacheStore = (kv?: KV) => {
    if (!kv) {
        kv = MockKV.create()
    }

    return {
        async get(key: string): Promise<SerialResponse | null> {
            const conetnt = await kv.get(key)
            if (conetnt === null) return null

            const { body, header, expiresAt } = JSON.parse(conetnt)
            return { body, header, expiresAt }
        },
        async set(key: string, value: SerialResponse): Promise<void> {
            await kv.put(key, JSON.stringify(value))
        },
        async remove(key: string): Promise<void> {
            await kv.delete(key)
        },
    }
}

async function serializeResponse(
    response: Response,
    expiresAfter: number
): Promise<SerialResponse> {
    const body = await response.text()
    const header: Record<string, string> = {}

    response.headers.forEach((value, key) => {
        header[key] = value
    })

    const expiresAt = Date.now() + expiresAfter

    return { body, header, expiresAt }
}

export const onRequest: MiddlewareHandler = async (req, next) => {
    const cache = createCacheStore(req.locals.runtime.env.binaryHonamISR)
    const cacheKey = new URL(req.url).pathname

    const cachedResponse = await cache.get(cacheKey)

    if (cachedResponse) {
        const expiresAt = cachedResponse.expiresAt

        if (expiresAt && expiresAt < Date.now()) {
            await cache.remove(cacheKey)
        }

        return new Response(cachedResponse.body, {
            headers: cachedResponse.header,
        })
    }

    const response = await next()

    if (response.status === 200) {
        const cloned = response.clone()
        const serialResponse = await serializeResponse(cloned, 1000 * 5)
        await cache.set(cacheKey, serialResponse)
    }

    return response
}

interface KV {
    get(key: string): Promise<string | null>
    put(key: string, value: string): Promise<void>
    delete(key: string): Promise<void>
}

class MockKV implements KV {
    private store: Record<string, string> = {}
    private static instance: KV | null = null

    constructor() {
        console.log('Using mocked KV Storage')
    }

    async get(key: string): Promise<string | null> {
        return this.store[key] || null
    }

    async put(key: string, value: string): Promise<void> {
        this.store[key] = value
    }

    async delete(key: string): Promise<void> {
        delete this.store[key]
    }

    static create() {
        return MockKV.instance || (MockKV.instance = new MockKV())
    }
}
