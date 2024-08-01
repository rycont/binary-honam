function doWithValue<ValueType, OutputType>(
    action: (value: ValueType) => OutputType
) {
    return (args: readonly [string, ValueType]) => action(args[1])
}

function mapWithValue<KeyType, ValueType, OutputType>(
    action: (value: ValueType) => OutputType
) {
    return (args: readonly [KeyType, ValueType]) =>
        [args[0], action(args[1])] as const
}

export default {
    filter: doWithValue,
    map: mapWithValue,
}
