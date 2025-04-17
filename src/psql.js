import pkg from "pg";
const {Client} = pkg;

const user = "postgres";
const host = "localhost";
const password = "admin";
const port = 5432;
const DB_NAME = "auto_geek_db";


const connectionStringPre = `postgres://${user}:${password}@${host}:${port}`;

export const firstTimeClient = new Client({
    connectionString:connectionStringPre
})


export const pgClient = new Client({
	user: user,
	host: host,
	database: DB_NAME,
	password: password,
	port: port,
});


export const createDatabaseIfNone = async () => {

	const res = await firstTimeClient.query(
		`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`,
	);

	if (res.rowCount === 0) {
		console.log(`${DB_NAME} database not found, creating it.`);
		await firstTimeClient.query(`CREATE DATABASE "${DB_NAME}"`).then(() => {
            console.log(`created database ${DB_NAME}`);
        }).catch(e => {
            console.log('Database creation error: ',e)
        });

        await firstTimeClient.end()

        makeTablesFirstTime();
                 
	} else {
		console.log(`${DB_NAME} database exists.`);
        pgClient.connect()

	}
};

const makeTablesFirstTime = async () =>{
    pgClient.connect().then( async res => {
        
        await pgClient.query(`
          CREATE TABLE USERS (
              id SERIAL PRIMARY KEY ,
              username VARCHAR(15) UNIQUE NOT NULL CHECK (char_length(username) > 0 AND char_length(username) <= 20), 
              email VARCHAR(50) NOT NULL CHECK (char_length(email) > 0 AND char_length(email) <= 50),
              name VARCHAR(30) NOT NULL CHECK (char_length(name) > 0 AND char_length(name) <= 30),
              password VARCHAR(255) NOT NULL CHECK (char_length(password) > 0 AND char_length(password) <= 255),
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
              )`).then(() => {
                console.log('Users table created');
              }).catch(e => {
                console.log('User table creation error: ',e)
              })
    
        await pgClient.query(`
                  CREATE TABLE POSTS (
                      id SERIAL PRIMARY KEY,
                      title TEXT NOT NULL CHECK(char_length(title) > 0),
                      content TEXT NOT NULL CHECK(char_length(content) > 0),
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                      username VARCHAR(15) NOT NULL CHECK(char_length(username) > 0 AND char_length(username) <= 15),
                      likes INTEGER DEFAULT 0, 
                      FOREIGN KEY (username) REFERENCES USERS(username) ON DELETE CASCADE ON UPDATE CASCADE
                      )`).then(() => {
                          console.log('Post table created')
                      }).catch(e => {
                        console.log('Posts table creation error: ',e)
                      });
    

      }).catch(e => {
        console.log("Client Error: ",e)
      });
}