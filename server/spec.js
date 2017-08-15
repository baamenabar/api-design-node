var app = require('./server');
var request = require('supertest');
var cExpect = require('chai').expect;

// TODO: make tests for the other CRUD routes
// DELETE, UPDATE, PUT, GET ONE
// to run the test type mocha server/specs.js

const mockLion = {
    age: 3,
    gender: "male",
    name: "Mufasa",
    pride: "La cigueña",
  }

describe('[LIONS]', function(){

  let newLionId = 0;

  it('save a lion and return it', done => {
    request(app)
    .post('/lions')
    .set('Accept', 'application/json')
    .send(mockLion)
    .expect('Content-Type', /json/)
    .expect(201)
    .end((err, res) => {
      if(err)return done(err);
      //console.log('response body was:', res.body)
      cExpect(res.body).to.be.an('object')
      .to.have.property('name', 'Mufasa')
      cExpect(res.body).to.be.an('object')
      .to.have.property('id')
      newLionId = res.body.id
      done()
    })
  })

  it('Updating a lion name changes it´s name', function (done) {
    request(app)
    .put('/lions/' + newLionId)
    .set('Accept', 'application/json')
    .send({name:"Mufasa (dead)"})
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err)return done(err);
      cExpect(res.body).to.be.an('object')
      .to.have.property('name', 'Mufasa (dead)')
      done()
    })
  })

  it('should get all lions', function(done) {
    request(app)
      .get('/lions')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if(err)return done(err);
        cExpect(res.body, 'there should be at least one lion').to.be.an('array')
        .that.is.not.empty;
        done();
      })
  });

  it('Should get a lion by ID', (done) => {
    request(app)
    .get('/lions/' + newLionId)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err)return done(err);
      cExpect(res.body, 'Returned lion must be an object and have the requested ID')
      .to.be.an('object')
      .to.have.property('id',newLionId)
      done()
    })
  })

  it('Should delete a lion by it´s ID and return it', function (done) {
    request(app)
    .delete('/lions/' + newLionId)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err)return done(err);
      cExpect(res.body.id, 'The returned object should be the deleted object')
      .to.equal(newLionId)
      done();
    })
  })

  it('Should return 404 after deleted', (done) => {
    request(app)
    .get('/lions/' + newLionId)
    .set('Accept', 'application/json')
    .expect(404)
    .end((err, res) => {
      if(err)return done(err);
      done()
    })
  })

});

