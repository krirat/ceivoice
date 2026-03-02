


// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export function CardDemo() {
//   return (
//     <Card className="w-full max-w-sm">
//       <CardHeader>
//         <CardTitle>Login to your account</CardTitle>
//         <CardDescription>
//           Enter your email below to login to your account
//         </CardDescription>
//         <CardAction>
//           <Button variant="link">Sign Up</Button>
//         </CardAction>
//       </CardHeader>
//       <CardContent>
//         <form>
//           <div className="flex flex-col gap-6">
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="m@example.com"
//                 required
//               />
//             </div>
//             <div className="grid gap-2">
//               <div className="flex items-center">
//                 <Label htmlFor="password">Password</Label>
//                 <a
//                   href="#"
//                   className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                 >
//                   Forgot your password?
//                 </a>
//               </div>
//               <Input id="password" type="password" required />
//             </div>
//           </div>
//         </form>
//       </CardContent>
//       <CardFooter className="flex-col gap-2">
//         <Button type="submit" className="w-full">
//           Login
//         </Button>
//         <Button variant="outline" className="w-full">
//           Login with Google
//         </Button>
//       </CardFooter>
//     </Card>
//   )
// }


import { useState } from "react";

const TicketSubmit = () => {
  const [problem, setProblem] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5001/api/ollama", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit a Ticket</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe your issue..."
          className="w-full border p-3 rounded"
          rows="5"
          required
        />

        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded"
        >
          Submit Ticket
        </button>
      </form>
    </div>
  );
};

export default TicketSubmit;