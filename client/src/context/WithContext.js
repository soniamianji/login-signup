import * as React from "react";
import { Context } from "./Context";
export function withContext(Component) {
  return function appComponent(props) {
    return (
      <Context.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </Context.Consumer>
    );
  };
}

