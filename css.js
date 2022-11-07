const css = async () => {
  const res = `
body {
    color: #222;
    background: #fff;
    font: 100% system-ui;
}
@media (prefers-color-scheme: dark) {
    body {
        color: #eee;
        background: #121212;
    }
    body a {
        color: #809fff;
    }
}
.container{
    margin-left: 120px;
}
.page_header{
    padding-left:80px;
}
nav{
    margin-bottom: 20px;
}
input {
    margin-left: 40px;
    background-color: #fff;
    border: 2px solid #212121;
    width: 300px;
    height: 35px;
    border-radius: 4px;
    padding: 0 15px;
}
input:focus {
    background:#ffe54c;
}
input::placeholder {
    font-size: 16px;
    font-weight: bold;
    padding-top: 10px;
    color: #212121;
}
.app{
    margin-top: 20px;
    margin-left: 10%;
}
.button {
    margin-left: 15px;
    background: #fff;
    backface-visibility: hidden;
    border-radius: .375rem;
    border-style: solid;
    border-width: .125rem;
    box-sizing: border-box;
    color: #212121;
    cursor: pointer;
    display: inline-block;
    font-family: Circular,Helvetica,sans-serif;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -.01em;
    line-height: 1.3;
    padding: .875rem 1.125rem;
    position: relative;
    text-align: left;
    text-decoration: none;
    transform: translateZ(0) scale(1);
    transition: transform .2s;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}
.button:not(:disabled):hover {
    transform: scale(1.05);
    background-color:#ffe54c;
}
.button:not(:disabled):hover:active {
    transform: scale(1.05) translateY(.125rem);
}
.link:link {
    text-decoration: none;
}
.link:visited {
    text-decoration: none;
}
.link:hover {
    text-decoration: underline;
    background:#ffe54c;
}
.link:active {
    text-decoration: underline;
}
table{
    display:flex;
    flex-direction: column;
}
td{
    border: 1px solid;
    width: 150px;
    padding: 5px;
    text-align: left;
}`;
  return res;
};

module.exports = {
  css: css,
};