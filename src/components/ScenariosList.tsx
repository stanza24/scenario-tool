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

import { Button } from 'antd';

import styles from './ScenariosList.module.css';

export const ScenariosList = () => {
  const [scenarios, addScenario, moveScenario] = useStore(
    (store) => [store.scenarios, store.addScenario, store.moveScenario],
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
    <div className={styles.container}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId={EDroppableId.SCENARIO_LIST}
          direction="horizontal"
        >
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
                  {(draggableProvided) => (
                    <div
                      ref={draggableProvided.innerRef}
                      {...draggableProvided.draggableProps}
                      style={draggableProvided.draggableProps.style}
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
      <Button
        type="primary"
        onClick={addScenario}
        className={styles.addScenario}
      >
        Add scenario
      </Button>
    </div>
  );
};
