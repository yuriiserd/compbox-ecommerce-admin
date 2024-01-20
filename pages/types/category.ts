export type Category = {
  _id?: string;
  name: string;
  parent?: string | Category;
  order: number;
  image: string;
  childrens?: Category[] | string[];
  createdAt: Date;
  updatedAt: Date;
  properties?: [
    {
      _id?: string;
      name: string;
      values: string[];
    }
  ];
};