import React, { useCallback, useState } from 'react';
import shallow from 'zustand/shallow';

import { ExportModal } from './Modal/ExportModal';
import { ImportModal } from './Modal/ImportModal';
import { useStore } from '../store';

import { Button, Modal, Space } from 'antd';

import styles from './Header.module.css';

export const Header = () => {
  const [clearAllModalVisible, setClearAllModalVisible] =
    useState<boolean>(false);
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);

  const [scenarios, clearScenarios] = useStore(
    (store) => [store.scenarios, store.clearScenarios],
    shallow
  );

  const handleCloseImportModal = useCallback(
    () => setImportModalVisible(false),
    []
  );

  const handleCloseExportModal = useCallback(
    () => setExportModalVisible(false),
    []
  );

  return (
    <div className={styles.header}>
      <Space>
        <Button
          type="primary"
          disabled={scenarios.length === 0}
          onClick={() => setClearAllModalVisible(true)}
        >
          Clear all
        </Button>
        <Button type="primary" onClick={() => setImportModalVisible(true)}>
          Import
        </Button>
        <Button type="primary" onClick={() => setExportModalVisible(true)}>
          Export
        </Button>
      </Space>
      <ImportModal
        visible={importModalVisible}
        onClose={handleCloseImportModal}
      />
      <ExportModal
        visible={exportModalVisible}
        onClose={handleCloseExportModal}
      />
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
