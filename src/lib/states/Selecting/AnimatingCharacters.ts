import { State } from '~lib/statechart/State'
import { EventHandlers } from '~types'

export class SelectedCharacters extends State {
  static id = 'selectedCharacters'

  onExit = () => {
    this.app.setPaths([])
  }

  onPointerMove: EventHandlers['pointer'] = async (info) => {
    const { hoveredBlock, selectedBlocks } = this.app
    if (hoveredBlock) {
      const paths: number[][][] = []
      for (const block of selectedBlocks) {
        const result = await this.app.level.getPathBetween(
          block.props.position,
          hoveredBlock.props.position
        )
        if (result) paths.push(result)
      }
      this.app.setPaths(paths)
    } else if (this.app.state.paths) {
      this.app.setPaths([])
    }
  }

  onPointerDown: EventHandlers['pointer'] = (info) => {
    const { hoveredBlock } = this.app
    if (!hoveredBlock) {
      this.app.setSelectedBlocks([])
      this.app.transition('selecting')
      return
    }
    if (hoveredBlock?.canSelect) {
      this.app.setSelectedBlocks([hoveredBlock])
      return
    }
    // move block
    let position = this.app.inputs.currentIsoPosition
    position[2] = 1
    this.app.selectedBlocks.forEach((block) => {
      block.update({ position })
    })
  }
}
