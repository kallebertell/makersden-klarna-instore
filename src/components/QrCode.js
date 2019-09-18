import * as React from "react";
import styled from "styled-components";
import { BrowserQRCodeSvgWriter } from "@zxing/library";

const QrContainer = styled.div`
  svg {
    display: block;
    margin: 0 auto;
  }
`;

export const QrCode = ({ url }) => {
  React.useEffect(() => {
    if (url) {
      const codeWriter = new BrowserQRCodeSvgWriter();
      codeWriter.writeToDom("#qrCode", url, 300, 300);
    }
  }, [url]);

  return <QrContainer id="qrCode"></QrContainer>;
};
