import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { Header } from 'components/Header';
import { Menu } from './components/Menu';
import { ScenariosList } from 'components/ScenariosList';
import { RootStore, useStore } from 'store';
import { EDroppableId, EDroppableType } from './types';
import { getDraggableItemIdParts } from 'utils';

import { message } from 'antd';

import styles from './App.module.css';

export const App = () => {
  const [
    scenarios,
    displayedScenariosIds,
    toggleDisplayScenario,
    moveScenario,
    moveOperation,
    copyOperation,
  ] = useStore(
    (store: RootStore) => [
      store.scenarios,
      store.displayedScenariosIds,
      store.toggleDisplayScenario,
      store.moveScenario,
      store.moveOperation,
      store.copyOperation,
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
        } else {
          const currentOrder = scenarios[id].order;

          if (dropOrder === currentOrder || dropOrder - 1 === currentOrder)
            return;

          if (dropOrder < currentOrder) {
            moveScenario(currentOrder, dropOrder);
          } else {
            moveScenario(currentOrder, dropOrder - 1);
          }
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
          moveOperation(sourceDroppableId, dragOrder, dropOrder);

        return;
      }

      case type === EDroppableType.OPERATION &&
        sourceDroppableId !== destDroppableId: {
        const opId = draggableId.split(';').pop() as string;

        if (scenarios[destDroppableId]?.operations.includes(opId)) {
          message.error('This operation is already in the scenario');
        } else {
          copyOperation(destDroppableId, opId, dropOrder);
        }

        return;
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <Header />
        <div className={styles.main}>
          <Menu />
          <ScenariosList />
        </div>
      </div>
    </DragDropContext>
  );
};
