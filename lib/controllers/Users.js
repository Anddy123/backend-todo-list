const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  #passwordHash;

  constructor({ id, email, password_hash}) {
    this.id = id;
    this.email = email;
    this.#passwordHash = password_hash;
  }

  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(
      `
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
    `,
      [email, passwordHash]
    );

    return new User(rows[0]);
  }

  get passwordHash() {
    return this.#passwordHash;
  }
