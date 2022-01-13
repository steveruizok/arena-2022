import { Block } from '~lib/Block'
import { uniqueId } from '~utils'
import { StoneWall } from './terrain/StoneWall'
import { DirtTile } from './terrain/DirtTile'
import { StoneTile } from './terrain/StoneTile'
import { GrassTile } from './terrain/GrassTile'
import { WaterTile } from './terrain/WaterTile'
import { computed, observable } from 'mobx'
import { App } from '~lib'
import { Vec3d } from '~utils/vec3d'

type LegendChar = 's' | 'S' | 'd' | 'g' | 'w'

export class Level {
  constructor(app: App, map: string[][]) {
    this.app = app
    const blocks = new Map<string, Block>()
    map.forEach((layer, z) =>
      layer.map((row, y) =>
        row
          .split('')
          .map((char, x) => {
            if (char === '.') return
            const Block = Level.Legend[char as LegendChar]
            const block = new Block(this.app, {
              id: uniqueId(),
              point: [x, y, z],
            })
            blocks.set(block.id, block)
            return block
          })
          .filter(Boolean)
      )
    )
    this.blocks = blocks
  }

  app: App

  // @observable blocks: Block[][][]

  @observable blocks: Map<string, Block>

  @computed get blocksArray(): Block[] {
    return Array.from(this.blocks.values())
      .sort((a, b) => a.isoBounds.maxZ - b.isoBounds.minZ)
      .sort((a, b) => a.isoBounds.minY - b.isoBounds.minY)
      .sort((a, b) => a.isoBounds.minX - b.isoBounds.minX)
  }

  getBlockById(id: string): Block {
    const block = this.blocks.get(id)
    if (!block) throw Error(`Could not find a block with id: ${id}`)
    return block
  }

  getBlockByPosition(point: number[]): Block {
    const block = this.blocksArray.find((block) => Vec3d.isEqual(block.props.point, point))
    if (!block) throw Error(`Could not find a block with point: ${point.join(',')}`)
    return block
  }

  getBlockByIsoPoint(point: number[]): Block | undefined {
    return this.blocksArray
      .filter((block) => block.hitTestIsoPoint(point))
      .sort((a, b) => b.isoBounds.maxX - a.isoBounds.minX)
      .sort((a, b) => b.isoBounds.maxY - a.isoBounds.minY)
      .sort((a, b) => b.isoBounds.maxZ - a.isoBounds.minZ)[0]
  }

  getBlockByPoint(point: number[]): Block | undefined {
    return this.blocksArray
      .filter((block) => block.hitTestPoint(point))
      .sort((a, b) => b.props.point[0] - a.props.point[0])
      .sort((a, b) => b.props.point[1] - a.props.point[1])
      .sort((a, b) => b.props.point[2] - a.props.point[2])[0]
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
