document.querySelectorAll('input[type=checkbox]').forEach((checkbox) => {
    if (!(checkbox instanceof HTMLInputElement)) return

    applyFilter(checkbox)
    checkbox.addEventListener('change', (event) => {
        applyFilter(checkbox)
    })
})

function applyFilter(checkbox: HTMLInputElement) {
    const body = document.body

    const enabled = checkbox.checked
    const value = checkbox.name || 'true'
    const filterType = checkbox.getAttribute('data-filter-type')

    const attrName = `data-${filterType}-${value}`

    if (enabled) {
        body.setAttribute(attrName, '')
    } else {
        body.removeAttribute(attrName)
    }
}
