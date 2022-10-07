import { useEffect } from 'react';
import { DroppableStateSnapshot } from 'react-beautiful-dnd';

import {
  scenarioTableEventEmitter,
  ScenarioTableEvents,
} from './ScenariosList';
import { usePrev } from 'hooks';
import { EDroppableId } from 'types';
import { getDraggableItemIdParts } from 'utils';

interface Props {
  snapshot: DroppableStateSnapshot;
}

export const ScenarioTableDroppableController = ({ snapshot }: Props) => {
  const isDraggingOver = snapshot.isDraggingOver;
  const prevDraggingOver = usePrev(isDraggingOver);

  useEffect(() => {
    if (!prevDraggingOver && isDraggingOver) {
      if (!snapshot.draggingOverWith) return;

      const { droppableId, draggableId } = getDraggableItemIdParts(
        snapshot.draggingOverWith
      );

      if (droppableId === EDroppableId.SCENARIO_LIST) {
        scenarioTableEventEmitter.emit(
          ScenarioTableEvents.MENU_ITEM_DRAGGING_OVER,
          draggableId
        );
      }
    } else if (prevDraggingOver && !isDraggingOver) {
      scenarioTableEventEmitter.emit(
        ScenarioTableEvents.MENU_ITEM_DRAGGING_CLEAR
      );
    }
  }, [isDraggingOver, prevDraggingOver]);

  return <div style={{ display: 'none' }} />;
};
