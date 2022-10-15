import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { Header } from 'components/Header';
import { Menu } from './components/Menu';
import { ScenariosList } from 'components/ScenariosList';
import { RootStore, useStore } from 'store';
import { EDroppableId, EDroppableType } from './types';
import { getDraggableItemIdParts } from 'utils';

import { Button, message, Modal } from 'antd';

import styles from './App.module.css';

export const App = () => {
  const [createNodeModalVisible, setCreateNodeModalVisible] =
    useState<boolean>(false);
  const [createNodeCb, setCreateNodeCb] = useState<(() => void) | null>(null);

  const [
    scenarios,
    displayedScenariosIds,
    toggleDisplayScenario,
    moveScenario,
    reorderNode,
    applyOperationAsNode,
  ] = useStore(
    (store: RootStore) => [
      store.scenarios,
      store.displayedScenariosIds,
      store.toggleDisplayScenario,
      store.moveScenario,
      store.reorderNode,
      store.applyOperationAsNode,
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
          message.error('This operation is already in the scenario');
        } else {
          setCreateNodeModalVisible(true);
          setCreateNodeCb(
            () => () => applyOperationAsNode(destDroppableId, opId, dropOrder)
          );
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
        <Modal
          open={createNodeModalVisible}
          onCancel={() => {
            setCreateNodeModalVisible(false);
            setCreateNodeCb(null);
          }}
          footer={[
            <Button
              key="cancel"
              type="default"
              onClick={() => {
                setCreateNodeModalVisible(false);
                setCreateNodeCb(null);
              }}
            >
              Cancel
            </Button>,
            <Button
              key="create"
              type="primary"
              onClick={() => {
                createNodeCb && createNodeCb();
                setCreateNodeModalVisible(false);
                setCreateNodeCb(null);
              }}
            >
              Create
            </Button>,
          ]}
        >
          Do you want to create an instance of operation in this scenario?
        </Modal>
      </div>
    </DragDropContext>
  );
};
