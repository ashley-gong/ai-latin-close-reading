from flask import Flask, jsonify, request
from flask_cors import CORS
from numpy import linalg as LA
from scripts.gen_berts import LatinBERT
# from scripts.compare_bert_sents import compare

# import joblib

# app instance
app = Flask(__name__)
CORS(app)

@app.route("/api/home", methods=['GET'])
def return_home():
  return jsonify({
    'message': "Hello world!"
  })

@app.route('/api/example', methods=['POST'])
def example():
    data = request.json  # Get JSON data sent from the client
    return data


def get_target_embedding(sentence, target_word):
    tokenizer_path = 'models/subword_tokenizer_latin/latin.subword.encoder'
    bert_path = 'models/latin_bert'
    bert = LatinBERT(tokenizerPath=tokenizer_path, bertPath=bert_path)
    bert_sents = bert.get_berts([sentence])[0]
    for tok, embedding in bert_sents:
        if tok == target_word:
            return embedding / LA.norm(embedding)  # Normalize the target embedding
    return None

@app.route('/api/query', methods=['POST'])
def query_similarity():
    data = request.json
    query_text = data.get("queryText")
    target_word = data.get("targetWord")
    # berts_data = joblib.load('precomputed_embeddings.joblib')

    # Process the target input and find the target word embedding
    # target_embedding = get_target_embedding(query_text, target_word)
    # if target_embedding is None:
    #     return jsonify({"error": "Target word not found in the sentence."}), 400

    # # Perform similarity search using the precomputed embeddings
    # results = compare(berts_data, target_embedding, target_word, query_text)
    results = [f"{query_text}: {target_word}"] * 10
    return results


if __name__ == "__main__":
  app.run(debug=True, port=8080)

