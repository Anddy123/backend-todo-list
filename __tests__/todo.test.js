const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');


const mockUser = {
  email: 'winston@example.com',
  password: '123456',
};


const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const agent = request.agent(app);
  const user = await UserService.create({ ...mockUser, ...userProps });
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password });
  return [agent, user];
};

describe('todos', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  it('POST /api/v1/todos creates a new shopping item with the current user', async () => {
    const [agent, user] = await registerAndLogin();
    const resp = await agent.post('/api/v1/todos')
      .send({
        todo: 'buy milk',
        user_id: user.id,
      });
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      id: 1,
      todo: 'buy milk',
      user_id: user.id,
      completed: false, 
    });
  });
  
  it('GET /api/v1/todos returns all shopping items', async () => {
    const [agent, user] = await registerAndLogin();
    await agent.post('/api/v1/todos')
      .send({
        todo: 'buy milk',
        user_id: user.id,
      });
    const resp = await agent.get('/api/v1/todos');
    expect(resp.status).toEqual(200);
    expect(resp.body[0].todo).toEqual('buy milk');
  });

  it('PUT /api/v1/todos/:id updates a todo item', async () => {
    const [agent, user] = await registerAndLogin();
    const todo = await agent.post('/api/v1/todos').send({
      todo: 'buy milk',
      user_id: user.id,
    });
    const resp = await agent
      .put('/api/v1/todos/1')
      .send({
        completed: true
      });
    expect(resp.status).toEqual(200);
    expect(resp.body).toEqual({
      ...todo.body,
      completed: true,
    });
  });

  it('DELETE /api/v1/todos/:id deletes a todo item', async () => {
    const [agent, user] = await registerAndLogin();
    await agent.post('/api/v1/todos').send({
      todo: 'buy milk',
      user_id: user.id,
    });
    const resp = await agent.delete('/api/v1/todos/1');
    console.log(resp.body);
    expect(resp.status).toEqual(200);
  });

  afterAll(() => {
    pool.end();
  });
});
