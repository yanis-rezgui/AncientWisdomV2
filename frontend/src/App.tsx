import "./App.css";


import AppProviders from "./providers/AppProviders";
import ScrollToTop from "./ScrollToTop";

import AppRoutes from "./Routes/AppRoutes";

function App() {
  return (
    <AppProviders>
       
       <ScrollToTop/>
       <AppRoutes/>
    </AppProviders>
  );
}

export default App;