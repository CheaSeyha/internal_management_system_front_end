import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <CardTitle className="text-6xl font-bold text-destructive">
            404
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Oops! The page you’re looking for doesn’t exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Invalid path:{" "}
            <span className="font-mono break-all text-foreground">
              {location.pathname}
            </span>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              Go Back
            </Button>
            <Button onClick={() => navigate("/")} className="w-full sm:w-auto">
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
