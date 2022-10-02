import React from 'react';

import { Header } from './components/Header';
import { ScenariosList } from 'components/ScenariosList';
import { useStore } from 'store';

import { Button } from 'antd';

import styles from './App.module.css';

export const App = () => {
  const createScenario = useStore((store) => store.createScenario);

  return (
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
  );
};
