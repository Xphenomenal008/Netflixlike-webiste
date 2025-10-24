import { render, screen } from "@testing-library/react";
import App from "../App.jsx";

test("renders loader SVG", () => {
  render(<App />);
  const loader = document.querySelector(".lucide-loader");
  expect(loader).toBeInTheDocument();
});


