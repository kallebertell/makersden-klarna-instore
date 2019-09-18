import * as React from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { pathOr } from "ramda";
import styled from "styled-components";

const codeReader = new BrowserMultiFormatReader();

const LoaderContainer = styled.div`
  text-align: center;
`;

export const Scanner = ({ onScanResult }) => {
  const [videoInputs, setVideoInputs] = React.useState([]);
  const [selectedInput, setSelectedInput] = React.useState("");
  const [error, setError] = React.useState("");
  const [permissionState, setPermissionState] = React.useState("unknown");
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (permissionState !== "ok") {
        setPermissionState("nope");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [permissionState]);

  React.useEffect(() => {
    // navigator.mediaDevices may not be present on all browsers or in non-http context
    if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      setPermissionState("ok");
      return;
    }

    navigator.mediaDevices.getUserMedia({ video: true }).then(result => {
      if (result.getVideoTracks().length > 0) {
        setPermissionState("ok");
      }
    });
  }, []);

  React.useEffect(() => {
    (async () => {
      const inputs = await codeReader.listVideoInputDevices();
      setVideoInputs(prevInputs => prevInputs.concat(inputs));
      setSelectedInput(pathOr("", ["0", "key"], inputs));
    })();

    return () => {
      codeReader.reset();
    };
  }, []);

  React.useEffect(() => {
    if (videoRef.current && permissionState === "ok") {
      codeReader.decodeFromVideoDevice(
        selectedInput || null,
        videoRef.current,
        (result, err) => {
          if (err && !(err instanceof NotFoundException)) {
            setError(err.message);
          }
          if (result) {
            setError("");
            onScanResult(result);
          }
        }
      );
    }
  }, [selectedInput, permissionState, onScanResult]);

  return (
    <div>
      {error && <p>{error}</p>}
      {permissionState === "ok" && (
        <video ref={videoRef} width="100%" height="auto" />
      )}
      {permissionState === "unknown" && (
        <LoaderContainer>loading</LoaderContainer>
      )}
      {permissionState === "nope" && (
        <>
          <h1>Permissions Required</h1>
          <h2>Please allow access to the camera</h2>
        </>
      )}

      <div>
        {videoInputs.length > 2 && (
          <select onChange={setSelectedInput} value={selectedInput}>
            <option value="" disabled>
              Select Device
            </option>
            {videoInputs.map(({ deviceId, label }) => (
              <option key={deviceId} value={deviceId}>
                {label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};
