import * as React from "react";
import styled from "styled-components";
import { Container } from "../components/Container";
import { Title } from "../components/Title";
import { Logo } from "../components/Logo";
import { FullWidth } from "../components/FullWidth";
import { CartItem } from "../components/CartItem";
import { getOrder } from "../utils/api";
import { colors, sizes } from "../utils/theme";

const Label = styled.div`
  font-size: 18px;
  text-align: left;
  font-weight: 600;
  display: block;
  padding-bottom: ${sizes.s}px;
`;

const Section = styled(({ label, value, className }) => (
  <div className={className}>
    <Label>{label}</Label>
    <div className="value">{value}</div>
  </div>
))`
  text-align: left;
  padding-top: ${sizes.l}px;
  font-size: 18px;

  .value {
    color: ${colors.black};
  }
`;

export const VerifyPurchasePage = ({ match }) => {
  const { orderId } = match.params;
  const [error, setError] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [order, setOrder] = React.useState(undefined);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const response = await getOrder(orderId);
        setOrder(response.data);
      } catch (e) {
        setError(e.toString());
      }
      setLoading(false);
    })();
  }, [orderId]);

  return (
    <Container>
      <FullWidth>
        <Logo />
        <Title>Verified Purchase</Title>
        {error && <p>Trouble fetching the order: {error}</p>}
        {loading && <div>Loading..</div>}
        {order && (
          <div>
            <Label>Paid items</Label>
            {order.order_lines.map(line => (
              <CartItem
                key={line.reference}
                name={line.name}
                price={line.unit_price}
                imageUrl={line.image_url}
              />
            ))}
            <Section label="Order id" value={orderId} />
            <Section
              label="Paid by"
              value={`${order.billing_address.given_name} ${order.billing_address.family_name}`}
            />
            <Section
              label="Paid at"
              value={order.created_at.substr(0, 16).replace("T", " ")}
            />
          </div>
        )}
      </FullWidth>
    </Container>
  );
};
