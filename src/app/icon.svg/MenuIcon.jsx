import * as React from "react";

const MenuIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    className={props.className}
    {...props}
  >
    <path
      stroke="black" // Default stroke color
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 2.75H3.667a.917.917 0 0 0-.917.917v6.416c0 .507.41.917.917.917H8.25c.506 0 .917-.41.917-.917V3.667a.917.917 0 0 0-.917-.917ZM18.333 2.75H13.75a.917.917 0 0 0-.917.917v2.75c0 .506.41.916.917.916h4.583c.507 0 .917-.41.917-.916v-2.75a.917.917 0 0 0-.917-.917ZM18.333 11H13.75a.917.917 0 0 0-.917.917v6.416c0 .507.41.917.917.917h4.583c.507 0 .917-.41.917-.917v-6.416a.917.917 0 0 0-.917-.917ZM8.25 14.667H3.667a.917.917 0 0 0-.917.916v2.75c0 .507.41.917.917.917H8.25c.506 0 .917-.41.917-.917v-2.75a.917.917 0 0 0-.917-.916Z"
    />
  </svg>
);

export default MenuIcon;
