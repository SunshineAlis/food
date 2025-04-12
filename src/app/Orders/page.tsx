"use client";

import Left from "../components/Left";
import OrderList from "../components/OrderList/OrderList";

export default function Page() {
    return (
        <div className="p-4 flex w-[100%] m-auto max-w-[1200px]">
            <Left />
            <div className="w-[100%]">
                <OrderList />
            </div>
        </div>
    );
}
