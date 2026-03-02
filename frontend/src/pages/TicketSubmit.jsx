


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

export default function TicketSubmit() {
  return (
    <div className="flex h-screen bg-black/20 items-center justify-center">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Submit request</CardTitle>
      </CardHeader>

      <CardContent>
        <form>
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
              />
            </div>

          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </CardFooter>
    </Card>
    </div>
  )
}
