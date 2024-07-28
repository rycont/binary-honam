import { Temporal } from '@js-temporal/polyfill'
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
    expiresAt: number
): Promise<SerialResponse> {
    const body = await response.text()
    const header: Record<string, string> = {}

    response.headers.forEach((value, key) => {
        header[key] = value
    })

    return { body, header, expiresAt }
}

export const onRequest: MiddlewareHandler = async (req, next) => {
    const cache = createCacheStore(req.locals.runtime.env.binaryHonamISR)
    const cacheKey = new URL(req.url).pathname

    const cachedResponse = await cache.get(cacheKey)

    if (cachedResponse) {
        const expiresAt = cachedResponse.expiresAt
        const isExpired = expiresAt && expiresAt < Date.now()

        if (!isExpired) {
            return new Response(cachedResponse.body, {
                headers: cachedResponse.header,
            })
        }

        await cache.remove(cacheKey)
    }

    const response = await next()

    if (response.status === 200) {
        const cloned = response.clone()
        const nextUpdateTimestamp = getNextUpdatePlan().epochMilliseconds

        const serialResponse = await serializeResponse(
            cloned,
            nextUpdateTimestamp
        )
        await cache.set(cacheKey, serialResponse)
    }

    return response
}

function getNextUpdatePlan() {
    let nextUpdatePlan = Temporal.Now.instant().toZonedDateTimeISO('Asia/Seoul')

    const currentHour = nextUpdatePlan.hour

    if (currentHour < 5) {
        return nextUpdatePlan.with({
            hour: 5,
            minute: 0,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
        })
    }

    if (currentHour < 17) {
        return nextUpdatePlan.with({
            hour: 17,
            minute: 0,
            second: 0,
            millisecond: 0,
            microsecond: 0,
            nanosecond: 0,
        })
    }

    nextUpdatePlan = nextUpdatePlan.add({ days: 1 }).with({
        hour: 5,
        minute: 0,
        second: 0,
        millisecond: 0,
        microsecond: 0,
        nanosecond: 0,
    })

    return nextUpdatePlan
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
