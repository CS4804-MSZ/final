export default function Page() {
    const myHTML = `

        <h1>Hello, world!</h1><p>Some paragraph text</p>

    `;


    return <div dangerouslySetInnerHTML={{ __html: myHTML }} />;
}