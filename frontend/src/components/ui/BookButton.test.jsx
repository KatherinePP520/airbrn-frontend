import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookButton from "./BookButton";

describe("Book Button", () => {
  it("render button when logged in", () => {
    const loginFunc = jest.fn();
    const bookFunc = jest.fn();

    render(
      <BookButton
        isLoggedIn={true}
        login={loginFunc}
        submitBookHandler={bookFunc}
      />
    );
    expect(screen.getByRole("button", { name: "Book" })).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "Book" }));

    expect(bookFunc).toHaveBeenCalledTimes(1);
    expect(loginFunc).toHaveBeenCalledTimes(0);
  });

  it("render button when not logged in", () => {
    const loginFunc = jest.fn();
    const bookFunc = jest.fn();

    render(
      <BookButton
        isLoggedIn={false}
        login={loginFunc}
        submitBookHandler={bookFunc}
      />
    );
    expect(
      screen.getByRole("button", { name: "Log in to Book" })
    ).toBeInTheDocument();

    userEvent.click(screen.getByRole("button", { name: "Log in to Book" }));

    expect(bookFunc).toHaveBeenCalledTimes(0);
    expect(loginFunc).toHaveBeenCalledTimes(1);
  });
});
