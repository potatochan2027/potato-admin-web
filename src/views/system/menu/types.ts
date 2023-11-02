interface FormSubItemProps {
    id: number;
    title: String;
    icon: String;
    rank: number;
}

interface FormItemProps {
    name: String;
    path: String;
    component: String;
    id: number;
    parentId: number;
    meta: FormSubItemProps;
}

interface FormProps {
    formInline: FormItemProps;
}

export type {FormItemProps, FormProps,FormSubItemProps}

