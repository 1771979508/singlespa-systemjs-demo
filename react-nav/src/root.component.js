import React from "react";
import { BrowserRouter, Link } from 'react-router-dom';

export default function Root(props) {
  return <BrowserRouter>
    <div>
      <Link to="/">@single-spa/welcome</Link><br />
      <Link to="/react-app">react-app</Link><br />
      <Link to="/app1">app1</Link><br />
      <Link to="/vue-app">vue-app</Link><br />
    </div>
  </BrowserRouter>
}
