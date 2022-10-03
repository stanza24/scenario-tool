import { Droppable, Draggable } from 'react-beautiful-dnd';

import { Scenario } from './Scenario';
import { RootStore, useStore } from 'store';
import { EDroppableId, IScenario } from 'types';

import scenarioStyles from './Scenario.module.css';
import styles from './ScenariosList.module.css';
import classNames from 'classnames';

export const ScenariosList = () => {
  const scenarios = useStore((store: RootStore) => store.scenarios);

  return (
    <Droppable
      droppableId={EDroppableId.SCENARIO_LIST}
      type={EDroppableId.SCENARIO_LIST}
    >
      {(droppableProvided) => (
        <div ref={droppableProvided.innerRef} className={styles.scenariosList}>
          {Object.values(scenarios)
            .sort((sc1, sc2) => sc1.order - sc2.order)
            .map((scenario: IScenario, index: number) => (
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
                      scenario={scenario}
                      dragHandleProps={draggableProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
