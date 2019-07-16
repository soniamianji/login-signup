import React from "react";

const SignUpForm = ({ onSubmit, onChange, errors, user }) => (
  <div className="container mx-auto text-center">
    <form onSubmit={onSubmit} className="form-signin">
      <h1 className="h3 mb-3 font-weight-normal">Register an account</h1>
      <input
        type="name"
        name="name"
        onChange={onChange}
        id="inputFullName"
        className="form-control w-50 mb-2 mx-auto"
        placeholder="Full Name"
        value={user.name}
        required
      />

      <input
        type="email"
        name="email"
        onChange={onChange}
        id="inputEmail"
        className="form-control w-50 mb-2 mx-auto"
        placeholder="Email address"
        value={user.email}
        required
      />
      <input
        type="password"
        name="password"
        onChange={onChange}
        id="inputPassword"
        className="form-control w-50 mb-2 mx-auto"
        placeholder="Password"
        value={user.password}
        required
      />
      <button
        className="btn btn-lg btn-dark btn-block w-50 mb-2 mx-auto"
        type="submit"
      >
        Create an account
      </button>
    </form>
  </div>
);

export default SignUpForm;
