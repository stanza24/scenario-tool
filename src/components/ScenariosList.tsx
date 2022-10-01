import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import shallow from 'zustand/shallow';

import { Scenario } from './Scenario';
import { useStore } from 'store';
import { EDroppableId, IScenario } from 'types';

import scenarioStyles from './Scenario.module.css';
import styles from './ScenariosList.module.css';
import classNames from 'classnames';

export const ScenariosList = () => {
  const [scenarios, moveScenario] = useStore(
    (store) => [store.scenarios, store.moveScenario],
    shallow
  );

  const handleDragEnd = ({
    source: { index: dragOrder },
    destination,
  }: DropResult) => {
    if (!destination) return;

    const { droppableId, index: dropOrder } = destination;

    if (droppableId === EDroppableId.SCENARIO_LIST && dragOrder !== dropOrder)
      moveScenario(dragOrder, dropOrder);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={EDroppableId.SCENARIO_LIST}>
        {(droppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            className={styles.scenariosList}
          >
            {scenarios.map((scenario: IScenario, index: number) => (
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
    </DragDropContext>
  );
};
