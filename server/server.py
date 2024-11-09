from flask import Flask, jsonify, request
from flask_cors import CORS
from numpy import linalg as LA
from scripts.gen_berts import LatinBERT

import os
from pinecone import Pinecone

# app instance
app = Flask(__name__)
CORS(app)

pinecone_api_key = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("ai-latin-close-reading")


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
        return embedding / LA.norm(embedding)
    return None

@app.route('/api/query', methods=['POST'])
def query_similarity():
    data = request.json
    query_text = data.get("queryText")
    target_word = data.get("targetWord")

    target_embedding = get_target_embedding(query_text, target_word)
    target_embedding = target_embedding.tolist()
    if target_embedding is None:
        return jsonify({"error": "Target word not found in the sentence."}), 400
        
    results = index.query(vector=target_embedding, top_k=5, include_metadata=True)
    output = []
    for match in results['matches']:
      output.append({
            "score": match['score'], 
            "token": match['metadata']['token'], 
            "document": match['metadata']['document'],
            "sentence": match['metadata']['sentence'],
            "section": match['metadata']['section']
          })

    return output


if __name__ == "__main__":
  app.run(debug=True, port=8080)

