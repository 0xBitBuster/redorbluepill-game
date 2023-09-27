import { Sulphur_Point, VT323 } from 'next/font/google'

const sulphurFont = Sulphur_Point({ 
    weight: ['300', '400', '700'],
    subsets: ['latin'],
    variable: '--font-sulphur'
})

const vtFont = VT323({ 
    weight: ['400'],
    subsets: ['latin'],
    variable: '--font-vt'
})

function Layout({ children }) {
    return (
        <main className={`overflow-x-hidden ${sulphurFont.variable} ${vtFont.variable}`}>
            {children}
        </main>
    );
}

export default Layout;
