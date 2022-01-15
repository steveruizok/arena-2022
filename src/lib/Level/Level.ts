import { Block } from '~lib/Block'
import { uniqueId } from '~utils'
import { StoneWall } from './terrain/StoneWall'
import { DirtTile } from './terrain/DirtTile'
import { StoneTile } from './terrain/StoneTile'
import { GrassTile } from './terrain/GrassTile'
import { WaterTile } from './terrain/WaterTile'
import { action, observable, transaction } from 'mobx'
import { App } from '~lib'
import { Vec3d } from '~utils/vec3d'
import { Hero } from './characters/Hero'
import EasyStar from 'easystarjs'

type LegendChar = 's' | 'S' | 'd' | 'g' | 'w' | '@'

export class Level {
  easy = new EasyStar.js()

  constructor(app: App, map: string[][]) {
    this.app = app
    this.map = map
    this.blocks = this.map.map((layer, z) =>
      layer.map((row, y) =>
        row.split('').map((char, x) => {
          if (char === '.') return
          const Block = Level.Legend[char as LegendChar]
          const block = new Block(this.app, {
            id: uniqueId(),
            position: [x, y, z],
          })
          return block
        })
      )
    )
  }

  app: App
  map: string[][]

  @observable blocks: (Block | undefined)[][][]

  getBlockById(id: string): Block | undefined {
    return this.getBlockBy((block) => block.id === id)
  }

  getBlockByPosition(point: number[]): Block | undefined {
    return this.blocks[point[2]]?.[point[1]]?.[point[0]]
  }

  getBlockByIsoPoint(point: number[]): Block | undefined {
    return this.getBlockBy((block) => block.hitTestIsoPoint(point))
  }

  getBlockBy = (fn: (block: Block) => boolean) => {
    for (let z = 1; z > -1; z--) {
      for (let y = 9; y > -1; y--) {
        for (let x = 9; x > -1; x--) {
          const block = this.blocks[z][y][x]
          if (block && fn(block)) return block
        }
      }
    }
  }

  moveBlockTo = (block: Block, position: number[], offset = block.props.offset) => {
    transaction(() => {
      const [x1, y1, z1] = block.props.position
      this.blocks[z1][y1][x1] = undefined
      const [x2, y2, z2] = position
      this.blocks[z2][y2][x2] = block
      block.update({ position, offset })
    })
  }

  animationFrame: any

  cancel?: () => void

  moveBlockAlongPath = async (block: Block, path: number[][]) => {
    let position = block.props.position
    let initialOffset = block.defaultProps.offset
    let offset = [0, 0, 0]
    let steps = [...path]
    let cancelled = false
    this.cancel = () => (cancelled = true)
    while (steps.length > 0) {
      if (cancelled) {
        break
      } else {
        const nextPosition = steps.shift()
        if (!nextPosition) throw Error
        let stepped = false
        await new Promise<void>(async (resolve) => {
          const distance = Vec3d.dist(position, nextPosition)
          const duration = distance * 20 * 8
          // set offset to delta from old position
          offset = Vec3d.add(Vec3d.sub(position, nextPosition), initialOffset)
          position = nextPosition
          // move to new position
          this.moveBlockTo(block, position, offset)
          // animate offset to zero
          let timeStart = performance.now()
          const loop = () => {
            let t = (performance.now() - timeStart) / duration
            if (t > 0.5 && !stepped) {
              stepped = true
              this.app.updatePointer()
            }
            if (t > 1) t = 1
            block.update({ offset: Vec3d.lrp(offset, initialOffset, t) })
            if (t >= 1) {
              this.app.updatePointer()
              setTimeout(() => resolve(), 50)
              return
            }
            this.animationFrame = requestAnimationFrame(loop)
          }
          this.animationFrame = requestAnimationFrame(loop)
        })
      }
    }
    return true
  }

  currentPath: any

  getPathBetween = async (from: number[], to: number[], z = 0): Promise<null | number[][]> => {
    const { easy } = this
    this.easy.setAcceptableTiles([1])
    this.easy.setGrid(
      this.blocks[0].map((row, y) =>
        row.map((block, x) => (block?.canWalk && !this.blocks[1][y][x] ? 1 : 0))
      )
    )
    easy.cancelPath(this.currentPath)
    easy.enableDiagonals()
    easy.disableCornerCutting()
    return new Promise((resolve) => {
      this.currentPath = easy.findPath(from[0], from[1], to[0], to[1], (path) => {
        resolve(path ? path.map(({ x, y }) => [x, y, 1]) : null)
      })
      easy.calculate()
    })
  }

  static Legend: Record<LegendChar, typeof Block> = {
    S: StoneWall,
    s: StoneTile,
    d: DirtTile,
    g: GrassTile,
    w: WaterTile,
    '@': Hero,
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
      '@.........',
      '..........',
      '..........',
      '..........',
      '.......S..',
      '.....S.S..',
      '.......S..',
      '........@.',
      '..........',
      '..........',
    ],
  ]
}
