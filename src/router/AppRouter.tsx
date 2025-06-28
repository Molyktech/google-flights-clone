import { lazy, Suspense } from "react";
import { CircularProgress, useTheme } from "@mui/material";

import { BrowserRouter, Route, Routes } from "react-router-dom";
const Navbar = lazy(() => import("../components/public/Navbar"));
const Footer = lazy(() => import("../components/public/Footer"));
const Home = lazy(() => import("../pages/Home"));
// const FlightsList = lazy(() => import("../pages/FlightsList"));
// const NotFoundComp = lazy(() => import("../pages/NotFoundComp"));

const AppRouter = () => {
  const theme = useTheme();
  return (
    <BrowserRouter>
      <Suspense fallback={<CircularProgress />}>
        <div className="app-layout" style={{ backgroundColor: theme.palette.background.default }}>
          <Navbar />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/flights" element={<FlightsList />} />
                    <Route path="*" element={<NotFoundComp />} /> */}
            </Routes>
          </div>
          <Footer />
        </div>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
