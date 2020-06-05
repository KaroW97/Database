
const emailLook = (secretToken='', header='',paragrafFirst='',paragrafTh='', link='', footer='')=>{
    const html =   `
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
        text-underline:none;
        text-decoration: none;
        margin: 0 auto;
        text-align: center;
        color:#c3aa5b;
        src: local('Robotor'), local('Roboto'), url(https://fonts.googleapis.com/css2?family=Roboto:wght@100;400&display=swap) format('woff');
    }
    .sharedProp>a{
        text-underline:none;
        text-decoration: none;
        color:#c3aa5b;
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
