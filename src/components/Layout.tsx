import React from "react";
import Navbar from "./Navbar";
import {Outlet} from "react-router-dom";

export default function Layout() {
  // <Outlet /> is for react router to place nested/child routes
  return (
    <div className="h-screen">
      <Navbar />
      <div className=" h-full text-lg">
        <Outlet />
      </div>
    </div>
  );
}
