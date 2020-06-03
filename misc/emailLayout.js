module.exports = function emailLook(secretToken) {
    const html = `<h1>Dzień dobry</h1><br>
    <p>Dziekujemy za rejestracje<p></br></br>
    <p>Proszę zweryfikuj swój email wpisując następujący kod:
    <br>
    <h2><b>${secretToken}<b></h2>
    <br>
    <p>Na następującej stronie:</p>
    <b><a href="http://localhost:3000/verify">http://localhost:3000/verify</a></b>
    <br><br>
    <p>Milego dnia</p>
    `;
    return html
}