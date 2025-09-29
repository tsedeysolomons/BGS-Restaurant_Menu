export function formatPrice(price: number): string {
  return `${price.toFixed(2)} ETB`
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `BGS${timestamp.slice(-6)}${random}`
}
