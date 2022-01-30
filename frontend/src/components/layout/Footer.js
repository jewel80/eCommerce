import React, { Fragment } from "react";

const Footer = () => {
  const CurrentYear = (new Date().getFullYear());
  return (
    <Fragment>
      <footer className="py-1">
        <p className="text-center mt-1">
          JS Shopping Cart - 2021-{CurrentYear}, &copy;All Rights Reserved
        </p>
      </footer>
    </Fragment>
  );
};

export default Footer;
