process.env.NODE_ENV = 'test';
let mongoose = require("mongoose");
const CalendarRouter = require('./routes/calendar')
const ShoppingList = require('./routes/shoppingList')
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./server');
let should = chai.should();
const {expect} = chai
chai.use(chaiHttp);
//Our parent block
/*
describe('CalendarRouter', () => {
  /*
  * Test the /GET route
 
  describe('/GET CalendarRouter', () => {
      it('it should GET all the visits', (done) => {
        chai.request('http://localhost:3000')
            .get('/calendar')
            .end((err, res) => {
                  console
                  res.should.have.status(200);
                  res.body.should.be.a('object');
              done();
            });
      });
  });
      /*
  * Test the /GET visit by id route before editin

 describe('/GET id', () => {
    it('it should GET visit by id before editing', (done) => {
      chai.request('http://localhost:3000')
          .get('/calendar/6025112f7946841c74923940')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('user');
                res.body.should.have.property('treatment');
                res.body.should.have.property('timeTo');
                res.body.should.have.property('clientName');
                res.body.should.have.property('visitDate');
                res.body.should.have.property('timeFrom');
            done();
          });
    });
  });
   /*
  * Test the /PUT route

  describe('/PUT CalendarRouter', () => {
    it('it should update visit',  (done) => {
      const  futureVisit = {
      
        user:'60154b2aa1940e05f85ee571',
        clients:'Nowa',
        visitDate: new Date(2021-02-11),
        timeFrom:'17:20',
        timeTo:'18:20',
        treatment:'zabieg',
        phone:3204572123
      }
  
      chai.request('http://localhost:3000')
          .put('/calendar/edit/6025112f7946841c74923940')
          .set("content-type", "application/x-www-form-urlencoded")
          .send(futureVisit)
          .end((err, res) => {
                console.log(res.body)
                expect(res).to.have.status(200);
                res.body.should.be.a('object');
          
            done();
          });
    });
  });
    /*
  * Test the /GET visit by id route


 describe('/GET id', () => {
  it('it should GET visit by id after editing', (done) => {
    chai.request('http://localhost:3000')
        .get('/calendar/6025112f7946841c74923940')
        .set('Content-Type', 'application/json')
        .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('user');
              res.body.should.have.property('treatment');
              res.body.should.have.property('timeTo');
              res.body.should.have.property('clientName');
              res.body.should.have.property('visitDate');
              res.body.should.have.property('timeFrom');
          done();
        });
  });
  });
});
*/
describe('ShoppingList', () => {
  describe('/GET ShoppingList', () => {
    it('it should GET all the visits', (done) => {
      chai.request('http://localhost:3000')
          .get('/shopping-list')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
          });
    });
  });

  describe('/DELETE ShoppingList', () => {
    it('it should DELETE shopping list', (done) => {
      chai.request('http://localhost:3000')
          .delete('/shopping-list/6012b471b6fccd52dce8a559')
          .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
          });
    });
  });

  describe('/PUT ShoppingList', () => {
    it('it should PUT shopping list information', (done) => {
      let list ={
        name:'n',
        price:4,
        amount:5
    }
      chai.request('http://localhost:3000')
      
      .put('/shopping-list/list-view/60243d51aa652d042cdea79c/0')
      .set("content-type", "application/x-www-form-urlencoded")
      .send(list)
      .end((err, res) => {

           res.should.have.status(200);
            //res.body.should.be.a('object');
        done();
      });
    });
  });
  describe('/PUT ShoppingList', () => {
    it('it should PUT shopping list information', (done) => {
      let list ={
        itemName:'n',
        itemPrice:4,
        itemAmount:5
    }
      chai.request('http://localhost:3000')
      
      .put('/shopping-list/list-view/60243d51aa652d042cdea79c/0')
      .set("content-type", "application/x-www-form-urlencoded")
      .send(list)
      .end((err, res) => {

           res.should.have.status(200);
            //res.body.should.be.a('object');
        done();
      });
    });
  });
  describe('/get ShoppingList', () => {
    it('it should GET ShoppingList item', (done) => {
      chai.request('http://localhost:3000')
          .get('/shopping-list/list-view/60243d51aa652d042cdea79c/0')
          .end((err, res) => {
                console.log(res.body)
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('price');
                res.body.should.have.property('amount');
            done();
          });
    });
  });
 
});
