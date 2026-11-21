const listen = jest.fn((_port, cb) => cb());
const get = jest.fn();
const put = jest.fn();
const use = jest.fn();

const express = () => ({ listen, get, put, use });
express.json = jest.fn(() => 'json-middleware');

module.exports = express
