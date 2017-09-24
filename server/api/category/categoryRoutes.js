const router = require('express').Router()
const logger = require('../../util/logger')

const resources = [{
  id: 1,
  name: 'code-blog',
}]

let idCount = 1;

router.param('id', (req, res, next, id) => {
  const resource = getResourceById(id);

  if (resource) {
    req.resource = resource;
    next();
  } else {
    res.status(404).send();
  }
});

router.route('/')
  .get((req, res) => {
    logger.log('Hey from category!!')
    res.status(200).send(resources)
  })
  .post((req, res) => {
    const addedResource = addResource(req.body)
    res.status(201).json(addedResource);
  });

router.route('/:id')
  .get((req, res) => {
    logger.log('Hey from get by id!!', req.resource)
    res.status(200).send(req.resource)
  })
  .put((req, res) => {
    logger.log('Hey from PUT to id!!', req.resource)
    const update = req.body

    if (update.id) {
      delete update.id
    }

    Object.assign(req.resource, update)
    res.status(200).send(req.resource)
  })
  .delete((req, res) => {
    logger.log('Hey from DELETE to id!!', req.resource)
    const index = resources.findIndex(item => item.id === req.resource.id)
    res.status(200).json(resources.splice(index, 1)[0])
  })


function getResourceById(id) {
	logger.log('trying to get resource by Id', id)
  return resources.filter(item => item.id == id)[0];
}

function addResource(resource) {
  idCount++;
  resource.id = idCount
  resources.push(resource)
  return resource;
}

module.exports = router
