import React, { useCallback, useState } from 'react';

import { DragDropController } from 'components/DragDropController';
import { Header } from 'components/Header';
import { Main } from 'components/Main';
import { translate, useLanguage } from 'translation/i18next';
import { useStore } from './store';

import { Button, Modal } from 'antd';

import styles from './App.module.css';

export const App = () => {
  const [createNodeModalVisible, setCreateNodeModalVisible] =
    useState<boolean>(false);
  const [createNodeCb, setCreateNodeCb] = useState<(() => void) | null>(null);

  const applyOperationAsNode = useStore((store) => store.applyOperationAsNode);

  useLanguage();

  const handleTryCreateOpInstance = useCallback(
    (scenarioId: string, opId: string, dropOrder: number) => {
      setCreateNodeModalVisible(true);
      setCreateNodeCb(
        () => () => applyOperationAsNode(scenarioId, opId, dropOrder)
      );
    },
    [applyOperationAsNode]
  );

  return (
    <DragDropController onCreateOpInstance={handleTryCreateOpInstance}>
      <div className={styles.container}>
        <Header />
        <Main />
        <Modal
          open={createNodeModalVisible}
          onCancel={() => {
            setCreateNodeModalVisible(false);
            setCreateNodeCb(null);
          }}
          footer={[
            <Button
              key="cancel"
              type="default"
              onClick={() => {
                setCreateNodeModalVisible(false);
                setCreateNodeCb(null);
              }}
            >
              {translate('Actions.Cancel')}
            </Button>,
            <Button
              key="create"
              type="primary"
              onClick={() => {
                createNodeCb && createNodeCb();
                setCreateNodeModalVisible(false);
                setCreateNodeCb(null);
              }}
            >
              {translate('Modals.CreateNode.submit')}
            </Button>,
          ]}
        >
          {translate('Modals.CreateNode.content')}
        </Modal>
      </div>
    </DragDropController>
  );
};
