import { add } from 'lodash';
import React from 'react';
import { Button, Form, Space } from 'antd';
import { useIntl } from 'umi';



const FormSearch = ({ form, submit, nodes, reset, add, refresh, btns = [], initialValues = {} }) => {
  const intl = useIntl();
  return (
    <Form
      form={form}
      layout="inline"
      initialValues={initialValues}
      onValuesChange={submit}
      style={{ marginBottom: 16 }}
    >
      {nodes.map((item) => {
        return (
          <Form.Item
            label={item.label}
            name={item.name}
            key={item.name}
            style={{ marginBottom: 8 }}
          >
            {item.node}
          </Form.Item>
        );
      })}

      <Space align="start">
        {add ? (
          <Button type="primary" onClick={add}>
            新建
          </Button>
        ) : null}
        {refresh ? (
          <Button onClick={refresh} type="primary">
            刷新
          </Button>
        ) : null}
        {reset ? <Button onClick={reset}>重置</Button> : null}
        {btns.map((btn) => {
          return btn;
        })}
      </Space>
    </Form>
  );
};

export default FormSearch;
