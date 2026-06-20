import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthWatcher() {
  const navigate = useNavigate();

  useEffect(() => {

    const handleStorageChange = (event) => {

      if (
        event.key === "token" &&
        !event.newValue
      ) {

        navigate("/login");
      }
    };

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );
    };

  }, [navigate]);

  return null;
}