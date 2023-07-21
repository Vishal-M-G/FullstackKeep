import { useRef, useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const Admin = () => {
  const invalidMessage = useRef();
  const navigate = useNavigate();
  const [pass, setPass] = useState("");
  const [invalidPass, setInvalidPass] = useState(false);
  const setMenuOn = useOutletContext();

  useEffect(() => {
    if (localStorage.getItem("keep-user") !== null) {
      if (localStorage.getItem("keep-user") === "Admin") navigate("/admin");
      else navigate("/user");
    }
  }, []);

  return (
    localStorage.getItem("keep-user") === null && (
      <div className="mainBlock">
        <fieldset className="loginBox">
          <legend>Admin</legend>
          <input
            type="password"
            value={pass}
            placeholder="Password"
            onChange={(e) => setPass(e.target.value)}
            maxLength={20}
          />
          {invalidPass ? (
            <span ref={invalidMessage}>Invalid Password</span>
          ) : (
            <span>&nbsp;</span>
          )}
          <button
            className="btn"
            onClick={() => {
              fetch(`/users/Admin/${pass.trim()}`)
                .then((res) => res.json())
                .then((d) => {
                  if (d["result"] == "pass") {
                    localStorage.setItem("keep-userId", d["id"]);
                    localStorage.setItem("keep-user", "Admin");
                    setMenuOn[0](false);
                    navigate("/admin");
                  } else {
                    setInvalidPass(true);
                    setTimeout(
                      () =>
                        (invalidMessage.current.style.animation =
                          "errorShake 0.5s"),
                      1
                    );
                    setTimeout(
                      () => (invalidMessage.current.style.animation = "none"),
                      1001
                    );
                  }
                });
            }}
          >
            Login
          </button>
        </fieldset>
      </div>
    )
  );
};

export default Admin;
