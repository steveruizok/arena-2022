import tinycolor from 'tinycolor2'

export type ColorName =
  | 'black'
  | 'purple'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'brightGreen'
  | 'green'
  | 'darkGreen'
  | 'darkBlue'
  | 'blue'
  | 'lightBlue'
  | 'aqua'
  | 'white'
  | 'lightGray'
  | 'gray'
  | 'darkGray'

const baseColors: Record<ColorName, string> = {
  black: '#1a1c2c',
  purple: '#5d275d',
  red: '#b13e53',
  orange: '#ef7d57',
  yellow: '#ffcd75',
  brightGreen: '#a7f070',
  green: '#38b764',
  darkGreen: '#257179',
  darkBlue: '#29366f',
  blue: '#3b5dc9',
  lightBlue: '#41a6f6',
  aqua: '#73eff7',
  white: '#f4f4f4',
  lightGray: '#94b0c2',
  gray: '#566c86',
  darkGray: '#333c57',
}

export const COLORS = Object.fromEntries(
  Object.entries(baseColors).flatMap(([name, color]) => {
    const col = tinycolor(color)
    return [
      [`${name}90`, col.clone().brighten(24).toHslString()],
      [`${name}80`, col.clone().brighten(18).toHslString()],
      [`${name}70`, col.clone().brighten(12).toHslString()],
      [`${name}60`, col.clone().brighten(6).toHslString()],
      [`${name}50`, col.clone().toHslString()],
      [`${name}40`, col.clone().darken(6).toHslString()],
      [`${name}30`, col.clone().darken(12).toHslString()],
      [`${name}20`, col.clone().darken(18).toHslString()],
      [`${name}10`, col.clone().brighten(24).toHslString()],
    ]
  })
) as Record<
  | `${ColorName}10`
  | `${ColorName}20`
  | `${ColorName}30`
  | `${ColorName}40`
  | `${ColorName}50`
  | `${ColorName}60`
  | `${ColorName}70`
  | `${ColorName}80`
  | `${ColorName}90`,
  string
>
