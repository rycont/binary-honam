export default function mergeMaps<K, V>(maps: Map<K, V>[]) {
    return new Map<K, V>(maps.flatMap((map) => [...map.entries()]))
}
