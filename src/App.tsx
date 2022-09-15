import { Button, Modal } from 'antd';
import React, { useState } from 'react';

import { ScenariosList } from 'components/ScenariosList';
import { useStore } from 'store';

import styles from './App.module.css';

export const App = () => {
  const [clearAllModalVisible, setClearAllModalVisible] =
    useState<boolean>(false);

  const clearScenarios = useStore((store) => store.clearScenarios);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button type="primary" onClick={() => setClearAllModalVisible(true)}>
          Clear All
        </Button>
      </div>
      <ScenariosList />
      <Modal
        open={clearAllModalVisible}
        onCancel={() => setClearAllModalVisible(false)}
        footer={[
          <Button
            key="cancel"
            type="default"
            onClick={() => setClearAllModalVisible(false)}
          >
            Cancel
          </Button>,
          <Button
            key="delete"
            type="primary"
            onClick={() => {
              setClearAllModalVisible(false);
              clearScenarios();
            }}
          >
            Clear
          </Button>,
        ]}
      >
        Are you sure you want to clear <b>ALL scenarios</b>?
      </Modal>
    </div>
  );
};
