import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import Item from "./Item";
import LightPageVE from "./LightPageVE";
import EditIcon from "@mui/icons-material/Edit";

const HomeUser = () => {
  const navigate = useNavigate();
  const [opener, invertOpener] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [items, modifyItems] = useState([]);
  const searchRef = useRef();
  const taRef = useRef();
  const lightPageRef = useRef();
  const [searchText, setSearchText] = useState("");
  const [editor, setEditor] = useState(false);
  const [editId, setEditId] = useState(-1);
  const [process, setProcess] = useState(["", "", ""]);

  window.onkeydown = (e) => {
    if (e.ctrlKey && e.keyCode == "F".charCodeAt(0)) {
      if (searchRef.current) {
        e.preventDefault();
        searchRef.current.focus();
      }
    }
  };

  const openEditor = (id, t, d) => {
    setEditId(id);
    setTitle(t);
    setDesc(d);
    invertOpener(true);
    setEditor(true);
  };

  useEffect(() => {
    let user = localStorage.getItem("keep-user");
    if (user !== null) {
      if (user === "Admin") navigate("/admin");
    } else {
      navigate("/userLogin");
    }
    fetch(`/fetchItems/${localStorage.getItem("keep-userId")}`)
      .then((res) => res.json())
      .then((d) => modifyItems(d["data"]));
  }, []);

  return (
    localStorage.getItem("keep-user") !== null && (
      <div className="userBlock">
        {editor && (
          <LightPageVE
            refi={lightPageRef}
            process={process}
            closeLp={(r) => {
              lightPageRef.current.style.animation = "smoothout 0.5s";
              setTimeout(() => {
                setProcess(["", "", ""]);
                setEditor(false);
              }, 500);
            }}
          />
        )}
        <div className="searchBlock">
          <div id="searchEntity">
            <input
              ref={searchRef}
              type="text"
              placeholder="Type your text to search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Tooltip title="Search Title" arrow disableInteractive>
              <SearchIcon id="searchIcon" />
            </Tooltip>
          </div>
        </div>
        <div className="adderBlock">
          {opener && (
            <input
              type="text"
              placeholder="Enter your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                zIndex: `${editor && process[0] !== "view" ? "2" : ""}`,
              }}
            />
          )}
          <Tooltip
            title={
              opener
                ? editor
                  ? ""
                  : "Double click to close adder"
                : "Click to open adder"
            }
            arrow
            disableInteractive
            placement="right"
          >
            <textarea
              ref={taRef}
              id="ta"
              placeholder={
                opener ? "Enter your Description" : "Click to add a Note"
              }
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              onClick={() => invertOpener(true)}
              onDoubleClick={() => {
                if (editor) return;
                setTitle("");
                setDesc("");
                invertOpener(false);
              }}
              maxLength={1000}
              readOnly={opener ? false : true}
              style={{
                zIndex: `${editor && process[0] !== "view" ? "2" : ""}`,
              }}
            ></textarea>
          </Tooltip>
          {opener && (
            <Tooltip
              title={`${editor ? "Confirm Edit" : "Add"}`}
              arrow
              disableInteractive
            >
              <center>
                {editor ? (
                  <EditIcon
                    id="addIcon"
                    style={{
                      position: "relative",
                      zIndex: `${editor && process[0] !== "view" ? 2 : ""}`,
                      padding: "0.2rem 0",
                    }}
                    onClick={() => {
                      if (desc.trim() === "") {
                        alert("Description cannot be empty");
                        return;
                      }
                      lightPageRef.current.style.animation = "smoothout 0.5s";
                      fetch(
                        `/alterItem/${localStorage.getItem(
                          "keep-userId"
                        )}/${editId}/${
                          title.trim() === "" ? "Untitled" : title.trim()
                        }/${desc.trim().replace(new RegExp("\n", "g"), "%0A")}`
                      ).then(() => {
                        fetch(
                          `/fetchItems/${localStorage.getItem("keep-userId")}`
                        )
                          .then((res) => res.json())
                          .then((d) => modifyItems(d["data"]));
                      });
                      setTimeout(() => {
                        setTitle("");
                        setDesc("");
                        setEditor(false);
                        invertOpener(false);
                      }, 500);
                    }}
                  />
                ) : (
                  <AddIcon
                    id="addIcon"
                    onClick={() => {
                      if (desc.trim() === "") {
                        alert("Description cannot be empty");
                        return;
                      }
                      fetch(
                        `/addItem/${localStorage.getItem("keep-userId")}/${
                          title.trim() === "" ? "Untitled" : title.trim()
                        }/${desc.trim().replace(new RegExp("\n", "g"), "%0A")}`
                      ).then(() => {
                        setTitle("");
                        setDesc("");
                        invertOpener(false);
                        fetch(
                          `/fetchItems/${localStorage.getItem("keep-userId")}`
                        )
                          .then((res) => res.json())
                          .then((d) => modifyItems(d["data"]));
                      });
                    }}
                  />
                )}
              </center>
            </Tooltip>
          )}
        </div>
        <div className="dataBlock">
          {items &&
            items.map((e, index) => {
              return (
                <Item
                  searcher={searchText}
                  dataId={e[0]}
                  title={e[1]}
                  desc={e[2]}
                  key={index}
                  refresh={() => {
                    fetch(`/fetchItems/${localStorage.getItem("keep-userId")}`)
                      .then((res) => res.json())
                      .then((d) => modifyItems(d["data"]));
                  }}
                  onEdit={(id, t, d) => openEditor(id, t, d)}
                  onView={(t, d) => {
                    setProcess(["view", t, d]);
                    setEditor(true);
                  }}
                />
              );
            })}
        </div>
      </div>
    )
  );
};

export default HomeUser;
