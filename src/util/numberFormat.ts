export const genFormattedNumber = (number:any, dp?:number) => {
  const options = dp || dp === 0 ? {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  } : undefined

  return Intl.NumberFormat('en-GB', options).format(number)
}
