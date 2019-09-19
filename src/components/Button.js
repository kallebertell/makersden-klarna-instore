import * as React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  display: block;
  width: 100%;
  background-color: black;
  padding: 15px;
  color: white;
  font-family: sans-serif;
  font-weight: 600;
  font-size: 18px;
  line-height: 18px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  &:focus {
    outline: none;
  }
  &[disabled] {
    opacity: 0.7;
    color: #ccc;
  }
`;

export const Button = ({ children, ...otherProps }) => (
  <StyledButton {...otherProps}>{children}</StyledButton>
);
