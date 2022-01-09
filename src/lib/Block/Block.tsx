import { action, computed, makeObservable, observable } from 'mobx'
import { Bounds, Bounds3d, Verts } from '../../types'
import { isoToScreen, screenToIso } from '../../utils/iso'
import { Vec3d } from '../../utils/vec3d'

export interface BlockProps {
  id: string
  type: string
  color: string
  point: number[]
  size: number[]
  facing: string
}

export class Block {
  @observable props: BlockProps

  static defaultProps: BlockProps = {
    id: 'block',
    type: 'block',
    point: [0, 0, 0],
    size: [1, 1, 1],
    facing: 'north',
    color: '#26aff3',
  }

  constructor(options = {} as Partial<BlockProps>) {
    // @ts-ignore
    const { defaultProps } = this.constructor
    this.props = { ...defaultProps, ...options }
    this.animatingToPoint = [...this.props.point]
    makeObservable(this)
  }

  Component: () => JSX.Element = () => <g />

  // Iso

  @computed get isoBounds(): Bounds3d {
    const [px, py, pz] = this.props.point
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

  // Screen

  @computed get bounds(): Bounds {
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
      (acc, [key, value]) => Object.assign(acc, { [key]: isoToScreen(value) }),
      {} as Verts
    )
  }

  @action update(change: Partial<BlockProps>) {
    Object.assign(this.props, change)
    this.animatingToPoint = [...this.props.point]
  }

  animationFrame: any = 0
  animatingToPoint = [0, 0, 0]

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

  get id() {
    return this.props.id
  }
}
