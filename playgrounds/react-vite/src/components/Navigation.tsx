import { useNavigate, useLocation } from "react-router";
import { ROUTES } from "../lib/routes";
import { Button } from "@0xsequence/design-system2";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex gap-3 flex-row bg-background-backdrop p-3 rounded-xl">
      {Object.values(ROUTES).map(({ label, path }) => (
        <Button
          variant={location.pathname === `/${path}` ? "primary" : "secondary"}
          key={path}
          onClick={() => navigate(`/${path}`)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
