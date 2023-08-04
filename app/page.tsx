import Loading from "@/components/dom/Loading";
import Scene from "@/components/canvas/Scene";
import { Suspense } from "react";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <Scene />
        </main>
    );
}
