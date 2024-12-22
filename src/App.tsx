import './App.css'
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


function App() {
  // script things here

  return (
    <>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Explore the Big Outdoors
      </h1>
      <Badge variant="outline">Twinkle Twinkle little staer</Badge>
      <div className="flex w-full mx-auto max-w-md">
        <Input type="text" placeholder="topic" />
        <Button type="submit">Search</Button>
      </div>
    </>
  )
}

export default App
