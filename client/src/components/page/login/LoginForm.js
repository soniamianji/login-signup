import React from "react";

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  user,
  renderRedirect
}) => (
  <div className="container mx-auto pt-3 ">
    <form onSubmit={onSubmit} className="form-signin mx-auto d-felx">
      <h1 className="h3 mb-3 text-center font-weight-normal">Please Login</h1>
      <div className="text-danger text-center">{errors.message}</div>
      <input
        type="email"
        onChange={onChange}
        value={user.email}
        name="email"
        id="inputEmail"
        className="form-control w-50 mb-2 mx-auto"
        placeholder="Email address"
        required=""
      />
      <div>{errors.password}</div>
      <input
        type="password"
        name="password"
        onChange={onChange}
        value={user.password}
        id="inputPassword"
        className="form-control w-50 mb-2 mx-auto"
        placeholder="Password"
        required=""
      />

      <button
        className="btn btn-lg btn-dark btn-block w-50 mx-auto"
        type="submit"
      >
        Login
      </button>
    </form>

    <button
      onClick={renderRedirect}
      className="btn btn-lg btn-dark btn-block w-50 mt-2 mx-auto "
      type="submit"
    >
      Create an account
    </button>
  </div>
);

export default LoginForm;
