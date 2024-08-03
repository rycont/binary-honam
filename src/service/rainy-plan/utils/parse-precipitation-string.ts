export default function parsePrecipitationString(precipitation: string) {
    if (precipitation === '강수없음') {
        return 0
    }

    return parseInt(precipitation.split(' ')[0].replace('mm', ''), 10)
}
