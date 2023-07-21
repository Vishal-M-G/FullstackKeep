import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LightPage from "./LightPage";

const HomeAdmin = () => {
  const LP = useRef();
  const navigate = useNavigate();
  const [users, setUser] = useState([]);
  const [passwordChange, setPasswordChange] = useState(["", ""]);
  const [addNewUser, setNewUser] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("keep-user") !== "Admin") navigate("/");
    fetch("/admin")
      .then((res) => res.json())
      .then((d) => {
        setUser(d["users"]);
      });
  }, []);

  return (
    localStorage.getItem("keep-user") === "Admin" && (
      <div>
        <div className="mainBox">
          {passwordChange[0] !== "" && (
            <LightPage
              process="changePassword"
              refi={LP}
              onClose={() => {
                LP.current.style.animation = "smoothout 1s";
                setTimeout(() => setPasswordChange(["", ""]), 1000);
              }}
              userId={passwordChange[0]}
              modifyData={() =>
                fetch("/admin")
                  .then((res) => res.json())
                  .then((d) => setUser(d["users"]))
              }
              oldPass={passwordChange[1]}
            />
          )}
          <center>
            <div className="table">
              <div className="table-row">
                <div style={{ width: "10%" }}>ID</div>
                <div style={{ width: "30%" }}>NAME</div>
                <div style={{ width: "30%" }}>PASSWORD</div>
                <div style={{ width: "30%" }}>ACTION</div>
              </div>
              {users.map((ele, index) => (
                <div
                  className="table-row"
                  key={index}
                  style={{ color: "blue" }}
                >
                  <div style={{ width: "10%" }}>{ele[0]}</div>
                  <div style={{ width: "30%" }}>{ele[1]}</div>
                  <div style={{ width: "30%" }}>{ele[2]}</div>
                  <div style={{ width: "30%" }}>
                    <button
                      className="btnAction chpassword"
                      onClick={() => setPasswordChange([ele[0], ele[2]])}
                    >
                      Change Password
                    </button>
                    {ele[0] !== 1 && (
                      <button
                        className="btnAction delete"
                        onClick={() => {
                          fetch(`/deleteUser/${ele[0]}`)
                            .then((res) => res.json())
                            .then((d) => {
                              setUser(d["users"]);
                            });
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <button
                className="btn"
                style={{ marginTop: "1rem" }}
                onClick={() => setNewUser(true)}
              >
                Add New User
              </button>
              {addNewUser && (
                <LightPage
                  refi={LP}
                  onClose={() => {
                    LP.current.style.animation = "smoothout 1s";
                    setTimeout(() => setNewUser(false), 1000);
                  }}
                  modifyData={() =>
                    fetch("/admin")
                      .then((res) => res.json())
                      .then((d) => setUser(d["users"]))
                  }
                />
              )}
            </div>
          </center>
        </div>
      </div>
    )
  );
};

export default HomeAdmin;
