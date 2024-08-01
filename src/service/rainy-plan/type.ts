import type { Temporal } from '@js-temporal/polyfill'

export interface WeatherReport {
    baseDate: string
    baseTime: string
    category: string
    fcstDate: string
    fcstTime: string
    fcstValue: string
    nx: number
    ny: number
}

export interface Position {
    x: number
    y: number
}

export interface RainPlan {
    precipitation: number
    probability: number
}

export interface RainPlanWithTime extends RainPlan {
    startsAt: Temporal.PlainDateTime
}
