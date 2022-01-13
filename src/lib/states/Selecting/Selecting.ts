import { State } from '~lib/statechart/State'
import { EventHandlers } from '~types'

export class Selecting extends State {
  static id = 'selecting'

  onPointerDown: EventHandlers['pointer'] = (info) => {
    const { hoveredBlock } = this.app
    if (hoveredBlock) {
      // hoveredBlock.update({type: })
      hoveredBlock.move([0, 0, 1])
    }
  }
}
