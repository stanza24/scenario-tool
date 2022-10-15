import { ReactNode } from 'react';
import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

import { HolderOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

import styles from './ScenarioMenuItem.module.css';

interface Props {
  name: string | ReactNode;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const ScenarioMenuItem = ({ name, dragHandleProps }: Props) => (
  <div className={styles.item}>
    <HolderOutlined
      {...(dragHandleProps || {})}
      className={styles.dragButton}
    />
    {typeof name === 'string' ? (
      <Typography.Text strong className={styles.name}>
        {name}
      </Typography.Text>
    ) : (
      name
    )}
  </div>
);
