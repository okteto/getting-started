require('./server.js');

const express = require('express');
const { listen, get, put, use } = express();

const handler = (method, url) => {
  const [, cb] = method.mock.calls.find(([endpoint]) => endpoint === url);
  return cb;
}

const visit = (url, resMock) => handler(get, url)(undefined, resMock);

const response = () => {
  const res = { json: jest.fn(), sendStatus: jest.fn() };
  res.status = jest.fn(() => res);
  return res;
}

describe('server.js', () => {
  it('should listen on port 8080', () => {
    expect(listen).toHaveBeenCalledWith(8080, expect.any(Function));
  });

  it('should parse JSON bodies', () => {
    expect(use).toHaveBeenCalledWith('json-middleware');
  });

  it('should have a health check endpoint', () => {
    const sendStatus = jest.fn();

    visit('/api/healthz', { sendStatus });

    expect(sendStatus).toHaveBeenCalledWith(200);
  });

  it('should have a movies endpoint', async () => {
    const json = jest.fn();

    await visit('/api/movies', { json });

    expect(json).toHaveBeenCalledWith([{ _id: 1, original_title: 'The Podfather', favorite: true }]);
  });

  it('should update the favorite flag of a movie', async () => {
    const res = response();

    await handler(put, '/api/movies/:id')({ params: { id: '1' }, body: { favorite: false } }, res);

    expect(res.json).toHaveBeenCalledWith({ _id: 1, original_title: 'The Podfather', favorite: false });
  });

  it('should reject an update without a favorite flag', async () => {
    const res = response();

    await handler(put, '/api/movies/:id')({ params: { id: '1' }, body: {} }, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should return 404 for a movie that does not exist', async () => {
    const res = response();

    await handler(put, '/api/movies/:id')({ params: { id: '42' }, body: { favorite: true } }, res);

    expect(res.sendStatus).toHaveBeenCalledWith(404);
  });

  it('should be a teapot', () => {
    const sendStatus = jest.fn();

    visit('/api', { sendStatus });

    expect(sendStatus).toHaveBeenCalledWith(418);
  });
});
