import React, { ChangeEvent, useEffect, useState } from 'react';

import { usePrev } from 'hooks';
import { RootStore, useStore } from 'store';

import {
  CopyOutlined,
  FontSizeOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Tabs, Upload } from 'antd';
import { RcFile } from 'antd/es/upload';

type TTab = 'text' | 'file';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const ImportModal = ({ visible, onClose }: Props) => {
  const [activeTabKey, setActiveTabKey] = useState<TTab>('text');
  const [inputValue, setInputValue] = useState<string>('');
  const [file, setFile] = useState<RcFile | null>(null);

  const [form] = Form.useForm();
  const prevVisible = usePrev(visible);

  const importScenarios = useStore((store: RootStore) => store.importScenarios);

  const importButtonDisabled =
    (activeTabKey === 'text' && inputValue === '') ||
    (activeTabKey === 'file' && !file);

  const handleChangeInputValue = ({
    target: { value },
  }: ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(value);
  };

  const handleUploadJSON = (file: RcFile) => {
    setFile(file);

    return false;
  };

  const handleValidate = () => {
    if (activeTabKey === 'text') form.submit();
    else if (activeTabKey === 'file') handleImportAsFile();
  };

  const handleImportAsText = () => {
    const importingScenarios = JSON.parse(inputValue);

    if (typeof importingScenarios === 'object') {
      importScenarios(importingScenarios);
    }

    onClose();
  };

  const handleImportAsFile = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event?.target?.result) {
          try {
            const importingScenarios = JSON.parse(
              event.target.result as string
            );

            if (typeof importingScenarios === 'object') {
              importScenarios(importingScenarios);
            }

            onClose();
          } catch (err) {}
        }
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    if (prevVisible && !visible) {
      setActiveTabKey('text');
      setInputValue('');
      form.resetFields();
      setFile(null);
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
          key="import"
          type="primary"
          disabled={importButtonDisabled}
          onClick={handleValidate}
        >
          Import
        </Button>,
      ]}
    >
      <Tabs
        activeKey={activeTabKey}
        onChange={(tab) => setActiveTabKey(tab as TTab)}
        items={[
          {
            key: 'text',
            label: (
              <span>
                <FontSizeOutlined />
                From text
              </span>
            ),
            children: (
              <Form
                form={form}
                name="inputImport"
                onFinish={handleImportAsText}
                autoComplete="off"
              >
                <Form.Item
                  name="input"
                  rules={[
                    {
                      required: true,
                      validateTrigger: 'onSubmit',
                      validator: () => {
                        try {
                          JSON.parse(inputValue);
                          return Promise.resolve();
                        } catch (err) {
                          return Promise.reject('Incorrect JSON');
                        }
                      },
                    },
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder="Input your scenario configuration"
                    value={inputValue}
                    onChange={handleChangeInputValue}
                  />
                </Form.Item>
              </Form>
            ),
          },
          {
            key: 'file',
            label: (
              <span>
                <CopyOutlined />
                From file
              </span>
            ),
            children: (
              <div>
                <Upload
                  fileList={file ? [file] : []}
                  beforeUpload={handleUploadJSON}
                  onRemove={() => setFile(null)}
                >
                  <Button icon={<UploadOutlined />}>Select JSON file</Button>
                </Upload>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};
