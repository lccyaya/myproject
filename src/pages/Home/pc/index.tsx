import { WechatOutlined, WeiboOutlined } from "@ant-design/icons";
import { Divider } from "antd";
import styles from "./index.module.less";


type HomeProps = {
  isPhone?: boolean;
  showTips?: boolean;
  hideLoading?: boolean;
};

const NewHome: React.FC<HomeProps> = (props) => {
  return (
    <>
      <div>
        <div className={styles.top_container}>
            <span className={styles.top_title}>34体育</span>
            <span className={styles.top_des}>专注于赛前决策服务</span>
        </div>
        <div className={styles.middle_container}>
          <span className={styles.middle_title}>34体育专注于赛前决策服务</span>
          <div className={styles.first_box}>
            <div className={styles.first_des}>赛前实时情报资讯，包括球员伤停、更衣室氛围、首发阵容、战术打法特点等，让用户能够
更加全面、有深度的分析比赛；</div>
          </div>
          <div className={styles.second_box}>
            <div className={styles.second_left_box}>
              <div className={styles.des_box}>
                <span className={styles.second_title}>提供足球</span>
                <span className={styles.second_des}>即时比分直播</span>
              </div>
            </div>
            <div className={styles.second_right01_box}>
              <div className={styles.des_box}>
                <span className={styles.second_title}>国内知名赛事分析专家</span>
                <span className={styles.second_des}>提供多维度赛事攻略</span>
              </div>
            </div>
            <div className={styles.second_right02_box}>
              <div className={styles.des_box}>
                <span className={styles.second_title}>赛事资深达人</span>
                <span className={styles.second_des}>提供多维度赛事知识分享</span>
              </div>
            </div>
          </div>
          <div className={styles.third_box}>
            <div className={styles.third_des_box}>
              <span className={styles.third_title}>和 34SPORTS 一起</span>
              <span className={styles.third_des}>了解足彩与赛前决策服务文案占位</span>
            </div>
          </div>
        </div>
        <div className={styles.footer_container}>
          <div className={styles.footer_box}>
            <div className={styles.about_box}>
              <div className={styles.about_left_box}>
                <span className={styles.box_title}>关于我们</span>
                <div>
                  <span className={styles.box_des}>客服微信：ty34sports</span>
                  <WeiboOutlined style={{marginLeft: 30, color: '#C5C5C5'}}/>
                  <WechatOutlined style={{marginLeft: 18, color: '#C5C5C5'}}/>
                </div>
              </div>
            </div>
            <div className={styles.copyright_box}>
              {/* <span className={styles.copyright_title}>Copyright © 2022-2022 www.34.com 版权所有 京ICP备11041704号-31 京ICP证070359号 隐私声明 资质证照</span> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewHome