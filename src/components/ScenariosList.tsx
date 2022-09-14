import shallow from 'zustand/shallow';

import { Scenario } from './Scenario';
import { useStore } from '../store';
import { IScenario } from '../types';

import { Button } from 'antd';

import styles from './ScenariosList.module.css';

export const ScenariosList = () => {
  const [scenarios, addScenario] = useStore(
    (store) => [store.scenarios, store.addScenario],
    shallow
  );

  return (
    <div className={styles.scenariosList}>
      {scenarios.map((scenario: IScenario) => (
        <Scenario key={scenario.id} scenario={scenario} />
      ))}
      <div>
        <Button
          type="primary"
          onClick={addScenario}
          className={styles.addScenario}
        >
          Add scenario
        </Button>
      </div>
    </div>
  );
};
