import Landing from "../screens/Landing/Landing";
import Dashboard from "../screens/Dashboard/Dashboard";
import About from "../screens/About/About";

export interface IRoute {
  path: string;
  component: React.FC;
}

const routes: IRoute[] = [
  {
    path: "/",
    component: Landing,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/about",
    component: About,
  },
];

export default routes;
