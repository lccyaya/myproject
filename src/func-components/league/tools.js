// 判断是否选择了默认的比赛信息
export const isJustInitData = (categories = [], selectedIds = []) => {
  for (let i = 0; i < categories.length; i++) {
    const item = categories[i].competitions;
    for (let o = 0; o < item.length; o++) {
      if (selectedIds.indexOf(item[o].id) === -1) {
        return false;
      }
    }
  }
  return true;
};

export const getCategories = (data) => {
  const _list = [];
  data.map(({ competitions }) => {
    for (let i = 0; i < competitions.length; i++) {
      if (!_list.find((item) => item.id === competitions[i].id)) {
        _list.push(competitions[i]);
      }
    }
  });

  return _list;
};


// 获取到main的所有的id
export const getMainIds = (categories) => {
  const ids = [];
  categories.map((item) => {
    item.competitions.map((subItem) => {
      // 获取去重后的main的id列表
      if (ids.indexOf(subItem.id) === -1) {
        ids.push(subItem.id);
      }
    });
  });
  return ids;
}