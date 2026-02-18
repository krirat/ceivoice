import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router-dom";

export default function DefaultSidebar() {
  return (
    <Sidebar>
      <Menu>
        <MenuItem component={<Link to="/admin" />}>General</MenuItem>
        <MenuItem>User</MenuItem>
        <MenuItem component={<Link to ="/admin/tickets"/>}>All Ticket</MenuItem>
        <MenuItem>Notifications</MenuItem>
        <MenuItem>Settings</MenuItem>
      </Menu>
    </Sidebar>
  );
}
