import Close from "@mui/icons-material/Close";
import Tooltip from "@mui/material/Tooltip";

function LightPageVE({ process, refi, closeLp }) {
  return (
    <div id="lightPageVE" ref={refi}>
      {process[0] === "view" ? (
        <div id="container">
          <div>{process[1]}</div>
          <pre>{process[2]}</pre>
          <Tooltip title="Close" arrow placement="left" disableInteractive>
            <Close id="exitIcon" onClick={closeLp} />
          </Tooltip>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default LightPageVE;
