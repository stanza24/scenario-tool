import React, { useCallback, useState } from 'react';

import { Menu } from './Menu';
import { ScenariosList } from './ScenariosList';
import { useRefreshTimer } from 'hooks';
import { translate } from 'translation/i18next';
import { useStore } from 'store';

import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu as AntMenu, Space } from 'antd';

import styles from './Main.module.css';

type TRefreshType = 'hand' | '5_sec' | '15_sec' | '30_sec';

export const Main = () => {
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [refreshType, setRefreshType] = useState<TRefreshType>('hand');

  const createScenario = useStore((store) => store.createScenario);

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
            return translate('Components.Main.refreshButtonSec', {
              seconds: 5,
            });
          case '15_sec':
            return translate('Components.Main.refreshButtonSec', {
              seconds: 15,
            });
          case '30_sec':
            return translate('Components.Main.refreshButtonSec', {
              seconds: 30,
            });
          case 'hand':
          default:
            return translate('Components.Main.refreshButtonDefault');
        }
      })()}
    </span>
  );

  return (
    <div className={styles.main}>
      <Menu />
      <div className={styles.container}>
        <Space className={styles.buttons}>
          <Dropdown.Button
            className={styles.refreshButtonsGroup}
            trigger={['click']}
            overlay={
              <AntMenu
                activeKey={refreshType}
                onClick={({ key }) => setRefreshType(key as TRefreshType)}
                items={[
                  {
                    label: translate('Components.Main.refreshOptionDefault'),
                    key: 'hand',
                  },
                  {
                    label: translate('Components.Main.refreshOptionSec', {
                      seconds: 5,
                    }),
                    key: '5_sec',
                  },
                  {
                    label: translate('Components.Main.refreshOptionSec', {
                      seconds: 15,
                    }),
                    key: '15_sec',
                  },
                  {
                    label: translate('Components.Main.refreshOptionSec', {
                      seconds: 30,
                    }),
                    key: '30_sec',
                  },
                ]}
              />
            }
            placement="bottomLeft"
            overlayClassName={styles.refreshDropdown}
            onClick={handleUpdateRates}
          >
            {getRefreshButtonText()}
          </Dropdown.Button>
          <Button type="primary" onClick={createScenario}>
            {translate('Components.Main.createNew')}
          </Button>
        </Space>
        <ScenariosList />
      </div>
    </div>
  );
};
