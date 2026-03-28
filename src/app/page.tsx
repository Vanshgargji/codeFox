import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      
      <Button>Hello World</Button>

      {/* 👇 Add this */}
      <div className="bg-primary text-primary-foreground p-6 rounded-xl">
        Theme Test Box
      </div>

    </div>
  );
}