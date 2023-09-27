import Link from "next/link";
import Layout from "@/components/Layout";
import Footer from "@/components/Footer";
import { NextSeo } from 'next-seo';

export default function Home() {
    return (
        <Layout>
            <NextSeo
                title="Red or Blue Pill - The Game"
                description="Embrace the Game of Choices. Red or Blue, Choose Your Reality."
            />

            <div className="relative w-screen h-screen font-vt text-center px-4">
                <div className="h-full flex flex-col items-center justify-center">
                    <h1 className="text-6xl md:text-7xl font-bold mb-10">
                        <span className="glow-text__grey text-5xl md:text-6xl">THE</span><br />
                        <span className="glow-text__red">RED</span> <span className="glow-text__white">OR</span> <span className="glow-text__blue">BLUE</span><br />
                        <span className="glow-text__grey text-5xl md:text-6xl">PILL GAME</span>
                    </h1>
                    <p className="text-3xl md:text-4xl mb-12">Embrace the Game of Choices. Red or Blue, <br /> Choose Your Reality.</p>
                    <Link href="/play" className="glow-btn__red px-8 py-3 text-4xl md:text-5xl text-white rounded-sm duration-300 animate-pulse">Play</Link>
                </div>
                <Footer />
            </div>
        </Layout>
    );
}
