import {http} from "@/utils/http";
import {baseUrlApi} from "@/api/utils";

type Result = {
    success: boolean;
    data?: Array<any>;
    msg?:String;
}

type ResultTable = {
    success: boolean;
    data?: Array<any>;
    msg?:String;
};

export const getUserListRequest = (data?: Object) => {
    return http.request<ResultTable>("post", baseUrlApi("admin/user/list"), {data});
}

export const addUserRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/user/add"),{data});
}

export const modifyUserRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/user/modify"),{data});
}

export const delUserRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/user/del"),{data});
}

export const batchDelUserRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/user/batchDel"),{data});
}

export const bindRoleRequest=(data?:Object)=>{
    return http.request<Result>("post",baseUrlApi("admin/role/bind"),{data},{});
}
