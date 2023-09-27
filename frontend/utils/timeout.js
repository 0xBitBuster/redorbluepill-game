export async function awaitTimeout(ms) {
    return new Promise((res, rej) => {
        setTimeout(res, ms)
    })
}