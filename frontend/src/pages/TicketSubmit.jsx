

import Navbar from "@/components/navbar.jsx";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";

export default function TicketSubmit() {

  const [problem, setProblem] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

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
    } else {
      alert("Failed to create ticket");
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
                className="text-left"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="min-h-[120px] text-left"
                required
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
              />
            </div>

          </div>

          <Button type="submit" className="w-full mt-4">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
    </div>
    </>
  )
}
