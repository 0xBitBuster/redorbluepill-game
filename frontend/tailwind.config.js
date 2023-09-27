/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            fontFamily: {
                'sulphur': 'var(--font-sulphur)',
                'vt': 'var(--font-vt)'
            },
            colors: {
                'blue': '#38E3FF',
                'red': '#FF3131',
                'green': '#31FF8A',
                'transparent': 'hsla(0,0%,100%,.6)'
            }
        },
    }
};
