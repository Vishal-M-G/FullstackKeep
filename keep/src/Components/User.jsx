import { useRef, useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

const User = () => {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const invalidMessage = useRef();
  const [invalid, setinvalid] = useState(false);
  const [invalidmessage, setinvalidmessage] = useState(false);
  const navigate = useNavigate();
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
          <legend>User</legend>
          <input
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
          />
          <input
            type="password"
            value={pass}
            placeholder="Password"
            onChange={(e) => setPass(e.target.value)}
            maxLength={20}
          />
          {invalid ? (
            <span ref={invalidMessage}>{invalidmessage}</span>
          ) : (
            <span>&nbsp;</span>
          )}
          <button
            className="btn"
            onClick={() => {
              if (name.trim() === "" || pass.trim() === "") {
                alert("Please fill both Name and Password fields");
                return;
              }
              fetch(`/users/${name.trim()}/${pass.trim()}`)
                .then((res) => res.json())
                .then((d) => {
                  if (d["result"] === "pass") {
                    localStorage.setItem("keep-userId", d["id"]);
                    localStorage.setItem("keep-user", name.trim());
                    setMenuOn[0](false);
                    navigate("/user");
                  } else {
                    if (d["reason"] === "Invalid Password") {
                      setinvalidmessage("Invalid Password");
                      setinvalid(true);
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
                    } else {
                      setinvalidmessage("Invalid User");
                      setinvalid(true);
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

export default User;
