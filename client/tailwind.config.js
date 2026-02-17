/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0ea5e9', // Sky Blue (Medical/Clean) - Replacement for Teal if needed, but sticking to requested 'Orthoc' style
                // Orthoc Style Green/Teal
                orthoGreen: '#3bb19b', // Main Green
                orthoDark: '#1f2937',   // Dark Text
                orthoLight: '#f3f4f6'   // Light BG
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
