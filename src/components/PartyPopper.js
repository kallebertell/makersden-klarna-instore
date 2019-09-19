import * as React from "react";
import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  from {
    transform: scale(0.1) rotate(0deg);
  }

  to {
    transform: scale(1) rotate(360deg);
  }
`;

export const PartyPopper = styled(({ className }) => (
  <span className={className} role="img" aria-label="party popper">
    🎉
  </span>
))`
  animation: ${rotate} 1s cubic-bezier(0.1, 0.9, 0.1, 0.9) 1;
  font-size: 125px;
  display: block;
`;
