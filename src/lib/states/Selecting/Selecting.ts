import { transaction } from 'mobx'
import { State } from '~lib/statechart/State'
import { EventHandlers } from '~types'

export class Selecting extends State {
  static id = 'selecting'

  onPointerDown: EventHandlers['pointer'] = (info) => {
    const { hoveredBlock } = this.app
    if (hoveredBlock?.canSelect) {
      transaction(() => {
        this.app.setSelectedBlocks([hoveredBlock])
        this.app.transition('selectedCharacters')
      })
    } else {
      this.app.setSelectedBlocks([])
    }
  }
}
