import Vec from '@tldraw/vec'
import { action, computed, makeObservable, observable } from 'mobx'
import { observer } from 'mobx-react-lite'
import { App } from '~lib'
import { pointInBounds, pointInCube, pointInPolygon } from '~utils/geom'
import { Bounds, Bounds3d, Verts } from '../../types'
import { Vec3d } from '../../utils/vec3d'

export interface BlockComponentProps {
  isSelected: boolean
  isHovered: boolean
}

export type BlockComponent = (props: BlockComponentProps) => JSX.Element

export type BlockIndicator = (props: BlockComponentProps) => JSX.Element

export interface AdjacentBlocks {
  north: boolean
  northEast: boolean
  east: boolean
  southEast: boolean
  west: boolean
  southWest: boolean
  south: boolean
  northWest: boolean
  below: boolean
  above: boolean
}

export interface BlockProps {
  id: string
  type: string
  color: string
  position: number[]
  offset: number[]
  size: number[]
  facing: string
}

export class Block {
  constructor(app: App, options = {} as Partial<BlockProps>) {
    this.app = app
    // @ts-ignore
    const { defaultProps } = this.constructor
    this.defaultProps = defaultProps as BlockProps
    this.props = { ...defaultProps, ...options }
    this.animatingToPoint = [...this.props.position]
    makeObservable(this)
  }

  defaultProps: BlockProps

  static defaultProps: BlockProps = {
    id: 'block',
    type: 'block',
    position: [0, 0, 0],
    offset: [0, 0, 0],
    size: [1, 1, 1],
    facing: 'north',
    color: '#26aff3',
  }

  static Component = (component: BlockComponent) => observer(component)

  static Indicator = (indicator: BlockIndicator) => observer(indicator)

  app: App

  @observable props: BlockProps

  canSelect = false

  canHover = false

  canWalk = false

  Component = Block.Component(() => <g />)

  Indicator = Block.Indicator(() => <g />)

  // Iso

  @computed get isoBounds(): Bounds3d {
    const [px, py, pz] = Vec3d.add(this.props.position, this.props.offset)
    const [x, y, z] = this.props.size
    return {
      minX: px,
      midX: px + x / 2,
      maxX: px + x,
      minY: py,
      midY: py + y / 2,
      maxY: py + y,
      minZ: pz,
      midZ: pz + z / 2,
      maxZ: pz + z,
      width: x,
      height: y,
      depth: z,
    }
  }

  @computed get isoVerts(): Verts {
    const {
      isoBounds: { minX, midX, maxX, minY, midY, maxY, minZ, maxZ },
    } = this
    return {
      centerDown: [midX, midY, minZ],
      backDown: [minX, minY, minZ],
      backUp: [minX, minY, maxZ],
      rightDown: [maxX, minY, minZ],
      frontDown: [maxX, maxY, minZ],
      leftDown: [minX, maxY, minZ],
      centerUp: [midX, midY, maxZ],
      rightUp: [maxX, minY, maxZ],
      frontUp: [maxX, maxY, maxZ],
      leftUp: [minX, maxY, maxZ],
    }
  }

  findAdjacent(point: number[]) {
    const block = this.app.level.getBlockByPosition(Vec3d.add(this.props.position, point))
    if (point[2] === 0 && block) return block.isoBounds['maxZ'] === this.isoBounds['maxZ']
    return !!block
  }

  @computed get adjacent(): AdjacentBlocks {
    return {
      north: this.findAdjacent([0, -1, 0]),
      northEast: this.findAdjacent([1, -1, 0]),
      east: this.findAdjacent([1, 0, 0]),
      southEast: this.findAdjacent([1, 1, 0]),
      south: this.findAdjacent([0, 1, 0]),
      southWest: this.findAdjacent([-1, 1, 0]),
      west: this.findAdjacent([-1, 0, 0]),
      northWest: this.findAdjacent([-1, -1, 0]),
      above: this.findAdjacent([0, 0, 1]),
      below: this.findAdjacent([0, 0, -1]),
    }
  }

  // Screen

  @computed get bounds(): Bounds {
    const { isoToScreen } = this.app.viewport
    const {
      isoVerts: { leftDown, rightDown, backUp, frontDown },
    } = this
    const minX = isoToScreen(leftDown)[0]
    const maxX = isoToScreen(rightDown)[0]
    const minY = isoToScreen(backUp)[1]
    const maxY = isoToScreen(frontDown)[1]
    const height = maxY - minY
    const width = maxX - minY
    const midX = width / 2
    const midY = height / 2
    return {
      minX,
      midX,
      maxX,
      minY,
      midY,
      maxY,
      width,
      height,
    }
  }

  @computed get verts(): Verts {
    return Object.entries(this.isoVerts).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: this.app.viewport.isoToScreen(value) }),
      {} as Verts
    )
  }

  @computed get outline() {
    const { verts } = this
    return [
      verts.leftUp,
      verts.backUp,
      verts.rightUp,
      verts.rightDown,
      verts.frontDown,
      verts.leftDown,
    ]
  }

  @action update(change: Partial<BlockProps>) {
    Object.assign(this.props, change)
    this.animatingToPoint = [...this.props.position]
  }

  getPaddedScreenVerts(padding: number) {
    const { verts } = this
    const h = Math.hypot(padding, padding)
    return {
      centerUp: verts.centerUp,
      centerDown: verts.centerDown,
      backUp: Vec.add(verts.backUp, [0, -h]),
      backDown: Vec.add(verts.backDown, [0, h]),
      rightUp: Vec.add(verts.rightUp, [h, -h]),
      rightDown: Vec.add(verts.rightDown, [h, h]),
      leftUp: Vec.add(verts.leftUp, [-h, -h]),
      leftDown: Vec.add(verts.leftDown, [-h, h]),
      frontUp: Vec.add(verts.frontUp, [0, -h]),
      frontDown: Vec.add(verts.frontDown, [0, h]),
    }
  }

  animationFrame: any = 0
  animatingToPoint = [0, 0, 0]
  animatingOffset = [0, 0, 0]

  moveBy = (delta: number[]) => {
    cancelAnimationFrame(this.animationFrame)
    const {
      animatingToPoint,
      props: { position },
    } = this
    const startPoint = [...animatingToPoint]
    const nextPosition = Vec3d.add(this.animatingToPoint, delta)
    this.animatingToPoint = nextPosition
    const distance = Vec3d.dist(startPoint, nextPosition)
    let start = performance.now()
    let duration = distance * 20 * 8
    const loop = () => {
      let t = (performance.now() - start) / duration
      if (t > 1) t = 1
      this.update({ position: Vec3d.lrp(position, nextPosition, t) })
      if (t >= 1) return
      this.animationFrame = requestAnimationFrame(loop)
    }
    loop()
  }

  hitTestPoint(point: number[]) {
    return pointInBounds(point, this.bounds) && pointInPolygon(point, this.outline)
  }

  hitTestIsoPoint(point: number[]) {
    return pointInCube(point, this.props.position, this.props.size)
  }

  get id() {
    return this.props.id
  }
}
