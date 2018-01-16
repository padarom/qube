export default function (value, length = 2, symbol = '0') {
  return String(value).padStart(length, symbol)
}
