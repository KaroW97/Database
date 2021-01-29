
const emailLook = (secretToken='', header='',paragrafFirst='',paragrafTh='', link='', footer='')=>{
    const html =   `
    <head>
    <style type="text/css">
    @font-face {
        font-family: 'Montserrat';
        src: url('../public/font/Montserrat-Regular.ttf');
    }
    .main-div{
        width: 889px;
        height: 538px;
        margin:0 auto ;
        background:#e0f2f1 ;
        border-radius: 6px;
    }
    .imgStyle{
        margin-top:30px;
        width: 250px;
    }
    p{
        padding: 0 30px;
    }

    .sharedProp{
        font-family: 'Montserrat';
        text-decoration: none;
        margin: 0 auto;
        text-align: center;
        color:#ff8a80;
    }
    .sharedProp>a{
        text-underline:none;
        text-decoration: none;
        color:#ff8a80;
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
    }
    .paragrafSec,
    .paragrafFirst,
    .paragrafTh,
    .footer{
        line-height: 200%;
    }

    .footer{
        margin-top:50px;
    }
    </style>
    </head>
    <div class="main-div">
        
        <div style="margin: 0 auto; text-align: center;">
            <img class="imgStyle" src="cid:logo">
        </div>
        <h3 class="header sharedProp">${header}</h3>
        <p class="paragrafFirst sharedProp paragraphs" >${paragrafFirst}</p>
        <p class="paragrafSec sharedProp paragraphs">${secretToken}</p>
        <p class="paragrafTh sharedProp paragraphs"> ${paragrafTh}<a href=${link}>${link}</a></p>
        <p class="footer sharedProp paragraphs">${footer}</p>
    </div>
    `
    return html
}
module.exports = emailLook;
