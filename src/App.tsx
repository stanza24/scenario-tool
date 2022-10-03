import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { Header } from './components/Header';
import { ScenariosList } from 'components/ScenariosList';
import { RootStore, useStore } from 'store';
import { EDroppableId } from './types';

import { Button, message } from 'antd';

import styles from './App.module.css';

export const App = () => {
  const [
    scenarios,
    createScenario,
    moveScenario,
    moveOperation,
    copyOperation,
  ] = useStore(
    (store: RootStore) => [
      store.scenarios,
      store.createScenario,
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
      case type === EDroppableId.SCENARIO_LIST: {
        if (
          destDroppableId === EDroppableId.SCENARIO_LIST &&
          dragOrder !== dropOrder
        )
          moveScenario(dragOrder, dropOrder);

        return;
      }

      case type === EDroppableId.OPERATION_LIST &&
        sourceDroppableId === destDroppableId: {
        if (dragOrder !== dropOrder)
          moveOperation(sourceDroppableId, dragOrder, dropOrder);

        return;
      }

      case type === EDroppableId.OPERATION_LIST &&
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
        <ScenariosList />
        <Button
          type="primary"
          onClick={createScenario}
          className={styles.addScenario}
        >
          Add scenario
        </Button>
      </div>
    </DragDropContext>
  );
};
