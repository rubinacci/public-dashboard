export const info = (...args:any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args)
  }
}

export const error = (error:any, arg1:any, arg2?:any) => {
  if (process.env.NODE_ENV === 'development') {
    if (arg1 && arg2) {
      console.error(arg1, arg2)
    } else {
      console.error(arg1)
    }
    console.log(error)
  }
}

export default {
  info,
  error,
}
