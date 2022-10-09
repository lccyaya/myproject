import moment from 'moment';

// 初始化的数据
export const initParams = {
    zone: -new Date().getTimezoneOffset() / 60, // 获取时区
    timestamp: 0,
    keywords: '', // 搜索的 key
    page: 1,
    size: 20,
  };
  
// 初始化分页数据
export const initPageData = {
    page: 1, // 记录上拉加载的page 
    prePage: 0, // 记录下拉加载的page
    isLoading: '', // pre 下拉加载时  next 上滑加载时  '' 没有加载时
    has_pre: true, // 根据数据判断 是否还有之前更多的数据 
    has_next: true, // 根据数据判断 是否还有之后更多的数据
}

// 获取当前的日历日期
export const getCalendarTitle = (current, setCalendarValue, renderData) => {
    try {
      const scrollTop = current.getValues().scrollTop;
      const titles = current.container.getElementsByClassName('time_title');
      let activeKey = 0;
      for (let i = 0; i < titles.length; i++) {
        if (scrollTop >= titles[i].offsetTop) {
          activeKey = i;
        } else {
          break;
        }
      }
      // 获取时间戳
      setCalendarValue(moment(renderData[titles[activeKey].innerText][0].match_time * 1000));
    } catch (error) {}
}


// 获取渲染的数据
export const handlerData = (data) => {
    const { matches } = data || {};
    if (matches) {
      let obj = {};
      matches.map((item) => {
        const { time } = item;
        if (obj[time]) {
          obj[time].push(item);
        } else {
          obj[time] = [item];
        }
      });
      return [Object.keys(obj), obj];
    }
    return [[], []];
};