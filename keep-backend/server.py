from flask import Flask
from flaskext.mysql import MySQL

app = Flask(__name__)
mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = ''
app.config['MYSQL_DATABASE_DB'] = 'keep'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)


@app.route("/")
def index():
    return {"1. Fetching Users(Authentication)": "/users/{username}/{password}", "2. Fetching Admin Data": "/admin", "3. Adding User": "/addUser/{username}/{password}", "4. Deleting User": "/deleteUser/{userid}", "5. Changing Password for existing user": '/changePassword/{userid}/{New Password}', "6. Fetching Items": "/fetchItems/{userid}", "7. Adding Item data": "/addItem/{userid}/{title}/{description}", "8. Alter Item data": "/alterItem/{userid}/{itemId}/{title}/{description}", "9. Delete Item": "/deleteItem/{userid}/{itemId}"}


@app.route("/users/<string:s>/<string:password>")
def fetchUser(s, password):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(f"select * from users where name = '{s}'")
    data = cursor.fetchone()
    cursor.close()
    conn.close()
    if data is None:
        return {'result': 'fail', 'reason': 'User Does not Exist'}
    if password == data[2]:
        return {'result': 'pass', 'id': data[0]}
    return {'result': 'fail', 'reason': 'Invalid Password'}


@app.route("/admin")
def admin():
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(f"select * from users order by name asc")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return {'users': data}


@app.route("/addUser/<string:name>/<string:password>")
def addUser(name, password):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(f"select * from users where name = '{name}'")
    isAlreadyExist = cursor.fetchone()
    if isAlreadyExist is None:
        cursor.execute(
            f'insert into users (name, password) values ("{name}", "{password}")')
        conn.commit()
        return {'result': 'pass'}
    cursor.close()
    conn.close()
    return {'result': 'fail'}


@app.route("/deleteUser/<string:id>")
def deleteUser(id):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(f"delete from data where id = '{id}'")
    cursor.execute(f"delete from users where id = '{id}'")
    conn.commit()
    cursor.execute(f"select * from users order by name asc")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return {'users': data}


@app.route("/changePassword/<string:id>/<string:nPassword>")
def changePassword(id, nPassword):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        f"update users set password = '{nPassword}' where id = '{id}'")
    conn.commit()
    cursor.execute(f"select * from users")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return {}


@app.route("/addItem/<string:id>/<string:title>/<string:desc>")
def addItem(id, title, desc):
    title = title.strip()
    conn = mysql.connect()
    cursor = conn.cursor()
    if title:
        cursor.execute(
            f"insert into data (id, title, description) values ('{id}', '{title}', '{desc}')")
    else:
        cursor.execute(
            f"insert into data (id, description) values ('{id}', '{desc}')")
    conn.commit()
    cursor.close()
    conn.close()
    return {}


@app.route("/fetchItems/<string:id>")
def fetchItems(id):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        f"select dataid, title, description from data where id = '{id}'")
    data = cursor.fetchall()
    cursor.close()
    conn.close()
    return {'data': data}


@app.route("/alterItem/<string:id>/<string:itemId>/<string:title>/<string:desc>")
def alterItem(id, itemId, title, desc):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        f"update data set title = '{title}', description = '{desc}' where id = '{id}' and dataid = '{itemId}'")
    conn.commit()
    cursor.close()
    conn.close()
    return {}


@app.route("/deleteItem/<string:id>/<string:itemId>")
def deleteItem(id, itemId):
    conn = mysql.connect()
    cursor = conn.cursor()
    cursor.execute(
        f"delete from data where id = '{id}' and dataid = '{itemId}'")
    conn.commit()
    cursor.close()
    conn.close()
    return {}


if __name__ == "__main__":
    app.run(debug=True)
