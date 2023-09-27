import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/components/Layout";
import { shuffleArray } from "@/utils/shuffle";
import { awaitTimeout } from "@/utils/timeout";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

export default function Play({ allChoices }) {
    const [shuffledChoices, setShuffledChoices] = useState([]);
    const [choice, setChoice] = useState(null);
    const [choicesMade, setChoicesMade] = useState([]);
    const [bounceOr, setBounceOr] = useState(false);
    const [showingRedChoice, setShowingRedChoice] = useState(true);
    const [showingBlueChoice, setShowingBlueChoice] = useState(true);
    const [showingStatistics, setShowingStatistics] = useState(false);
    const [speakingEnabled, setSpeakingEnabled] = useState(true)
    const [speak, setSpeak] = useState("")
    const router = useRouter();

    const makeChoice = async (id, color) => {
        if (!showingRedChoice || !showingBlueChoice || showingStatistics) return;
        
        setShowingRedChoice(false);
        setShowingBlueChoice(false);
        await awaitTimeout(300);

        setShowingStatistics(true);
        setChoicesMade([...choicesMade, [id, color]]);
        const newShuffledChoices = shuffledChoices.slice(0, shuffledChoices.length - 1)
        setShuffledChoices(newShuffledChoices);
        await awaitTimeout(1500);

        setShowingStatistics(false);
        await awaitTimeout(300);

        setSpeak(newShuffledChoices[newShuffledChoices.length - 1]?.red?.text);
        setShowingRedChoice(true);
        await awaitTimeout(1250);

        setSpeak("or");
        setBounceOr(true);
        await awaitTimeout(300);

        setBounceOr(false);
        await awaitTimeout(950);

        setSpeak(newShuffledChoices[newShuffledChoices.length - 1]?.blue?.text);
        setBounceOr(false);
        setShowingBlueChoice(true);

        if (choicesMade.length === 5) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_CLIENT_BACKEND_URL}/api/choices`, {
                    method: "PUT",
                    body: JSON.stringify({ choices: choicesMade }),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
            } catch (_) {}

            setChoicesMade([]);
        }
    };

    const toggleSpeakingEnabled = () => {
        localStorage.setItem("speaking", !speakingEnabled)
        setSpeakingEnabled(!speakingEnabled)
    }

    useEffect(() => {
        const savedSpeaking = localStorage.getItem("speaking")

        if (savedSpeaking === null) setSpeakingEnabled(true);
        else setSpeakingEnabled(savedSpeaking)
    }, [])

    useEffect(() => {
        if (!speak || !speakingEnabled) return;

        const utterance = new window.SpeechSynthesisUtterance(speak);
        utterance.lang = "en-US"
        window.speechSynthesis.speak(utterance)
    }, [speak])

    useEffect(() => {
        setShuffledChoices(shuffleArray(allChoices));
    }, [allChoices]);

    useEffect(() => {
        setChoice(shuffledChoices[shuffledChoices.length - 1]);
    }, [shuffledChoices]);

    return (
        <Layout>
            <NextSeo title="Red or Blue Pill - The Game" description="Embrace the Game of Choices. Red or Blue, Choose Your Reality." noindex />

            <div className="flex flex-col md:flex-row w-screen h-screen font-sulphur overflow-x-hidden">
                {shuffledChoices.length > 0 ? (
                    <>
                        <div className={`relative flex justify-center items-center md:w-1/2 h-full`} onClick={() => makeChoice(choice?._id, "r")}>
                            <div
                                className={`absolute inset-0 flex justify-center items-center p-6 md:p-16 lg:p-24 group ${
                                    showingRedChoice ? "scale-100 cursor-pointer" : "scale-0 cursor-default"
                                } duration-300`}
                            >
                                <div className="max-w-[15rem] md:max-w-3xl text-center group">
                                    {choice?.red?.image ? (
                                        <Image
                                            src={choice.red.image}
                                            alt=""
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+G9o+B8ABfUCYYcq91QAAAAASUVORK5CYII="
                                            priority
                                            width={800}
                                            height={600}
                                            className="group-hover:scale-105 duration-300 mb-3 md:mb-8 rounded-md glow-img__red"
                                        />
                                    ) : null}
                                    <h2
                                        className={`glow-textshadow__red ${
                                            choice?.red?.image ? "text-xl md:text-2xl lg:text-3xl" : "text-2xl md:text-3xl lg:text-4xl group-hover:scale-105"
                                        } duration-300`}
                                    >
                                        {choice?.red?.text}
                                    </h2>
                                </div>
                            </div>
                            <div
                                className={`absolute inset-0 flex justify-center items-center p-6 md:p-16 lg:p-24 group cursor-default ${
                                    showingStatistics ? "scale-100" : "scale-0"
                                } duration-300`}
                            >
                                <h1 className="text-2xl md:text-3xl glow-textshadow__red">{choice?.red?.percentage}%</h1>
                            </div>
                            {choice?.red?.image && showingRedChoice ? (
                                <Link
                                    href={choice.red.link}
                                    target="_blank"
                                    className="absolute top-2 md:top-auto md:bottom-2 left-3 text-xs text-transparent underline"
                                >
                                    Image: {choice.red.author}
                                </Link>
                            ) : null}
                        </div>
                        <div className="relative">
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-5 w-full md:w-0.5 h-0.5 md:h-full"></div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                <h2
                                    className={`text-black bg-white text-xl md:text-2xl lg:text-3xl ${
                                        bounceOr ? "w-16 md:w-20 lg:w-24 h-16 md:h-20 lg:h-24" : "w-12 md:w-16 lg:w-20 h-12 md:h-16 lg:h-20"
                                    } duration-200 rounded-full flex items-center justify-center cursor-default select-none`}
                                >
                                    OR
                                </h2>
                            </div>
                        </div>
                        <div className="relative flex justify-center items-center md:w-1/2 h-full" onClick={() => makeChoice(choice?._id, "b")}>
                            <div
                                className={`absolute inset-0 flex justify-center items-center p-6 md:p-16 lg:p-24 group ${
                                    showingBlueChoice ? "scale-100 cursor-pointer" : "scale-0 cursor-default"
                                } duration-300`}
                            >
                                <div className="max-w-[15rem] md:max-w-3xl text-center group">
                                    {choice?.blue?.image ? (
                                        <Image
                                            src={choice.blue.image}
                                            alt=""
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjsHj8/z8ABosDGjkxbUoAAAAASUVORK5CYII="
                                            priority
                                            width={800}
                                            height={600}
                                            className="group-hover:scale-105 duration-300 mb-3 md:mb-8 rounded-md glow-img__blue"
                                        />
                                    ) : null}
                                    <h2
                                        className={`glow-textshadow__blue ${
                                            choice?.blue?.image ? "text-xl md:text-2xl lg:text-3xl" : "text-2xl md:text-3xl lg:text-4xl group-hover:scale-105"
                                        } duration-300`}
                                    >
                                        {choice?.blue?.text}
                                    </h2>
                                </div>
                            </div>
                            <div
                                className={`absolute inset-0 flex justify-center items-center p-6 md:p-16 lg:p-24 group cursor-default ${
                                    showingStatistics ? "scale-100" : "scale-0"
                                } duration-300`}
                            >
                                <h1 className="text-2xl md:text-3xl glow-textshadow__blue">{choice?.blue?.percentage}%</h1>
                            </div>
                            {choice?.blue?.image && showingBlueChoice ? (
                                <Link href={choice.blue.link} target="_blank" className="absolute bottom-2 right-3 text-xs text-transparent underline">
                                    Image: {choice.blue.author}
                                </Link>
                            ) : null}
                        </div>
                        <div className="absolute bottom-3 left-3 md:left-1/2 transform md:-translate-x-1/2 z-10">
                            <button className={`p-2 md:p-3 w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 outline-none ${speakingEnabled ? 'bg-green' : 'bg-[#333]'} rounded-full`} onClick={toggleSpeakingEnabled}>
                                {speakingEnabled ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.3 640 165.8 640 256s-41.5 170.8-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>
                                )}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center px-8">
                        <h1 className="text-2xl md:text-4xl text-center mb-4">
                            No more red or blue pills left. <br />
                            Thanks for playing.
                        </h1>
                        <button onClick={router.reload} className="bg-white bg-opacity-5 px-3 py-1.5 text-white rounded-sm animate-pulse mb-4">
                            Play again
                        </button>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export async function getStaticProps() {
    let allChoices = [];

    try {
        const data = await fetch(`${process.env.SERVER_BACKEND_URL}/api/choices`);
        const res = await data.json();

        allChoices = res.choices.map((choice) => {
            const sum = choice.red.count + choice.blue.count;
            choice.red.percentage = Math.round((choice.red.count / sum) * 100);
            choice.blue.percentage = Math.round((choice.blue.count / sum) * 100);

            return choice;
        });
    } catch (_) {
        return {
            props: {
                allChoices,
            },
            revalidate: 5,
        };
    }

    return {
        props: {
            allChoices,
        },
        revalidate: 300,
    };
}
