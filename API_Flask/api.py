#!flask/bin/python
from flask import Flask, request
# required imports
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json 
from tensorflow.keras.models import model_from_json
import json

app = Flask(__name__)

# load model architecture
json_file = open('model.json', 'r')
loaded_model_json = json_file.read()
model = model_from_json(loaded_model_json)

# load model weights
model.load_weights("model_weights.h5")

# load tokenizer
json_file = open('tokenizer.json', 'r')
loaded_tokenizer_json = json_file.read()
json_file.close()
loaded_tokenizer = tokenizer_from_json(loaded_tokenizer_json)
max_length=1342

def predict_toxicity(comment):
    # process
    Xnew_processed=pad_sequences(loaded_tokenizer.texts_to_sequences([comment]),maxlen=max_length, padding='post')
    # predict
    return [model.predict(Xnew_processed)[i][0][0] for i in range(6)]

def prediction_to_json(pred):
    return {
     'toxic': str(pred[0]),
     'severe_toxic': str(pred[1]),
     'obscene': str(pred[2]),
     'threat': str(pred[3]),
     'insult': str(pred[4]),
     'identity_hate': str(pred[5])
    }

@app.route('/', methods=['POST'])
def index():
    comment=request.form['comment']
    toxic=predict_toxicity(comment)
    return json.dumps(prediction_to_json(toxic))

@app.after_request
def after_request(response):
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  response.headers.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  return response 

if __name__ == '__main__':
    app.run(debug=True, threaded=True)
