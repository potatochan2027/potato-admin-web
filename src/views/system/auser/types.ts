interface FormItemProps {
    id?: number;
    /** 用于判断是`新增`还是`修改` */
    title: string;
    higherDeptOptions: Record<string, unknown>[];
    parentId: number;
    username: string;
    password: string;
    deptId: number;
}

interface FormProps {
    formInline: FormItemProps;
}

interface RoleFormItemProps {
    id: null;
    username: string;
    /** 角色列表 */
    roleOptions: any[];
    /** 选中的角色列表 */
    ids: Record<number, unknown>[];
}

interface RoleFormProps {
    formInline: RoleFormItemProps;
}

export type {FormItemProps, FormProps, RoleFormItemProps, RoleFormProps};
