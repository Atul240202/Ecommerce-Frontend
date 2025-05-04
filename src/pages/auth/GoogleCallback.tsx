import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const credential = params.get("id_token");

    if (!credential) {
      navigate("/register");
      return;
    }

    const payload = JSON.parse(atob(credential.split(".")[1]));
    const googleUser = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      fullName: payload.name,
      googleId: payload.sub,
      idToken: credential,
    };

    const authenticate = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(googleUser),
        });

        const data = await res.json();

        if (res.status === 202 && data.needsPhone) {
          window.opener?.postMessage(
            {
              type: "oauth_callback",
              redirectTo: "/register/google",
              tempData: data.tempData,
            },
            window.location.origin
          );
          window.close();
          return;
        }

        if (!res.ok)
          throw new Error(data.message || "Google authentication failed");

        window.opener?.postMessage(
          {
            type: "oauth_callback",
            token: data.token,
            user: data.user,
          },
          window.location.origin
        );

        window.close();
      } catch (err: any) {
        console.error("Google OAuth failed:", err.message);
        navigate("/register");
      }
    };

    authenticate();
  }, [navigate]);

  return <p className="text-center mt-20">Finalizing Google Login...</p>;
}
