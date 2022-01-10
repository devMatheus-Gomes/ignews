import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock("next/router");

jest.mock("next-auth/client", () => {
  return {
    useSession: () => [null, false],
  };
});

jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceId: "fake-price-ide", amount: "R$10,00" }} />);

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-value-id",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        // Verifica se existe no minímo essas propriedades no objeto
        props: {
          product: {
            priceId: 1000,
            amount: "$10.00",
          },
        },
      })
    );
  });
});
