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
}
