import * as React from "react";
import styled from "styled-components";

import { Container } from "../components/Container";
import { Title } from "../components/Title";
import { Button } from "../components/Button";
import { QrCode } from "../components/QrCode";
import { Scanner } from "../components/Scanner";
import { VerticalSpacer } from "../components/Spacer";
import { Logo } from "../components/Logo";
import { FullWidth } from "../components/FullWidth";
import { CartItem } from "../components/CartItem";

import { getProduct, createSession, createOrder } from "../utils/api";
import { sizes } from "../utils/theme";

const ScannerModal = styled.div`
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
`;

const toOderLine = ({ name, price, serial, imageUrl }) => ({
  type: "physical",
  reference: serial,
  image_url: imageUrl,
  name,
  quantity: 1,
  unit_price: price,
  tax_rate: 0,
  total_amount: price,
  total_discount_amount: 0,
  total_tax_amount: 0
});

const baseUrl = `${window.location.protocol}/${window.location.host}`;

export const ShoppingPage = () => {
  const [status, setStatus] = React.useState("base");
  const [products, setProducts] = React.useState([]);
  const [orderId, setOrderId] = React.useState("");
  const [widgetLoaded, setWidgetLoaded] = React.useState(false);

  const startScanning = React.useCallback(() => {
    setStatus("scanning");
  }, [setStatus]);

  const stopScanning = React.useCallback(() => {
    setStatus("base");
  }, [setStatus]);

  const handleScanResult = React.useCallback(
    async result => {
      const serial = result.getText();
      const response = await getProduct(serial);
      setProducts(p => p.concat(response.data));
      setStatus("base");
    },
    [setStatus, setProducts]
  );

  const pay = React.useCallback(async () => {
    setStatus("paying");
    const response = await createSession({
      order_lines: products.map(toOderLine)
    });
    const { client_token } = response.data;
    const Klarna = window.Klarna;
    Klarna.Payments.init({
      client_token
    });

    Klarna.Payments.load(
      {
        container: "#klarna-payments-container",
        payment_method_category: "pay_later"
      },
      res => {
        setWidgetLoaded(true);
      }
    );
  }, [setStatus, products]);

  const showQrCode = React.useCallback(() => {
    setStatus("qrCode");
  }, [setStatus]);

  const closeQrCode = React.useCallback(() => {
    setStatus("completed");
  }, [setStatus]);

  const authorize = React.useCallback(async () => {
    const Klarna = window.Klarna;
    Klarna.Payments.authorize(
      {
        payment_method_category: "pay_later",
        auto_finalize: true
      },
      async ({ authorization_token }) => {
        const response = await createOrder({
          authorization_token,
          order_lines: products.map(toOderLine)
        });
        setOrderId(response.data.order_id);
        setStatus("completed");
      }
    );
  }, [setStatus, setOrderId, products]);

  return (
    <Container>
      {status === "base" && (
        <>
          <FullWidth>
            <Logo />
            <Title
              onClick={() => handleScanResult({ getText: () => Math.random() })}
            >
              Shopping Cart
            </Title>

            {products.length === 0 && (
              <p
                style={{
                  paddingTop: 50,
                  paddingBottom: 50,
                  flex: 1
                }}
              >
                Start scanning to add products to your shopping cart
              </p>
            )}
            {products.length > 0 && (
              <div>
                {products.map(({ serial, ...rest }) => (
                  <CartItem key={serial} {...rest} />
                ))}
              </div>
            )}
          </FullWidth>

          <FullWidth>
            <Button onClick={startScanning}>Scan Barcode</Button>
            <VerticalSpacer size="s" />
            <Button onClick={pay} disabled={products.length < 1}>
              Pay with Klarna
            </Button>
          </FullWidth>
        </>
      )}

      {status === "scanning" && (
        <>
          <FullWidth>
            <Logo />
            <Title>Scan Product</Title>
            <Scanner onScanResult={handleScanResult} />
            <p
              style={{
                paddingTop: 50
              }}
            >
              Item will automatically be added to cart once serial is detected.
              <div
                style={{
                  textDecoration: "underline",
                  fontSize: "10px",
                  paddingTop: `${sizes.m}px`,
                  cursor: "pointer"
                }}
                onClick={() =>
                  handleScanResult({
                    getText: () =>
                      Math.random()
                        .toString()
                        .substr(2)
                  })
                }
              >
                or add demo product
              </div>
            </p>
          </FullWidth>
          <Button onClick={stopScanning}>Close</Button>
        </>
      )}

      {status === "paying" && (
        <>
          <FullWidth>
            <Logo />
            <Title>Pay with Klarna</Title>
            <div
              id="klarna-payments-container"
              style={{
                paddingTop: `${sizes.l}px`
              }}
            ></div>
          </FullWidth>
          <Button onClick={authorize} disabled={!widgetLoaded}>
            Continue
          </Button>
        </>
      )}

      {status === "completed" && (
        <>
          <FullWidth>
            <Logo />
            <Title>Payment completed</Title>
            <VerticalSpacer size="l" />
            <span
              role="img"
              aria-label="party popper"
              style={{ fontSize: "125px", display: "block" }}
            >
              🎉
            </span>
          </FullWidth>
          <p>Bring your items to a counter for de-tagging</p>
          <FullWidth>
            {products.map(({ serial, ...rest }) => (
              <CartItem key={serial} variant="small" {...rest} />
            ))}
          </FullWidth>
          <Button onClick={showQrCode}>Show QR code to Salesperson</Button>
        </>
      )}

      {status === "qrCode" && (
        <>
          <div>
            <Logo />
            <Title>Show to Salesperson</Title>
          </div>
          <QrCode url={`${baseUrl}/verify/${orderId}`} />
          <p>Scan to verify purchase</p>
          <Button onClick={closeQrCode}>Close</Button>
        </>
      )}
    </Container>
  );
};
