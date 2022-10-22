import React, { useCallback, useState } from 'react';
import shallow from 'zustand/shallow';

import { ExportModal } from './Modal/ExportModal';
import { ImportModal } from './Modal/ImportModal';
import { useRefreshTimer } from 'hooks';
import { useStore } from '../store';

import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Modal, Space } from 'antd';

import styles from './Header.module.css';

type TRefreshType = 'hand' | '5_sec' | '15_sec' | '30_sec';

export const Header = () => {
  const [refreshType, setRefreshType] = useState<TRefreshType>('hand');
  const [refreshing, setRefreshing] = useState<boolean>(false);
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

  const handleUpdateRates = useCallback(() => {
    // TODO Прикрутить обновление рейтов
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const handleGetDelay = useCallback(() => {
    switch (refreshType) {
      case '5_sec':
        return 5000;
      case '15_sec':
        return 15000;
      case '30_sec':
        return 300000;
      case 'hand':
      default:
        return null;
    }
  }, [refreshType]);

  useRefreshTimer(handleUpdateRates, handleGetDelay);

  const getRefreshButtonText = () => (
    <span>
      {refreshing ? (
        <LoadingOutlined className={styles.refreshIcon} />
      ) : (
        <SyncOutlined className={styles.refreshIcon} />
      )}
      {(() => {
        switch (refreshType) {
          case '5_sec':
            return '5 seconds';
          case '15_sec':
            return '15 seconds';
          case '30_sec':
            return '30 seconds';
          case 'hand':
          default:
            return 'Refresh';
        }
      })()}
    </span>
  );

  return (
    <div className={styles.header}>
      <Space>
        <Button
          type="primary"
          disabled={Object.keys(scenarios).length === 0}
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
      <Dropdown.Button
        trigger={['click']}
        overlay={
          <Menu
            activeKey={refreshType}
            onClick={({ key }) => setRefreshType(key as TRefreshType)}
            items={[
              {
                label: 'By hand',
                key: 'hand',
              },
              {
                label: 'Every 5 seconds',
                key: '5_sec',
              },
              {
                label: 'Every 15 seconds',
                key: '15_sec',
              },
              {
                label: 'Every 30 seconds',
                key: '30_sec',
              },
            ]}
          />
        }
        placement="bottomLeft"
        onClick={handleUpdateRates}
      >
        {getRefreshButtonText()}
      </Dropdown.Button>
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
        Are you sure you want to clear <b>everything</b>?
      </Modal>
    </div>
  );
};
