import { render, screen } from "@testing-library/react";

function PortfolioHeading() {
  return <h1>DevSecOps Portfolio</h1>;
}

describe("Portfolio frontend", () => {
  it("displays the portfolio title", () => {
    render(<PortfolioHeading />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "DevSecOps Portfolio",
      })
    ).toBeInTheDocument();
  });
});