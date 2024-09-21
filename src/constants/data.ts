import { NavItem } from '@/types';


export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};


export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; 
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; 
  latitude?: number;
  job: string;
  profile_picture?: string | null;
};

export const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/email',
    icon: 'logo',
    label: 'Home'
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    label: 'Dashboard'
  },
  {
    title: 'Menu',
    href: '/storemenu',
    icon: 'media',
    label: 'Menu'
  },
  {
    title: 'Tasks',
    href: '/taskbox',
    icon: 'post',
    label: 'Store_Chat'
  },
  {
    title: 'Orders',
    href: '/order_tracking',
    icon: 'post',
    label: 'Store_Chat'
  },
  {
    title: 'Store Chat',
    href: '/chat',
    icon: 'post',
    label: 'Store_Chat'
  },
  
];
