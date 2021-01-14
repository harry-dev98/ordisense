from re import error
from flask import Flask, json, request, jsonify, render_template
from flask_pymongo import PyMongo
from datetime import datetime as dt
import requests

from bson.objectid import ObjectId
from pymongo.collation import CollationStrength

from util import *

app = Flask(__name__, static_url_path='', static_folder='../build', template_folder='../build')
app.config["MONGO_URI"] = "mongodb://localhost:27017/Ordisense"
mongo = PyMongo(app)


@app.route("/")
def hello():
    return render_template("index.html")

@app.route("/alldata/<startDate>/<endDate>", methods=['GET', ])
def getData(startDate, endDate):
    mongodata = mongo.db.data.find()
    data = extractData(mongodata)    
    startDate = dt.strptime(startDate[4:15], "%b %d %Y").date()
    endDate = dt.strptime(endDate[4:15], "%b %d %Y").date()
    for doc in data:
        try:
            doc['Day'] = dt.strptime(doc['Day'], "%b %d, %Y").date()
        except ValueError:
            doc['Day'] = dt.strptime(doc['Day'], "%b %d,%Y").date()
        
        doc['Time'] = dt.strptime(doc['Time'], "%I:%M:%S %p").time()

    filteredData = list(filterBetweenDates(data, startDate, endDate))
    if len(filteredData) == 0: return jsonify()

    filteredData.sort(key=lambda doc: doc['Day'])
    (labels, temp, humidity) = splitTempAndHumidity(filteredData, startDate, endDate)
    smoothData = cleanAndSmoothData(labels, temp, humidity) 
    return jsonify(smoothData)

@app.route("/note/", methods=['POST', ])
def addNote():
    json = request.get_json(force=True)
    note = json['note']
    res = mongo.db.notes.insert_one({'note': note})
    newNote = mongo.db.notes.find_one({"_id": res.inserted_id})
    return jsonify({'_id': str(newNote['_id']), 'note': newNote['note']})

@app.route("/note/<id>", methods=['DELETE', ])
def deleteNote(id):
    res = mongo.db.notes.find_one_and_delete({'_id': ObjectId(id)})
    return jsonify("success")

@app.route("/allnotes/", methods=['GET',])
def getNotes():
    mongodata = mongo.db.notes.find()
    data = extractData(mongodata)
    return jsonify(data)

@app.route("/verifylogin/<key>", methods=['GET',])
def verifyLogin(key):
    r = requests.get('https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+ str(key))
    if(r.json()['aud'] == "11561370885-11a2tmqpupr6hc1lvrqnvfrp9mpkpdoh.apps.googleusercontent.com"):
        return jsonify()
    else:
        return 'bad request!', 400

@app.route("/verifycaptcha/<value>", methods=['GET',])
def verifyCaptcha(value):
    payload = { 'response': value, 'secret': '6Le9kywaAAAAAOdxujeFkkI9jVuUzQlZASM-b2vj'}
    r = requests.post('https://www.google.com/recaptcha/api/siteverify', payload)
    if(r.json()['success']):
        return jsonify()
    else:
        return 'bad request!', 400



if __name__ == "__main__":
    app.run(debug=True)