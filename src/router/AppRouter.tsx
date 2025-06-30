import { lazy, Suspense } from "react";
import { useTheme } from "@mui/material";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageLoader from "../components/public/PageLoader";
const Navbar = lazy(() => import("../components/public/Navbar"));
const Footer = lazy(() => import("../components/public/Footer"));
const Home = lazy(() => import("../pages/Home"));
const Search = lazy(() => import("../pages/Search"));
const NotFound = lazy(() => import("../components/public/NotFound"));

const AppRouter = () => {
  const theme = useTheme();
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <div className="app-layout" style={{ backgroundColor: theme.palette.background.default }}>
          <Navbar />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
