/*
    Here, you can add the sql syntax to add new tables to the database. These will be rendered when the main database instance starts 
*/

const tables = [
  // this is an example table, you can delete it if you don't need it
  {
    filename: 'post.ts', // the filename needs to reference a file within the types folder
    name: 'posts',
    // Dont forget to add "IF NOT EXISTS"
    createTable: `
            CREATE TABLE IF NOT EXISTS posts (
                id INT NOT NULL AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                author VARCHAR(255) NOT NULL,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            );`,
    insertTable: `
            INSERT INTO posts (title, content, author)
            VALUES (?, ?, ?);`,
  },
  {
    filename: 'user.ts',
    name: 'users',
    createTable: `
            CREATE TABLE IF NOT EXISTS users (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL,
                role INT NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                deleted BOOLEAN NOT NULL DEFAULT FALSE,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                PRIMARY KEY (id)
            );`,
    insertTable: `
            INSERT INTO users (name, role, email, password)
            VALUES (?, ?, ?, ?);`,
  },
];

export default tables;
