import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import FormCard from "../ui/FormCard";
import Button from "react-bootstrap/Button";
import makeRequest from "../../utils/helper";

const LoginPage = () => {
  const [email, setEmail] = React.useState("kp@unsw.com");
  const [pwd, setPwd] = React.useState("kp");

  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  let navigate = useNavigate();

  const loginBtn = async () => {
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
    const body = {
      email: email,
      password: pwd,
    };
    await makeRequest(
      "/user/auth/login",
      "POST",
      errorCtx,
      (data) => {
        userCtx.setUser({
          email: email,
          token: data.token,
        });
        navigate("/listing/my");
      },
      body
    );
  };

  return (
    <FormCard>
      <div>
        <div className="mb-3">
          <label htmlFor="loginEmail" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="loginEmail"
            aria-describedby="emailHelp"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="loginPassword" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="loginPassword"
            onChange={(event) => setPwd(event.target.value)}
          />
        </div>
        <Button id="loginUserBtn" variant="primary" onClick={loginBtn}>
          Submit
        </Button>
      </div>
    </FormCard>
  );
};
export default LoginPage;
