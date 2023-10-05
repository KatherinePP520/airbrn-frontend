import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorModal from "./ErrorModal";

describe("Error Modal", () => {
  it("Modal show", () => {
    const closeFunc = jest.fn();
    const errorMessage = "There is an error";

    render(
      <ErrorModal
        show={true}
        handleClose={closeFunc}
        errorMessage={errorMessage}
      />
    );
    expect(screen.getByRole("dialog", { name: "" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: errorMessage })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(closeFunc).toHaveBeenCalledTimes(1);
  });

  it("Modal hide", () => {
    const closeFunc = jest.fn();
    const errorMessage = "There is an error";

    render(
      <ErrorModal
        show={false}
        handleClose={closeFunc}
        errorMessage={errorMessage}
      />
    );
    // const dialog = screen.getByRole("dialog", { name: "" });
    // expect(dialog).toBeNull();
    expect(screen.queryByText(errorMessage)).toBeNull();
    expect(screen.queryByText("Close")).toBeNull();
  });
});
