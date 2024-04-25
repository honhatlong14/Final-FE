const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    mode: 'jit',
    // cmt to fix error while using material tailwind
    // purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    theme: {
        screens: {
            sm: '440px',

            md: '547px',

            lg: '768px',

            xl: '1024px',

            '2xl': '1680px',
        },
        extend: {
            colors: {
                primary: '#2FA130',
                secondary: '#190e34',
                background: '#dcdcdc',
                white: '#ffffff',
                grey: '#1A252F',
                orange: '#eb4034',
                purple: '#190e34',
            },
            spacing: {
                '50px': '50px',
            },
        },
    },
    plugins: [require('tailwind-scrollbar-hide')],
});
