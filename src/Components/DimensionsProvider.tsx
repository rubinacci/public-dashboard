import React, { CSSProperties, FunctionComponent, ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react"

const debounce = (fn: any, ms: number) => {
    let timer: any
    return (_: any) => {
        clearTimeout(timer)
        timer = setTimeout(_ => {
            timer = null
            fn()
        }, ms)
    };
  }

const DimensionsProvider: FunctionComponent<{
    className?: string
    style?: CSSProperties
    render: ({ width, height }: { width: number, height: number }) => ReactElement
}> = ({ className, style, render }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [refresh, forceRefresh] = useState(false)
    const [dimensions, setDimensions] = useState<{ width: number, height: number } | null>(null)
    useLayoutEffect(() => {
        const { width, height } = ref.current?.getBoundingClientRect() || {}
        if (!(width && height)) return;
        setDimensions({ width, height })
    }, [refresh])
    useEffect(() => {
        const debouncedHandleResize = debounce(() => {
            forceRefresh(!refresh)
        }, 200)
        window.addEventListener('resize', debouncedHandleResize)
        return () => {
          window.removeEventListener('resize', debouncedHandleResize)
        } 
    })

    return (
        <div ref={ref} className={className} style={style}>
            { dimensions ? render(dimensions as any) : null }
        </div>
    )
}

export default DimensionsProvider