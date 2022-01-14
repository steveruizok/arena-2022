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
  point: number[]
  offset: number[]
  size: number[]
  facing: string
}

export class Block {
  constructor(app: App, options = {} as Partial<BlockProps>) {
    this.app = app
    // @ts-ignore
    const { defaultProps } = this.constructor
    this.props = { ...defaultProps, ...options }
    this.animatingToPoint = [...this.props.point]
    makeObservable(this)
  }

  static defaultProps: BlockProps = {
    id: 'block',
    type: 'block',
    point: [0, 0, 0],
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

  Component = Block.Component(() => <g />)

  Indicator = Block.Indicator(() => <g />)

  // Iso

  @computed get isoBounds(): Bounds3d {
    const [px, py, pz] = Vec3d.add(this.props.point, this.props.offset)
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

  @computed get adjacent(): AdjacentBlocks {
    const { isoBounds } = this
    const { blocksArray } = this.app.state.level
    return {
      north: !!blocksArray.find(
        (block) =>
          block.isoBounds.minX <= isoBounds.minX &&
          block.isoBounds.maxX >= isoBounds.maxX &&
          block.isoBounds.minZ <= isoBounds.minZ &&
          block.isoBounds.maxZ === isoBounds.maxZ &&
          block.isoBounds.maxY === isoBounds.minY
      ),
      northEast: !!blocksArray.find(
        (block) =>
          block.isoBounds.minZ <= isoBounds.minZ &&
          block.isoBounds.maxZ === isoBounds.maxZ &&
          block.isoBounds.minX === isoBounds.maxX &&
          block.isoBounds.maxY === isoBounds.minY
      ),
      east: !!blocksArray.find(
        (block) =>
          block.isoBounds.minY <= isoBounds.minY &&
          block.isoBounds.maxY >= isoBounds.maxY &&
          block.isoBounds.minZ <= isoBounds.minZ &&
          block.isoBounds.maxZ === isoBounds.maxZ &&
          block.isoBounds.minX === isoBounds.maxX
      ),
      southEast: !!blocksArray.find(
        (block) =>
          block.isoBounds.minZ <= isoBounds.minZ &&
          block.isoBounds.maxZ >= isoBounds.maxZ &&
          block.isoBounds.minY === isoBounds.maxY &&
          block.isoBounds.minX === isoBounds.maxX
      ),
      south: !!blocksArray.find(
        (block) =>
          block.isoBounds.minX <= isoBounds.minX &&
          block.isoBounds.maxX >= isoBounds.maxX &&
          block.isoBounds.minZ <= isoBounds.minZ &&
          block.isoBounds.maxZ === isoBounds.maxZ &&
          block.isoBounds.minY === isoBounds.maxY
      ),
      southWest: !!blocksArray.find(
        (block) =>
          block.isoBounds.minZ <= isoBounds.minZ &&
          block.isoBounds.maxZ >= isoBounds.maxZ &&
          block.isoBounds.maxX === isoBounds.minX &&
          block.isoBounds.minY === isoBounds.maxY
      ),
      west: !!blocksArray.find(
        (block) =>
          block.isoBounds.minY <= isoBounds.minY &&
          block.isoBounds.maxY >= isoBounds.maxY &&
          block.isoBounds.minZ <= isoBounds.minZ &&
          block.isoBounds.maxZ === isoBounds.maxZ &&
          block.isoBounds.maxX === isoBounds.minX
      ),
      northWest: !!blocksArray.find(
        (block) =>
          block.isoBounds.minZ <= isoBounds.minZ &&
          block.isoBounds.maxZ === isoBounds.maxZ &&
          block.isoBounds.maxY === isoBounds.minY &&
          block.isoBounds.maxX === isoBounds.minX
      ),
      below: !!blocksArray.find(
        (block) =>
          block.isoBounds.minX <= isoBounds.minX &&
          block.isoBounds.maxX >= isoBounds.maxX &&
          block.isoBounds.minY <= isoBounds.minY &&
          block.isoBounds.maxY >= isoBounds.maxY &&
          block.isoBounds.maxZ === isoBounds.minZ
      ),
      above: !!blocksArray.find(
        (block) =>
          block.isoBounds.minX <= isoBounds.minX &&
          block.isoBounds.maxX >= isoBounds.maxX &&
          block.isoBounds.minY <= isoBounds.minY &&
          block.isoBounds.maxY >= isoBounds.maxY &&
          block.isoBounds.minZ === isoBounds.maxZ
      ),
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
    this.animatingToPoint = [...this.props.point]
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

  move = (delta: number[]) => {
    cancelAnimationFrame(this.animationFrame)
    const {
      animatingToPoint,
      props: { point: currentPoint },
    } = this
    const startPoint = [...animatingToPoint]
    const nextPoint = Vec3d.add(this.animatingToPoint, delta)
    this.animatingToPoint = nextPoint
    const distance = Vec3d.dist(startPoint, nextPoint)
    let start = performance.now()
    let duration = distance * 20 * 8
    const loop = () => {
      let t = (performance.now() - start) / duration
      if (t > 1) t = 1
      this.update({ point: Vec3d.lrp(currentPoint, nextPoint, t) })
      if (t >= 1) return
      this.animationFrame = requestAnimationFrame(loop)
    }
    loop()
  }

  hitTestPoint(point: number[]) {
    return pointInBounds(point, this.bounds) && pointInPolygon(point, this.outline)
  }

  hitTestIsoPoint(point: number[]) {
    return pointInCube(point, this.props.point, this.props.size)
  }

  get id() {
    return this.props.id
  }
}
