import { INDICATOR_PATH } from '~utils/iso'

interface IndicatorProps {
  point: number[]
}

export function PathIndicator({ point }: IndicatorProps) {
  return (
    <g transform={`translate(${point})`} fill="none" strokeLinejoin="round">
      <path d={INDICATOR_PATH} stroke="black" strokeWidth={3} />
      <path d={INDICATOR_PATH} stroke="orange" strokeWidth={1.5} />
    </g>
  )
}
