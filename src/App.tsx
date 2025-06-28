import "./App.css";
import { ThemeContextProvider } from "./context/ThemeContext.tsx";
import AppRouter from "./router/AppRouter.tsx";

function App() {
  return (
    <ThemeContextProvider>
      <AppRouter />
    </ThemeContextProvider>
  );
}

export default App;
