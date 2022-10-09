import { mySchemeList } from '@/services/scheme';
import { Card, Form, message, Modal, Space, Table, Tooltip } from 'antd';
import { useAntdTable } from 'ahooks';
import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import FormSearch from '@/components/FormSearch';
import styles from './index.less';
import * as dayjs from 'dayjs';
import { CheckOutlined } from '@ant-design/icons';
import { SCHEME_STATE } from '@/constants/index';
import { ColumnsType } from 'antd/lib/table';
import { useHistory, useSelector } from 'umi';
import { ConnectState } from '@/models/connect';
import { UserInfoType } from '@/services/user';
import { ExpertStatus } from '@/utils/scheme';

interface PageParam {
  current: number;
  pageSize: number;
}

const SchemeList: React.FC = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const user = useSelector<ConnectState, UserInfoType | null | undefined>(
    (s) => s.user.currentUser,
  );

  const columns: ColumnsType<{}> = [
    {
      title: '方案ID',
      width: 120,
      render: (record: any) => {
        return record.id;
      },
    },
    {
      title: '专家',
      width: 120,
      render: (record: any) => {
        return record.expert_name;
      },
    },
    {
      title: '比赛',
      width: 200,
      render: (record: any) => {
        return (
          <div>
            <div>{record.competition_name}</div>
            <div>{dayjs(record.match_time * 1000).format('YYYY-MM-DD HH:mm')}</div>
            <div>{`${record.home_team_name}vs${record.away_team_name}`}</div>
          </div>
        );
      },
    },
    {
      title: '推荐项',
      width: 300,
      render: (record: any) => {
        return (
          <div>
            <div>{record?.play_odds?.scheme_title}</div>
            <Space size={40}>
              {record?.play_odds?.odds?.map((item: any, index: number) => {
                return (
                  <div key={index}>
                    <div>{item.title}</div>
                    <div>{item.odd}</div>
                    <div style={{ width: 20, height: 20 }}>
                      {item.selected ? <CheckOutlined style={{ color: 'green' }} /> : null}
                    </div>
                  </div>
                );
              })}
            </Space>
          </div>
        );
      },
    },
    {
      title: '分析',
      width: 500,
      render: (record: any) => {
        return (
          <Tooltip className={styles.fenxi} title={record.detail} placement="topLeft">
            {record.detail || '-'}
          </Tooltip>
        );
      },
    },
    {
      title: '定价',
      width: 120,
      render: (record: any) => {
        return record.gold_coin ? record.gold_coin + '金币' : '免费';
      },
    },
    {
      title: '付费/查看(次)',
      width: 120,
      render: (record: any) => {
        return record.doc_num + '/' + record.visit_num;
      },
    },
    {
      title: '发布时间',
      width: 200,
      render: (record: any) => {
        return dayjs(record.published_at * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '比赛状态',
      width: 120,
      render: (record: any) => {
        return <div>{record.match_status}</div>;
      },
    },
    {
      title: '方案状态',
      width: 120,
      render: (record: any) => {
        return SCHEME_STATE[record.state];
      },
    },
    {
      title: '操作',
      width: 120,
      fixed: 'right',
      render: (record: any) => {
        return (
          <Space>
            {/* <a onClick={() => {}}>{record.state === 3 || record.state === 4 ? '查看' : '编辑'}</a> */}
            <a onClick={() => {
              history.push('/zh/profile/center/create/detail', record)
            }}>查看</a>
            {/* {record.state === 1 ? (
              <a
                onClick={() => {
                  Modal.confirm({
                    title: '停售',
                    content: '停止售卖后未查看的用户将不可查看分析，是否确认停售？',
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                      message.success('操作成功');
                      search.submit();
                    },
                  });
                }}
                style={{ color: 'red' }}
              >
                停售
              </a>
            ) : null}
            {record.state === 0 ? (
              <a
                style={{ color: 'red' }}
                onClick={() => {
                  Modal.confirm({
                    title: '删除',
                    content: '发布前可删除，是否确认删除？',
                    okText: '删除',
                    cancelText: '取消',
                    onOk: () => {
                      message.success('删除成功');
                      search.submit();
                    },
                  });
                }}
              >
                删除
              </a>
            ) : null} */}
          </Space>
        );
      },
    },
  ];

  const getTableData = async ({ current, pageSize }: PageParam, formData: Object) => {
    if (user?.expert == null) {
      return {
        total: 0,
        list: [],
      };
    }
    const params = {
      page: current,
      size: pageSize,
      expert_id: user?.expert.id,
      ...formData,
    };

    const result = await mySchemeList(params);
    if (result.err) {
      return {
        total: 0,
        list: [],
      };
    }
    return {
      total: result.data.total,
      list: result.data.list,
    };
  };

  const { tableProps, search, refresh } = useAntdTable(getTableData, {
    defaultPageSize: 10,
    form,
    manual: true,
  });

  useEffect(() => {
    search.reset();
  }, [user]);

  const toCreate = () => {
    if (user?.expert?.status != ExpertStatus.Accept) {
      message.error('您还未通过专家审核，暂不能创建攻略');
      return;
    }
    history.push('/zh/profile/center/create');
  };

  return (
    <PageContainer>
      <Card>
        <FormSearch
          form={form}
          submit={search?.submit}
          add={toCreate}
          // reset={search?.reset}
          reset={null}
          refresh={refresh}
          nodes={[]}
        />
        <Table
          bordered
          columns={columns}
          {...tableProps}
          scroll={{ x: 'max-content' }}
          rowKey={(record:any) => record.id}
        />
      </Card>
    </PageContainer>
  );
};

export default SchemeList;
