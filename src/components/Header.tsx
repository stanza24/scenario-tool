import React, { useCallback, useState } from 'react';
import shallow from 'zustand/shallow';

import { ExportModal } from './Modal/ExportModal';
import { ImportModal } from './Modal/ImportModal';
import { translate } from 'translation/i18next';
import { useStore } from 'store';

import { Button, Modal, Select, Space } from 'antd';

import styles from './Header.module.css';

export const Header = () => {
  const [clearAllModalVisible, setClearAllModalVisible] =
    useState<boolean>(false);
  const [importModalVisible, setImportModalVisible] = useState<boolean>(false);
  const [exportModalVisible, setExportModalVisible] = useState<boolean>(false);

  const [language, setLanguage, scenarios, clearScenarios] = useStore(
    (store) => [
      store.language,
      store.setLanguage,
      store.scenarios,
      store.clearScenarios,
    ],
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
          disabled={Object.keys(scenarios).length === 0}
          onClick={() => setClearAllModalVisible(true)}
        >
          {translate('Components.Header.clearAll')}
        </Button>
        <Button type="primary" onClick={() => setImportModalVisible(true)}>
          {translate('Components.Header.import')}
        </Button>
        <Button type="primary" onClick={() => setExportModalVisible(true)}>
          {translate('Components.Header.export')}
        </Button>
      </Space>
      <Select
        value={language}
        bordered={false}
        placement="bottomRight"
        onSelect={setLanguage}
      >
        <Select.Option value="ru">Русский</Select.Option>
        <Select.Option value="en">English</Select.Option>
      </Select>
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
            {translate('Actions.Cancel')}
          </Button>,
          <Button
            key="delete"
            type="primary"
            onClick={() => {
              setClearAllModalVisible(false);
              clearScenarios();
            }}
          >
            {translate('Modals.ClearAll.clear')}
          </Button>,
        ]}
      >
        {translate('Modals.ClearAll.content')}
      </Modal>
    </div>
  );
};
