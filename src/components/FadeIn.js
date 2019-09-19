import * as React from "react";
import styled, { keyframes } from "styled-components";

const frames = keyframes`
  from {
    opacity: 0.1;
  }

  to {
    opacity: 1;
  }
`;

export const FadeIn = styled.div`
  animation: ${frames} 0.4s ease-in 1;
`;
