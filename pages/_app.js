import '../styles.css'


// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
console.log("pages/_app.js: ctor");

return <Component {...pageProps} />
console.log("pages/_app.js: ctor finshed");
}