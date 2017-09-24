const app = require('../../server/server');
const request = require('supertest');
const cExpect = require('chai').expect;

const mockResource = {
    name: "Ludwig",
  }

describe('[CATEGORIES]', () => {
    let newResourceId = 0;

    it('save a resource and return it', done => {
        request(app)
        .post('/api/categories')
        .set('Accept', 'application/json')
        .send(mockResource)
        .expect('Content-Type', /json/)
        .expect(201)
        .end((err, res) => {
          if(err)return done(err);
          cExpect(res.body).to.be.an('object')
          .to.have.property('name', 'Ludwig')
          cExpect(res.body).to.be.an('object')
          .to.have.property('id')
          newResourceId = res.body.id
          done()
        })
    })

    it('Updating a resource name changes it´s name', function (done) {
        request(app)
        .put('/api/categories/' + newResourceId)
        .set('Accept', 'application/json')
        .send({name:"Ludwig (dead)"})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if(err)return done(err);
          cExpect(res.body).to.be.an('object')
          .to.have.property('name', 'Ludwig (dead)')
          done()
        })
    })

    it('Should get a list of categories ', done => {
        request(app)
        .get('/api/categories')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if(err)return done(err);
            cExpect(res.body, 'there should be at least one resource').to.be.an('array')
            .that.is.not.empty;
            done();
        })
    })

    it('Should get a resource by ID', (done) => {
    request(app)
    .get('/api/categories/' + newResourceId)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err)return done(err);
      cExpect(res.body, 'Returned resource must be an object and have the requested ID')
      .to.be.an('object')
      .to.have.property('id', newResourceId)
      done()
    })
  })

  it('Should delete a resource by it´s ID and return it', function (done) {
    request(app)
    .delete('/api/categories/' + newResourceId)
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end((err, res) => {
      if(err)return done(err);
      cExpect(res.body.id, 'The returned object should be the deleted object')
      .to.equal(newResourceId)
      done();
    })
  })

  it('Should return 404 after deleted', (done) => {
    request(app)
    .get('/api/categories/' + newResourceId)
    .set('Accept', 'application/json')
    .expect(404)
    .end((err, res) => {
      if(err)return done(err);
      done()
    })
  })
})