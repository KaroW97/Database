module.exports = function emailLook(secretToken) {
    const html = `
    <head>
<style type="text/css">
.main-div{
    width: 889px;
    height: 538px;
    margin:0 auto ;
    background: rgb(39, 39, 39);
    border-radius: 6px;
}
.imgStyle{
    width: 250px;
}
.sharedProp{
    margin: 0 auto;
    text-align: center;
    color:#c3aa5b;
    src: local('Robotor'), local('Roboto'), url(https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap) format('woff');
}
.header{
    margin-top:60px;
    font-weight: 600;
    font-size: 25px;
}
.paragraphs{  
    font-size:21px;
}
.paragrafFirst{
    margin-top:50px;
    line-height: 200%;
}
.paragrafTh>a{
    text-decoration:none;
    text-underline:none;
    color:#c3aa5b;
    text-decoration: none;
}
.paragrafSec{
    line-height: 200%;
}
.paragrafTh{
   
    line-height: 200%;
}
.footer{
    margin-top:50px;
    line-height: 200%;
}
</style>
</head>
<div class="main-div">
       
    <div style="margin: 0 auto; text-align: center;">
        <img class="imgStyle" src="cid:logo">
    </div>
    <h3 class="header sharedProp" >Dziękujemy za rejestracj&#281;!</h3>
    <p class="paragrafFirst sharedProp paragraphs" >Proszę zweryfikuj swoje konto za pomocą kodu:</p>
    <p class="paragrafSec sharedProp paragraphs">${secretToken}</p>
    <p class="paragrafTh sharedProp paragraphs"> Na stronie:<a href="http://localhost:3000/verify">http://localhost:3000/verify</a>  </p>
    <p class="footer sharedProp paragraphs">Miłego nia!</p>
</div>

    `;
    return html
} //<b><a href="https://beauty-base.herokuapp.com/verify">https://beauty-base.herokuapp.com/verify</a></b>