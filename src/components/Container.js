import * as React from "react";
import styled from "styled-components";
import { sizes } from "../utils/theme";

export const Container = styled.div`
  box-sizing: border-box;
  max-width: 600px;
  min-height: 100vh;
  margin: 0 auto;
  text-align: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes.m}px;
`;
