const isCoordinateRegex = /^-?\d+(\.\d+)?, ?-?\d+(\.\d+)?$/
const isAddressRegex = /^[\d]{1,5}([a-zA-Z0-9\s.]){1,50}$/

/**
 * checks whether string matches pattern: two signed decimals separated by a ', '
 * 
 * does not check range; assumes that coordinate will be clamped to bounds
 */
export function isCoordinate(text) {
    return isCoordinateRegex.test(text)
}

export function isAddress(text) {
    return isAddressRegex.test(text)
}

export function parseCoordinates(text) {
    if (!isCoordinate(text)) return null
    let [lat, lng] = text.split(',').map(parseFloat)
    return { lat: lat, lng: lng }
}

export function clamp(coord, bounds) {
    if (!isInBounds(coord, bounds)) {
        let lat = Math.max(Math.min(coord.lat, bounds.se.lat), bounds.nw.lat);
        let lng = Math.max(Math.min(coord.lng, bounds.se.lng), bounds.nw.lng);
        return { lat: lat, lng: lng }
    }
    return coord
}

export function isInBounds(coord, bounds) {
    return L
        .latLngBounds(bounds.nw, bounds.se)
        .contains(coord)
}

export function getCoordinatesFromAddress(address) {
    let url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => response.json())
        .then(data => {
            resolve({ lat: data[0].lat, lng: data[0].lon })
        }); 
    }) 
}
