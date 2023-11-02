import {http} from "@/utils/http";
import {baseUrlApi} from "@/api/utils";

type ResultTable = {
  success: boolean;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
  msg?:String;
};

type Result = {
  success: boolean;
  data?: Array<any>;
  msg?:String;
}



export const listWebsiteRequest = (data?: Object) => {
  return http.request<ResultTable>("post", baseUrlApi("admin/rwebsite/list"), {data});
}

export const addWebsiteRequest = (data?: Object) => {
  return http.request<Result>("post", baseUrlApi("admin/rwebsite/add"), {data});
}

export const modifyWebsiteRequest = (data?: Object) => {
  return http.request<Result>("post", baseUrlApi("admin/rwebsite/modify"), {data});
}

export const delWebsiteRequest = (data?: Object) => {
  return http.request<Result>("post", baseUrlApi("admin/rwebsite/del"), {data});
}

