import {http} from "@/utils/http";
import {baseUrlApi} from "@/api/utils";

type Result = {
    success: boolean;
    data?: Array<any>;
    msg?:String;
}

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
};

export const getRoleList = (data?: Object) => {
    return http.request<ResultTable>("post", baseUrlApi("admin/role/list"), {data});
}

export const getRoleListByUIDRequest = (data?: Object) => {
    return http.request<ResultTable>("post", baseUrlApi("admin/role/listById"), {data});
}


export const addRole=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/role/add"),{data});
}

export const modifyRole=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/role/modify"),{data});
}

export const delRole=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/role/del"),{data});
}

export const bindMenuRequest=(data?:Object)=>{
  return http.request<Result>("post",baseUrlApi("admin/menu/bind"),{data});
}
