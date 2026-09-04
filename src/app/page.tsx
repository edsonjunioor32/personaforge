"use client";

import { Header } from "@/components/pf/header";
import { Hero } from "@/components/pf/hero";
import { Marquee } from "@/components/pf/marquee";
import { HowItWorks } from "@/components/pf/how-it-works";
import { Studio } from "@/components/pf/studio/studio";
import { Library } from "@/components/pf/library/library";
import { Chat } from "@/components/pf/chat/chat";
import { Footer } from "@/components/pf/footer";
import { useBuilder } from "@/lib/persona/store/builder";

export default function Home() {
  const view = useBuilder((s) => s.view);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Marquee />
        <HowItWorks />
        {view === "studio" && <Studio />}
        {view === "library" && <Library />}
        {view === "chat" && <Chat />}
      </main>
      <Footer />
    </div>
  );
}
