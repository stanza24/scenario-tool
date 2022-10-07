import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Draggable,
  DraggableStateSnapshot,
  DraggingStyle,
  Droppable,
  NotDraggingStyle,
} from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { Scenario } from './Scenario';
import {
  scenarioTableEventEmitter,
  ScenarioTableEvents,
} from './ScenariosList';
import { ScenarioListItem } from './ScenarioListItem';
import { RootStore, useStore } from 'store';
import { EDroppableId, EDroppableType, IScenario } from 'types';

import { Collapse } from 'antd';

import styles from '../App.module.css';

const getDraggableStyle = (
  snapshot: DraggableStateSnapshot,
  nativeStyle?: DraggingStyle | NotDraggingStyle
) => {
  const styles = {
    ...(nativeStyle || {}),
    transitionDuration: `0.001s`,
  };
  if (!snapshot.isDragging) styles.transform = 'none';
  return styles;
};

export const Menu = () => {
  const [activeMenu, setActiveMenu] = useState<string[]>([]);
  const [draggingOverTable, setDraggingOverTable] = useState<string | null>(
    null
  );

  const [scenarios, displayedScenariosIds] = useStore(
    (store: RootStore) => [store.scenarios, store.displayedScenariosIds],
    shallow
  );
  const sortedScenarios = useMemo(
    () => Object.values(scenarios).sort((sc1, sc2) => sc1.order - sc2.order),
    [scenarios]
  );

  const onChange = (keys: string | string[]) => {
    setActiveMenu(Array.isArray(keys) ? keys : [keys]);
  };

  const handleShowDraggingOverTable = useCallback(
    (id: string) => setDraggingOverTable(id),
    []
  );

  const handleClearDraggingOverTable = useCallback(
    () => setDraggingOverTable(null),
    []
  );

  useEffect(() => {
    scenarioTableEventEmitter.on(
      ScenarioTableEvents.MENU_ITEM_DRAGGING_OVER,
      handleShowDraggingOverTable
    );

    scenarioTableEventEmitter.on(
      ScenarioTableEvents.MENU_ITEM_DRAGGING_CLEAR,
      handleClearDraggingOverTable
    );

    return () => {
      scenarioTableEventEmitter.off(
        ScenarioTableEvents.MENU_ITEM_DRAGGING_OVER,
        handleShowDraggingOverTable
      );

      scenarioTableEventEmitter.off(
        ScenarioTableEvents.MENU_ITEM_DRAGGING_CLEAR,
        handleClearDraggingOverTable
      );
    };
  }, [handleShowDraggingOverTable, handleClearDraggingOverTable]);

  return (
    <Collapse
      activeKey={activeMenu}
      onChange={onChange}
      className={styles.collapse}
    >
      <Collapse.Panel header="Scenarios" key="scenarios">
        <Droppable
          isDropDisabled
          droppableId={EDroppableId.SCENARIO_LIST}
          type={EDroppableType.SCENARIO}
        >
          {(droppableProvided) => (
            <div
              ref={droppableProvided.innerRef}
              className={styles.scenariosList}
            >
              {sortedScenarios.map((scenario: IScenario, index: number) => (
                <Draggable
                  key={scenario.id}
                  draggableId={EDroppableId.SCENARIO_LIST + '.' + scenario.id}
                  index={index}
                >
                  {(draggableProvided, draggableSnapshot) => (
                    <>
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        style={getDraggableStyle(
                          draggableSnapshot,
                          draggableProvided.draggableProps.style
                        )}
                      >
                        {draggingOverTable === scenario.id ? (
                          <Scenario
                            collapsed
                            scenario={scenario}
                            dragHandleProps={draggableProvided.dragHandleProps}
                          />
                        ) : (
                          <ScenarioListItem
                            name={scenario.name}
                            dragHandleProps={draggableProvided.dragHandleProps}
                          />
                        )}
                      </div>
                      {draggableSnapshot.isDragging && (
                        <ScenarioListItem name={scenario.name} />
                      )}
                    </>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </Collapse.Panel>
      <Collapse.Panel header="Operations" key="operations">
        <p>123</p>
      </Collapse.Panel>
    </Collapse>
  );
};
