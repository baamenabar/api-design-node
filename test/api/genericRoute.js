const app = require('../../server/server');
const request = require('supertest');
const cExpect = require('chai').expect;

function runGenericTests(suiteList) {

    suiteList.forEach(resourceConfig => {

        describe(`[${resourceConfig.name}`, () => {
            let newResourceId = 0;

            it('save a resource and return it', done => {
                request(app)
                .post(resourceConfig.baseRoute)
                .set('Accept', 'application/json')
                .send(resourceConfig.mockResource)
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                  if(err)return done(err);
                  cExpect(res.body).to.be.an('object')
                  .to.have.property('name', resourceConfig.mockResource.name)
                  cExpect(res.body).to.be.an('object')
                  .to.have.property('id')
                  newResourceId = res.body.id
                  done()
                })
            })

            it('Updating a resource name changes it´s name', function (done) {
                request(app)
                .put(resourceConfig.baseRoute + '/' + newResourceId)
                .set('Accept', 'application/json')
                .send({name: resourceConfig.mockResource.name + " (dead)"})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                  if(err)return done(err);
                  cExpect(res.body).to.be.an('object')
                  .to.have.property('name', resourceConfig.mockResource.name + ' (dead)')
                  done()
                })
            })

            it('Should get a list of categories ', done => {
                request(app)
                .get(resourceConfig.baseRoute)
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
            .get(resourceConfig.baseRoute + '/' + newResourceId)
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
            .delete(resourceConfig.baseRoute + '/' + newResourceId)
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
            .get(resourceConfig.baseRoute + '/' + newResourceId)
            .set('Accept', 'application/json')
            .expect(404)
            .end((err, res) => {
              if(err)return done(err);
              done()
            })
          })
        })
    })
}

runGenericTests([
        {
            name: 'CATEGORIES',
            baseRoute: '/api/categories',
            mockResource: {
                name: "History",
              },
        },
        {
            name: 'POSTS',
            baseRoute: '/api/posts',
            mockResource: {
                name: "Story of the castle",
              },
        },
        {
            name: 'USERS',
            baseRoute: '/api/users',
            mockResource: {
                name: "John Doe",
              },
        },
    ]);
