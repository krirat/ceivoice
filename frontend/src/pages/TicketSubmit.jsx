import Navbar from "@/components/navbar.jsx";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function TicketSubmit() {
  const [problem, setProblem] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); 

  useEffect(() => {
    const decodedToken = jwtDecode(localStorage.getItem('auth_token'));
    const userEmail = decodedToken.email;
    setEmail(userEmail);
  },[])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); 

    try {
      const token = localStorage.getItem("auth_token");

      const res = await fetch("http://localhost:5001/api/ollama", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ problem }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Draft ticket created!");
        setProblem("");
        setEmail("");
      } else {
        alert("Failed to create ticket");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred while submitting the ticket.");
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      <Navbar title="Ticket Submit" />
      <div className="flex h-screen bg-black/20 items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Submit request</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-left"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    className="min-h-30 text-left"
                    required
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

              </div>

              <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}