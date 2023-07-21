import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import EmojiObjectsIcon from "@mui/icons-material/EmojiObjects";
import Tooltip from "@mui/material/Tooltip";

const NavBar = () => {
  const [menuOn, setMenuOn] = useState(false);

  return (
    <>
      <div className="navbar">
        <div id="logo">
          <EmojiObjectsIcon style={{ color: "white" }} id="keepIcon" />
          <span>Keep</span>
        </div>
        <div
          id="menuSection"
          onClick={() => {
            if (menuOn) {
              document.querySelector("#dropDown").style.opacity = 0;
              setTimeout(() => setMenuOn(false), 1000);
            } else {
              setMenuOn(true);
            }
          }}
        >
          {menuOn ? <CloseIcon id="menuIcon" /> : <MenuIcon id="menuIcon" />}
        </div>
        {menuOn && (
          <div id="dropDown">
            {localStorage.getItem("keep-user") === null ? (
              <>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? "activeNav" : "")}
                >
                  Admin
                </NavLink>
                <NavLink
                  to="/userLogin"
                  className={({ isActive }) => (isActive ? "activeNav" : "")}
                >
                  User
                </NavLink>
              </>
            ) : (
              <NavLink
                to={`${
                  localStorage.getItem("keep-user") === "Admin"
                    ? "/"
                    : "/userLogin"
                }`}
                onClick={() => {
                  localStorage.removeItem("keep-userId");
                  localStorage.removeItem("keep-user");
                  setMenuOn(false);
                }}
              >
                <Tooltip
                  title={`Logout from ${localStorage.getItem("keep-user")}`}
                  placement="top"
                  arrow
                  disableInteractive
                >
                  <span>Logout</span>
                </Tooltip>
              </NavLink>
            )}
          </div>
        )}
      </div>
      <Outlet context={[setMenuOn]} />
    </>
  );
};

export default NavBar;
