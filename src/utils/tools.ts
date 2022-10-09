export type Result<T> = {
  success: boolean;
  code?: number;
  data?: T;
  response: any; // 原始数据
  err?: Error;
  message?: string;
}

/**
 * 自动解包多级 data（当 data 存在且仅存在 data 属性）
 * TODO 可以对 request 包一层，避免样板代码
 */
export function normalizeResponse<T = any>(
  res: { code?: number; message?: string; data: any },
): Result<T> {
  if (!res) {
    return {
      success: false,
      data: undefined,
      message: '',
      err: new Error(''),
      response: res
    };
  }
  const { data } = res;

  /**
   * 返回错误
   */
  if (res.code === 0) {
    return {
      success: true,
      data,
      response: res,
      code: res.code,
    };
  } else {
    return {
      success: false,
      err: new Error(''),
      message: res.message!,
      response: res,
    };
  }
  
}

/**
 * 线程等待
 * @param ms 毫秒
 * @returns
 */
export async function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  })
}

export function normalizeFloat(n: number | undefined) {
  if (n) {
    if (n > 100) {
      return n.toFixed(0);
    } else if (n > 10) {
      return n.toFixed(1);
    } else {
      const float = n.toString().split(".");
      return float[1] && float[1].length > 3 ? n.toFixed(3) : n;
    }
  } else {
    return '-';
  }
}