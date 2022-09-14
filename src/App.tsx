import React from 'react';

import { ScenariosList } from './components/ScenariosList';

import styles from './App.module.css';

export const App = () => {
  return (
    <div className={styles.container}>
      <ScenariosList />
    </div>
  );
};
