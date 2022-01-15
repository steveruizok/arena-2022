import { State } from '~lib/statechart/State'
import { EventHandlers } from '~types'

export class SelectedCharacters extends State {
  static id = 'selectedCharacters'

  private async updatePathToHoveredBlock() {
    const { hoveredBlock, selectedBlocks } = this.app
    if (hoveredBlock) {
      const paths: number[][][] = []
      const toPositon = hoveredBlock.props.position
      for (const block of selectedBlocks) {
        const result = await this.app.level.getPathBetween(block.props.position, toPositon)
        if (result) paths.push(result)
      }
      this.app.setPaths(paths)
    } else if (this.app.state.paths) {
      this.app.setPaths([])
    }
  }

  onExit = () => {
    this.app.setPaths([])
  }

  onPointerMove: EventHandlers['pointer'] = async (info) => {
    this.updatePathToHoveredBlock()
  }

  animation?: Promise<boolean>

  onPointerDown: EventHandlers['pointer'] = (info) => {
    const { hoveredBlock, selectedBlocks } = this.app
    // Select the other block
    if (!hoveredBlock) {
      this.app.setSelectedBlocks([])
      this.app.transition('selecting')
      return
    }
    // De-select the block
    if (selectedBlocks.length === 1 && selectedBlocks.includes(hoveredBlock)) {
      this.app.setSelectedBlocks([])
      this.app.transition('selecting')
      return
    }
    // Select the block
    if (hoveredBlock?.canSelect) {
      this.app.setSelectedBlocks([hoveredBlock])
      return
    }
    // Animate block to the new position
    let position = this.app.inputs.currentIsoPosition
    // Temporary: set position to 1 for entities
    position[2] = 1
    this.app.selectedBlocks.forEach(async (block) => {
      const path = await this.app.level.getPathBetween(block.props.position, position)
      if (!path) return
      this.app.level.cancel?.()
      if (this.animation) await this.animation
      this.animation = this.app.level.moveBlockAlongPath(block, path)
    })
  }
}
