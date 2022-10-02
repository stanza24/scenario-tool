import React, { useEffect, useMemo, useState } from 'react';

import { usePrev } from 'hooks';
import { RootStore, useStore } from 'store';

import { Button, message, Modal, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';

interface ExportRowType {
  key: React.Key;
  name: string;
  opsNumber: number;
}

const columns: ColumnsType<ExportRowType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 450,
    ellipsis: true,
  },
  {
    title: 'Operations',
    dataIndex: 'opsNumber',
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ExportModal = ({ visible, onClose }: Props) => {
  const [selectedRows, setSelectedRows] = useState<React.Key[]>([]);

  const prevVisible = usePrev(visible);

  const scenarios = useStore((store: RootStore) => store.scenarios);

  const data: ExportRowType[] = useMemo(
    () =>
      scenarios.map((scenario) => ({
        key: scenario.id,
        name: scenario.name || 'Scenario',
        opsNumber: scenario.operations.length,
      })),
    [scenarios]
  );

  const handleExportAsJSON = () => {
    const exportingScenarios = [];
    for (let row of selectedRows) {
      const scenario = scenarios.find((sc) => sc.id === row);
      if (scenario) exportingScenarios.push(scenario);
    }

    const data =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportingScenarios));
    const a = document.createElement('a');
    a.setAttribute('href', data);
    a.setAttribute('download', 'Scenarios.json');
    a.click();

    onClose();
  };

  const handleImportAsText = () => {
    const exportingScenarios = [];
    for (let row of selectedRows) {
      const scenario = scenarios.find((sc) => sc.id === row);
      if (scenario) exportingScenarios.push(scenario);
    }

    const rawText = JSON.stringify(exportingScenarios);
    window.navigator.clipboard.writeText(rawText);

    message.success('Copied to clipboard');

    onClose();
  };

  useEffect(() => {
    if (prevVisible && !visible) {
      setSelectedRows([]);
    }
  }, [prevVisible, visible]);

  return (
    <Modal
      width={640}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" type="default" onClick={onClose}>
          Cancel
        </Button>,
        <Button
          key="exportJSON"
          type="primary"
          disabled={selectedRows.length === 0}
          onClick={handleExportAsJSON}
        >
          Export as JSON
        </Button>,
        typeof window.navigator.clipboard.writeText !== 'undefined' ? (
          <Button
            key="exportText"
            type="primary"
            disabled={selectedRows.length === 0}
            onClick={handleImportAsText}
          >
            Copy as text
          </Button>
        ) : null,
      ]}
    >
      <Typography.Title level={5}>Select scenarios to export:</Typography.Title>
      <Table
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: selectedRows,
          onChange: (selectedRowKeys: React.Key[]) => {
            setSelectedRows(selectedRowKeys);
          },
          getCheckboxProps: (record: ExportRowType) => ({
            name: record.name,
          }),
        }}
        columns={columns}
        dataSource={data}
      />
    </Modal>
  );
};
