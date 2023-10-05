import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../store/user-context";
import FormCard from "../ui/FormCard";
import Button from "react-bootstrap/Button";
import makeRequest from "../../utils/helper";
import ErrorContext from "../error/ErrorContext";

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [name, setName] = useState("");

  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  let navigate = useNavigate();

  const registerBtn = async () => {
    if (!email || email.length==0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please enter an non-empty email!");
      return;
    }

    if (!pwd || pwd.length==0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please enter a password!");
      return;
    }

    if (pwd != confirmPwd) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("The passwords don't match!");
      return;
    }

    if (!name || name.length == 0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Plase enter your name!");
      return;
    }

    const body = {
      email: email,
      password: pwd,
      name: name,
    };
    await makeRequest(
      "/user/auth/register",
      "POST",
      errorCtx,
      (data) => {
        userCtx.setUser({
          email: email,
          token: data.token,
          name: name,
        });
        navigate("/");
      },
      body
    );
  };

  return (
    <FormCard>
      <div>
        <div className="mb-3">
          <label htmlFor="registerEmail" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="registerEmail"
            aria-describedby="emailHelp"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="registerPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="registerPassword"
            onChange={(event) => setPwd(event.target.value)}
          />
          <label htmlFor="registerConfirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            type="password"
            className="form-control"
            id="registerConfirmPassword"
            onChange={(event) => setConfirmPwd(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="registerName" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="registerName"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <Button id = "registerUserBtn" variant="primary" onClick={registerBtn}>
          Submit
        </Button>
      </div>
    </FormCard>
  );
};

export default RegisterPage;
