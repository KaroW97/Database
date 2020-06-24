if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'.env'})
}
const express = require('express')
const app = express()

const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session');

//FILE UPLOADER

const Grid = require('gridfs-stream');
//
const IndexRouter = require('./routes/index');
const ClientRouter = require('./routes/clients')
const TreatmentRotuer = require('./routes/treatment')
const ShoppingList = require('./routes/shoppingList')
const CalendarRouter = require('./routes/calendar')
const SettingsRotuer = require('./routes/settings')
const ClietnSellsStats = require('./routes/clientSellsStats')
const Document = require('./routes/document.js');

//app.use( express.static('public'));
app.use('/public', express.static(__dirname + '/public'))
app.set('view engine', 'ejs') 
app.set('views',__dirname+'/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(bodyParser.urlencoded({limit:'10mb',extended:false}))

const mongoose =  require('mongoose')
mongoose.connect(process.env.DATABASE_URL , {
    useNewUrlParser:true, 
    useUnifiedTopology: true
})//url for connection with database
const db = mongoose.connection;

db.on('error', error=>console.error(error)) //if error conecting database
let gfs
db.once('open', ()=>{
    gfs = Grid(db.db, mongoose.mongo);
    gfs.collection('uploads')
}) //only for the firsst time when we are creating 


// Passport Config
// Passport Middleware
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,//'uXap12AJDmeqsjadue',//process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


app.get('*', (req,res,next)=>{
   
  
    app.locals.gfs = gfs;
    res.locals.user = req.user || null;
    next();
})
app.post('*', (req,res,next)=>{
    app.locals.gfs = gfs;
    res.locals.user = req.user || null;
    next();
})
app.put('*', (req,res,next)=>{
    
    app.locals.gfs = gfs;
    res.locals.user = req.user || null;
    next();
})
app.delete('*', (req,res,next)=>{
    
    app.locals.gfs = gfs;
    res.locals.user = req.user || null;
    next();
})


app.use('/',IndexRouter); //login register
app.use(['/clients','/clients/show','/clients/clientView/:id'],ClientRouter) //Clients
app.use('/treatment',TreatmentRotuer)
app.use('/calendar',CalendarRouter)//Calendar page
app.use('/settings',SettingsRotuer) //Settings router
app.use('/shoppingList',ShoppingList) //ShopingList router
//Statistic
app.use('/statistics', ClietnSellsStats)
app.use('/document',Document)


app.listen(process.env.PORT || 3000); //proces is getting from server