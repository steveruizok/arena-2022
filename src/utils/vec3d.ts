export class Vec3d {
  static dist(a: number[], b: number[]) {
    return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2))
  }

  static lrp(a: number[], b: number[], t: number) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
  }

  static add(a: number[], b: number[]) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
  }
}
