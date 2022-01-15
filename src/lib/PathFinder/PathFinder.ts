import { App } from '~lib'
import EasyStar from 'easystarjs'

export class PathFinder {
  app: App
  easy = new EasyStar.js()

  constructor(app: App) {
    this.app = app
  }
}
