import "./App.css";

import PublicRoutes from "./Routes/PublicRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import AppProviders from "./providers/AppProviders";
import ScrollToTop from "./ScrollToTop";

function App() {
  return (
    <AppProviders>
      <ScrollToTop/>
      <PublicRoutes />
      <AdminRoutes />
    </AppProviders>
  );
}

export default App;