import { lazy, useContext, useEffect, useReducer, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Layout1 from "../layout/Layout1";

//Route Pages

const Home = lazy(() => import("../pages/Dashboard"));

function useCompanyRoute() {


  //const WithProtection=(Component, title)=>withApplicationStatus(withSubscription(Component, title))
  // const WithProtection=(Component, title)=>withSubscription(Component, title)
  return (
    <>
      {true ? (
        <main className="h-screen w-screen relative flex overflow-hidden"
          style={{
            background: `linear-gradient(to bottom, #36460A 10%, #000000 40%)`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>

          <Routes>
            <Route path="/" element={<Layout1 />} >
              <Route path="/home" element={<Home />} />
              <Route path="/*" element={<div className="flex items-center justify-center text-3xl text-white">Page</div>} />
            </Route>
          </Routes>


        </main>
      ) : (
        <Navigate to={"/login"} replace />
      )}
    </>
  );
}

export default useCompanyRoute;
