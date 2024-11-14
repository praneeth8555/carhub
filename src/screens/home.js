import React from "react";
import Navbar from "../components/navbar";
import MyCars from "../components/MyCars";

export default function Home() {
    return (
        <>
            <div>
                <Navbar  />
            </div>
            <div>
                <MyCars/>
            </div>
           
        </>
    );
}
