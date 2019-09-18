import * as React from "react";
import styled from "styled-components";
import { sizes, colors } from "../utils/theme";

export const CartItem = styled(
  ({ name, price, imageUrl, className, variant = "default" }) => (
    <div className={className}>
      <img alt={name} src={imageUrl} />
      <div className="details">
        <div className="name">{name}</div>
        <div className="price">{(price / 100).toFixed(0)} eur</div>
      </div>
    </div>
  )
)`
  display: flex;
  width: 100%;
  margin-bottom: ${sizes.m}px;

  img {
    width: ${({ variant }) => (variant === "small" ? 90 : 180)}px;
    height: ${({ variant }) => (variant === "small" ? 50 : 100)}px;
    object-fit: cover;
    margin-right: ${sizes.m}px;
    background-color: ${colors.grey};
  }

  .details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding: ${({ variant }) => (variant === "small" ? sizes.s : sizes.m)}px;
  }

  .name {
    font-size: ${({ variant }) => (variant === "small" ? 14 : 18)}px;
  }

  .price {
    font-size: ${({ variant }) => (variant === "small" ? 18 : 24)}px;
    font-weight: 600;
  }
`;
