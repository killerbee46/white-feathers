export interface MenuItemTypes {
  label: string;
  path: string;
  children?:{
    label: string;
  path: string;
  }[]
}

export interface NavBannerTypes {
  title: string;
  image: string;
}

export interface NavbarDataTypes {
  name?: string;
  logo?: string;
  phone?: string;
  mail?: string;
  menus: MenuItemTypes[];
  socials?: Tsocials[];
  backgroundColor?: string;
  banner?: NavBannerTypes;
}
export interface NavbarPropsTypes {
  auth?: boolean;
  searchable?: boolean;
  data: NavbarDataTypes;
  backgroundColor?: string;
  transparent?: boolean;
}

export interface Tsocials {
  platform: string;
  path: string;
}
