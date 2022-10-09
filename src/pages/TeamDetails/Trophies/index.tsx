import React from 'react';
import styles from './index.less';
import trophy from '@/assets/trophy.svg';
import type { trophy as trophyType, trophies } from '../index';
import Empty from '@/components/Empty';

const Trophies: React.FC<{ data: trophies[] }> = (props) => {
    const { data } = props;

    return (
        data && data.length > 0 ? <div className={styles.trophiesContainer}>
            {data.map((ele: trophies) => {
                return <div className={styles.row} key={ele.name}>
                    <div className={styles.name}>{ele.name}</div>
                    <div className={styles.content}>
                        {ele.list.map((t: trophyType) => {
                            return <div className={styles.trophy} key={t.season}>
                                <img src={trophy} className={styles.logo} />
                                <div className={styles.text}>{t.season}</div>
                            </div>
                        })}
                    </div>
                </div>
            })}
        </div>
            : <Empty />
    );
};

export default Trophies;
