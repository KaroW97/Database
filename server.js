if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({path:'.env'})
}
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const passport = require('passport')
const session = require('express-session');
const flash = require('express-flash')

const IndexRouter = require('./routes/index');
const ClientRouter = require('./routes/clients')
const TreatmentRotuer = require('./routes/treatment')
const ShoppingList = require('./routes/shoppingList')
const CalendarRouter = require('./routes/calendar')
const SettingsRotuer = require('./routes/settings')


//app.use( express.static('public'));
app.use('/jsFiles', express.static(__dirname + '/views/jsFiles'))
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
db.once('open', ()=>console.log('Conected to mongoose')) //only for the firsst time when we are creating 
// Passport Config

// Passport Middleware
app.use(session({
    secret:'secret',
    resave:false,
    saveUninitialized:false
}))
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

app.use('/',IndexRouter); //login register
app.use(['/clients','/clients/show','/clients/clientView/:id'],ClientRouter) //Clients
app.use('/treatment',TreatmentRotuer)
app.use('/calendar',CalendarRouter)//Calendar page
app.use('/settings',SettingsRotuer) //Settings router
app.use('/shoppingList',ShoppingList) //ShopingList router



app.listen(process.env.PORT || 3000); //proces is getting from server