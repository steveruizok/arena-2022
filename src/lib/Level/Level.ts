import { Block } from '~lib/Block'
import { uniqueId } from '~utils'
import { StoneWall } from './terrain/StoneWall'
import { DirtTile } from './terrain/DirtTile'
import { StoneTile } from './terrain/StoneTile'
import { GrassTile } from './terrain/GrassTile'
import { WaterTile } from './terrain/WaterTile'

type LegendChar = 's' | 'S' | 'd' | 'g' | 'w'

export class Level {
  blocks: Record<string, Block>

  constructor(map: string[][]) {
    const blocks = map.flatMap((layer, z) =>
      layer.flatMap((row, y) =>
        row
          .split('')
          .map((char, x) => {
            if (char === '.') return
            const Block = Level.Legend[char as LegendChar]
            const block = new Block({
              id: uniqueId(),
              point: [x, y, z === 0 ? 0.5 : z],
            })
            return block
          })
          .filter(Boolean)
      )
    ) as Block[]

    this.blocks = Object.fromEntries(blocks.map((block) => [block.id, block]))

    // [
    //   ...Array.from(Array(10).keys()).flatMap((x) =>
    //     Array.from(Array(10).keys()).map((y) => {
    //       const block = new Stone({
    //         point: [x, y, -0.25],
    //         size: [1, 1, 0.25],
    //       })
    //       return [block.props.id, block]
    //     })
    //   ),
    //   ...Array.from(Array(10).keys()).flatMap(
    //     (x) =>
    //       Array.from(Array(10).keys())
    //         .map((y) => {
    //           if (Math.random() < 0.5) return
    //           const block = new Stone({
    //             point: [x, y, -0],
    //             size: [1, 1, 1],
    //           })
    //           return [block.props.id, block]
    //         })
    //         .filter(Boolean) as Block[][]
    //   ),
    // ]),
  }

  static Legend: Record<LegendChar, typeof Block> = {
    S: StoneWall,
    s: StoneTile,
    d: DirtTile,
    g: GrassTile,
    w: WaterTile,
  }

  static DefaultMap: string[][] = [
    [
      'gggwgggggg',
      'gggwgggggg',
      'ssssssssss',
      'ggdwgggggg',
      'gggwddgggg',
      'ggwwdggggg',
      'gwdwgggggg',
      'wwdwdggggg',
      'ggdgwdgggg',
      'gggdwwddgg',
    ],
    [
      '..........',
      '..........',
      '..........',
      '....S.....',
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
      '..........',
    ],
  ]
}
