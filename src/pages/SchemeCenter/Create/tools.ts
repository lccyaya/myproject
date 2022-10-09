// 获取渲染的数据
export const handlerList = (list: Array<any>) => {
  const newList = new Array<any>();
  if (list) {
    let obj: {
      time?: string;
      list: Array<any>;
    } = {
      list: new Array<any>(),
    };
    list.map((item: any) => {
      const { time } = item;
      if (obj.time != time) {
        obj = {
          time: time,
          list: new Array<any>(),
        };
        newList.push(obj)
      }
      obj.list.push(item);
    });
  }
  return newList;
};
