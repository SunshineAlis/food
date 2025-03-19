import * as React from "react";

const OrderIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    className={className} // You can still pass other classes here if needed
  >
    <path
      className="stroke-black hover:stroke-white" // Apply hover effect to path
      stroke="#09090B"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.167 15.584h3.666m0 0v-11h-11v11h2.75m8.25 0h.917m4.583 0h1.834v-3.062a3.67 3.67 0 0 0-1.073-2.594L17.417 8.25h-4.584m-3.666 7.792a2.292 2.292 0 1 1-4.584 0 2.292 2.292 0 0 1 4.584 0Zm9.166 0a2.292 2.292 0 1 1-4.583 0 2.292 2.292 0 0 1 4.583 0Z"
    />
  </svg>
);

export default OrderIcon;
