const pool = require('../utils/pool');

module.exports = class Todo {
  id;
  todo;
  completed;
  user_id;

  constructor({ id, todo, completed, user_id }) {
    this.id = id;
    this.todo = todo;
    this.completed = completed;
    this.user_id = user_id;
  }

  static async insert({ todo, user_id }) {
    const { rows } = await pool.query(
      `
      INSERT INTO todos (todo, user_id)
      VALUES ($1, $2)
      RETURNING *
    `,
      [todo, user_id]
    );

    return new Todo(rows[0]);
  }

  static async getAll(user_id) {
    const { rows } = await pool.query(
      'SELECT * from todos where user_id = $1 ORDER BY id DESC',
      [user_id]
    );
    return rows.map((todo) => new Todo(todo));
  }
  
};
