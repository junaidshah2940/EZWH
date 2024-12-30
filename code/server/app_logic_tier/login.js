const {User} = require('../data_tier/User');

const { db } = require('../database/createDatabase')


async function login(credentials) {
    const sql = "SELECT * from User WHERE type='manager' and email=? and password=?"
    return new Promise((resolve,reject) => {
        db.all(sql,[credentials.username, credentials.password],(err,rows) => {
            if(err){
                reject(err);
            }else{
                resolve(
                    rows.map((u) =>
                        new User(u.id, u.email, u.password, u.name, u.surname, u.type)
                    )
                )
            }
        })
    }

    );
}

module.exports = {login};