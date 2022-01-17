import { State } from '~state-tree-engine/State'
import { EventHandlers } from '~types'

export class Selecting extends State {
  id = 'selecting'

  onPointerDown: EventHandlers['pointer'] = (info) => {
    const { hoveredTileId } = this.game.gameState
    // if (hoveredTileId?.canSelect) {
    //   // transaction(() => {
    //   //   this.app.setSelectedBlocks([hoveredBlock])
    //   //   this.app.transition('selectedCharacters')
    //   // })
    // } else {
    //   // this.app.setSelectedBlocks([])
    // }
  }
}
