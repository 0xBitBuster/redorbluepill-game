import Link from "next/link";

export default function Footer() {
    return (
        <div className="fixed z-10 bottom-2 right-8 flex space-x-2 text-xs text-transparent font-vt">
            <Link href="/legal/imprint">Imprint</Link>
            <Link href="/legal/privacy-policy">Privacy Policy</Link>
        </div>
    );
}
