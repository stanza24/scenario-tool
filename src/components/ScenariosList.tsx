import React, { useMemo } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { Scenario } from './Scenario';
import { RootStore, useStore } from 'store';
import { EDroppableId, EDroppableType, IScenario } from 'types';

import scenarioStyles from './Scenario.module.css';
import styles from './ScenariosList.module.css';
import classNames from 'classnames';

// TODO
const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : 'transparent',
});

export const ScenariosList = () => {
  const [scenarios, displayedScenariosIds, collapsedScenariosIds] = useStore(
    (store: RootStore) => [
      store.scenarios,
      store.displayedScenariosIds,
      store.collapsedScenariosIds,
    ],
    shallow
  );

  const sortedDisplayedScenarios = useMemo(
    () =>
      Object.values(scenarios)
        .filter((sc) => displayedScenariosIds.includes(sc.id))
        .sort((sc1, sc2) => sc1.order - sc2.order),
    [scenarios, displayedScenariosIds]
  );

  return (
    <Droppable
      droppableId={EDroppableId.SCENARIO_TABLE}
      type={EDroppableType.SCENARIO}
    >
      {(droppableProvided, droppableSnapshot) => (
        <div
          ref={droppableProvided.innerRef}
          className={styles.scenariosList}
          style={getListStyle(droppableSnapshot.isDraggingOver)}
        >
          {sortedDisplayedScenarios.map(
            (scenario: IScenario, index: number) => (
              <Draggable
                key={scenario.id}
                draggableId={scenario.id}
                index={index}
              >
                {(draggableProvided, draggableSnapshot) => (
                  <div
                    ref={draggableProvided.innerRef}
                    {...draggableProvided.draggableProps}
                    style={draggableProvided.draggableProps.style}
                    className={classNames(
                      scenarioStyles.scenarioDraggableContainer,
                      {
                        [scenarioStyles.scenarioDraggingContainer]:
                          draggableSnapshot.isDragging,
                      }
                    )}
                  >
                    <Scenario
                      collapsed={collapsedScenariosIds.some(
                        (id) => scenario.id === id
                      )}
                      scenario={scenario}
                      dragHandleProps={draggableProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            )
          )}
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
