"use client";
import { useState, useEffect } from "react";
import axios from "axios";

import Foods from "@/app/components/Foods";
import Left from "../../components/Left";

export default function Page() {
    return (
        <div className="p-4 flex w-[100%] m-auto max-w-[1200px]">
            <Left />
            <div>

                <Foods />
            </div>
        </div>
    );
}
