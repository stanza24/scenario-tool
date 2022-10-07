import { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';

import { HolderOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

import styles from './ScenarioListItem.module.css';

interface Props {
  name?: string;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

export const ScenarioListItem = ({
  name = 'Operation',
  dragHandleProps,
}: Props) => (
  <div className={styles.item}>
    <HolderOutlined
      {...(dragHandleProps || {})}
      className={styles.dragButton}
    />
    <Typography.Text strong className={styles.name}>
      {name}
    </Typography.Text>
  </div>
);
