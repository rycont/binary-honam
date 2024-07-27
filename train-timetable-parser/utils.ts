export function parseVerticalTableTextWithHeaders<
    Header extends readonly (string | null)[],
>(rawText: string, headers: Header) {
    const cells = rawText.split("\n").map((line) =>
        line.split("\t").map((cell) => cell.trim())
    );

    const table = Array(cells[0].length).fill(null).map((_, i) => {
        const data = Object.fromEntries(
            headers.map((header, j) => header ? [header, cells[j][i]] : null)
                .filter<[string, string]>(
                    (x): x is [string, string] => x !== null,
                ),
        );

        return data;
    });

    return table as unknown as {
        [K in keyof Header as Header[K] extends string ? Header[K] : never]:
            string;
    }[];
}

export function parseTableTextWithHeaders<
    Header extends readonly (string | null)[],
>(rawText: string, header: Header) {
    const cells = rawText.split("\n").map((line) =>
        line.split("\t").map((cell) => cell.trim())
    );

    const table = cells.map((row) =>
        Object.fromEntries(
            header.map((header, i) => header ? [header, row[i]] : null).filter<
                [string, string]
            >((x): x is [string, string] => x !== null),
        )
    );

    return table as unknown as {
        [K in keyof Header as Header[K] extends string ? Header[K] : never]:
            string;
    }[];
}
