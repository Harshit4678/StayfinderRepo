import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import "./index.css"; // Assuming you have some global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="292830585284-steov016q60ngjvaqqoknst39qr9l4md.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
