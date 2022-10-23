import { ReactNode } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { translate } from 'translation/i18next';
import { RootStore, useStore } from 'store';
import { EDroppableId, EDroppableType } from 'types';
import { getDraggableItemIdParts } from 'utils';

import { message } from 'antd';

interface Props {
  children: ReactNode;
  onCreateOpInstance: (fromId: string, opId: string, dropOrder: number) => void;
}

export const DragDropController = ({ children, onCreateOpInstance }: Props) => {
  const [
    scenarios,
    displayedScenariosIds,
    toggleDisplayScenario,
    moveScenario,
    reorderNode,
  ] = useStore(
    (store: RootStore) => [
      store.scenarios,
      store.displayedScenariosIds,
      store.toggleDisplayScenario,
      store.moveScenario,
      store.reorderNode,
    ],
    shallow
  );

  const handleDragEnd = (dropConfig: DropResult) => {
    if (!dropConfig.destination) return;

    const {
      source: { droppableId: sourceDroppableId, index: dragOrder },
      destination: { droppableId: destDroppableId, index: dropOrder },
      draggableId,
      type,
    } = dropConfig;

    switch (true) {
      case type === EDroppableType.SCENARIO &&
        sourceDroppableId === EDroppableId.SCENARIO_LIST: {
        const { draggableId: id } = getDraggableItemIdParts(draggableId);

        if (!displayedScenariosIds.includes(id)) {
          toggleDisplayScenario(id, dropOrder);
        }

        return;
      }

      case type === EDroppableType.SCENARIO &&
        sourceDroppableId === EDroppableId.SCENARIO_TABLE: {
        if (
          destDroppableId === EDroppableId.SCENARIO_TABLE &&
          dragOrder !== dropOrder
        )
          moveScenario(dragOrder, dropOrder);

        return;
      }

      case type === EDroppableType.OPERATION &&
        sourceDroppableId === destDroppableId: {
        if (dragOrder !== dropOrder)
          reorderNode(sourceDroppableId, dragOrder, dropOrder);

        return;
      }

      case type === EDroppableType.OPERATION &&
        sourceDroppableId !== destDroppableId:
      case type === EDroppableType.OPERATION &&
        sourceDroppableId === EDroppableId.OPERATION_LIST: {
        const { draggableId: opId } = getDraggableItemIdParts(draggableId);

        if (
          scenarios[destDroppableId]?.nodes.find((node) => node.opId === opId)
        ) {
          message.error(translate('Messages.opInScenarioAlready'));
        } else {
          onCreateOpInstance(destDroppableId, opId, dropOrder);
        }

        return;
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>{children}</DragDropContext>
  );
};
