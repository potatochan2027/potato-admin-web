interface FormItemProps {
  name: String;
  mark: String;
  remark: String;
  id: number;
  treeData: [];
  treeSelect: [];
}

interface FormProps {
  formInline: FormItemProps;
}

interface MenuItemProps {
  id: number;
  name: String;
}

interface MenuProps {
  menuInline: MenuItemProps;
}

export type {FormItemProps, FormProps, MenuItemProps, MenuProps}

