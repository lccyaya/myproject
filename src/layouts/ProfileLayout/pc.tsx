import { Layout, Menu, MenuProps } from 'antd';
import { useHistory } from 'umi';

const { Header, Footer, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [getItem('创作中心', '/zh/profile/center')];

const ProfileLayout: React.FC = (props) => {

  const {
    children,
  } = props;
  const history = useHistory()

  const selectMenu = (item: any) => {
    history.push(item.key)
  }

  return (
    <>
      <Layout style={{height: '100%', minHeight: '100%'}}>
        <Sider>
          <Menu
            mode="inline"
            defaultSelectedKeys={['/zh/profile/center']}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
            onClick={selectMenu}
          />
        </Sider>
        <Content>{children}</Content>
      </Layout>
    </>
  );
};

export default ProfileLayout;
