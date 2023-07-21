import { useState, useRef } from "react";
import Close from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

const LightPage = ({ onClose, refi, userId, modifyData, oldPass, process }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [newPassword, setNewPassword] = useState(oldPass);
  const close = useRef();

  return (
    <div id="lightpage" ref={refi}>
      {process === "changePassword" ? (
        <div>
          <input
            type="text"
            value={newPassword}
            placeholder="New Password"
            maxLength={20}
            autoFocus
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            onClick={() => {
              if (newPassword.trim() === "") {
                alert("Password cannot be empty");
                return;
              }
              fetch(`/changePassword/${userId}/${newPassword}`).then(() => {
                onClose();
                modifyData();
              });
            }}
          >
            Set Password
          </button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="Name"
            maxLength={20}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            maxLength={20}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={() => {
              if (name.trim() === "") {
                alert("Enter a valid name");
                return;
              }
              if (password.trim() === "") {
                alert("Password cannot be empty");
                return;
              }
              fetch(`/addUser/${name}/${password}`)
                .then((res) => res.json())
                .then((d) => {
                  if (d["result"] === "fail") {
                    alert("User name already exist");
                    return;
                  }
                  onClose();
                  modifyData();
                });
            }}
          >
            Add user
          </button>
        </div>
      )}
      <span
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          zIndex: "2",
        }}
        onMouseOver={(e) => {
          close.current.style.color = "red";
          close.current.style.transform = "rotate(90deg)";
        }}
        onMouseOut={(e) => {
          close.current.style.color = "white";
          close.current.style.transform = "rotate(0deg)";
        }}
      >
        <Tooltip title="Close" disableInteractive arrow>
          <Close
            style={{
              color: "white",
              fontSize: "5rem",
              transition: "all 0.5s",
            }}
            ref={close}
            onClick={onClose}
          />
        </Tooltip>
      </span>
    </div>
  );
};

export default LightPage;
