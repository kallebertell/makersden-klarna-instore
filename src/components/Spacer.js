import * as React from "react";
import styled from "styled-components";
import { sizes } from "../utils/theme";

export const VerticalSpacer = styled.div`
  padding-top: ${props => sizes[props.size || "s"]}px;
`;

export const HorizontalSpacer = styled.div`
  padding-left: ${props => sizes[props.size || "s"]}px;
`;
