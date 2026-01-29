"use client";

import { Header } from "@/components/layout";
import { Button, Input, Card } from "@/components/ui";

export default function DesignSystemPage() {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans text-text-main pb-20">
      <Header userName="K. Miller" userRole="System" />

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-12">
        <h1 className="text-4xl font-serif text-black border-b border-black pb-4">
          Lindy Design System
        </h1>

        <section className="space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500">
            Typography
          </h2>
          <div className="space-y-4">
            <h1 className="text-6xl font-serif">Heading 1 (Serif)</h1>
            <h2 className="text-4xl font-serif">Heading 2 (Serif)</h2>
            <h3 className="text-2xl font-sans font-bold">Heading 3 (Sans)</h3>
            <p className="max-w-prose">
              Body text using Inter. Optimized for readability with generous
              line height and whitespace. The monochrome palette ensures focus
              remains on the content.
            </p>
            <p className="text-xs text-gray-400 font-mono">
              Monospace / Label / Caption
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <Button>Primary Action</Button>
            <Button variant="outline">Secondary Action</Button>
            <Button variant="ghost">Ghost Action</Button>
            <Button className="rounded-full px-6">Rounded</Button>
            <Button>
              <span className="material-symbols-outlined mr-2">add</span>
              With Icon
            </Button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500">
            Inputs & Forms
          </h2>
          <div className="max-w-md space-y-4">
            <Input placeholder="Standard Input" />
            <Input placeholder="With Label" type="email" />
            <Input placeholder="Disabled" disabled />
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-gray-500">
            Cards
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <Card title="Standard Card">
              <p className="text-gray-600">Minimalist container with border.</p>
            </Card>
            <Card
              title="Hover Effect"
              className="hover:shadow-lg transition-shadow cursor-pointer"
            >
              <p className="text-gray-600">Interactive card state.</p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
