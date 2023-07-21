import { useRef, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

function Item({ searcher, dataId, title, desc, refresh, onEdit, onView }) {
  const optionerRef = useRef();
  const itemRef = useRef();
  const [optioner, setOptioner] = useState(false);

  return (
    searcher.toLowerCase() ===
      title.substring(0, searcher.length).toLowerCase() && (
      <div
        className="item"
        ref={itemRef}
        onMouseEnter={() => setOptioner(true)}
        onMouseLeave={() => {
          try {
            optionerRef.current.style.animation = "smoothout 0.3s";
          } catch {}
          setTimeout(() => setOptioner(false), 300);
        }}
      >
        <div>
          <strong>
            <span style={{ backgroundColor: "yellow" }}>
              {title.substring(0, searcher.length)}
            </span>
            {title.substring(searcher.length)}
          </strong>
        </div>
        <pre>{desc}</pre>
        {optioner && (
          <div ref={optionerRef} className="lightItem">
            <Tooltip title="View" arrow disableInteractive>
              <VisibilityIcon
                className="mat-icons-option"
                id="viewIconOption"
                onClick={() => onView(title, desc)}
              />
            </Tooltip>
            <Tooltip title="Edit" arrow disableInteractive>
              <EditIcon
                className="mat-icons-option"
                id="editIconOption"
                onClick={() => onEdit(dataId, title, desc)}
              />
            </Tooltip>
            <Tooltip title="Delete" arrow disableInteractive>
              <DeleteIcon
                className="mat-icons-option"
                id="deleteIconOption"
                onClick={() => {
                  itemRef.current.style.animation = "smoothout 0.5s";
                  fetch(
                    `/deleteItem/${localStorage.getItem(
                      "keep-userId"
                    )}/${dataId}`
                  ).then(refresh);
                }}
              />
            </Tooltip>
          </div>
        )}
      </div>
    )
  );
}

export default Item;
