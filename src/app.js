const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({ message: 'Invalid repository ID.' });
  }

  const repositoryIndex = repositories.findIndex((repository) =>  
    repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'Repository not found.' });
  }

  const { title, url, techs } = request.body;

  const { likes } = repositories[repositoryIndex];

  const updatedRepository = { id, title, url, techs, likes }

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({ message: 'Invalid repository ID.' });
  }

  const repositoryIndex = repositories.findIndex((repository) =>  
    repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'Repository not found.' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({ message: 'Invalid repository ID.' });
  }

  const repositoryIndex = repositories.findIndex((repository) =>  
    repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(400).json({ message: 'Repository not found.' });
  }

  const { title, url, techs, likes } = repositories[repositoryIndex];

  const updatedRepository = { id, title, url, techs, likes: likes + 1 }

  repositories[repositoryIndex] = updatedRepository;

  return response.json(updatedRepository);
});

module.exports = app;
