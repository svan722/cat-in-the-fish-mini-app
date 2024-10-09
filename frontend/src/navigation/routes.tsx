import type { ComponentType, JSX } from 'react';

import Channel from '@/pages/Channel';
import Invite from '@/pages/Invite';
import Farm from '@/pages/Farm';
import Home from '@/pages/Home';
import Task from '@/pages/Task';
import Play from '@/pages/Play';
import Info from '@/pages/Info';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: Home },
  { path: '/channel', Component: Channel },
  { path: '/invite', Component: Invite },
  { path: '/farm', Component: Farm },
  { path: '/play', Component: Play },
  { path: '/task', Component: Task },
  { path: '/info', Component: Info },
];
