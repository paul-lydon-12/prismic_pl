// container Nav component, any data for nav structure should go here
// container gets imported into 'components/layout/Layout'

import { Nav } from 'components/nav/Nav';
import { NavLink } from 'components/nav/NavLink';

export const NavContainer = () => (
  <Nav>
    <NavLink to="/temp/elements">Elements</NavLink>
    <NavLink to="/">Another link</NavLink>
  </Nav>
);
