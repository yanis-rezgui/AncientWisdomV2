import "./App.css";

import PublicRoutes from "./Routes/PublicRoutes";
import AdminRoutes from "./Routes/AdminRoutes";
import AppProviders from "./providers/AppProviders";

function App() {
  return (
    <AppProviders>
      <PublicRoutes />
      <AdminRoutes />
    </AppProviders>
  );
}

export default App;