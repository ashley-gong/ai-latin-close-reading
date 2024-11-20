from flask import Flask, jsonify, request
from flask_cors import CORS
from numpy import linalg as LA
from scripts.gen_berts import LatinBERT

import os
from pinecone import Pinecone

# from google.cloud import secretmanager
# client = secretmanager.SecretManagerServiceClient()
# pinecone_api_key = client.access_secret_version(request={'name': 'projects/615757532460/secrets/PINECONE_API_KEY/versions/1'}).payload.data.decode("utf-8")

# app instance
app = Flask(__name__)
CORS(app)

pinecone_api_key = os.getenv("PINECONE_API_KEY")
pc = Pinecone(api_key=pinecone_api_key)
index = pc.Index("ai-latin-close-reading")

tokenizer_path = 'models/subword_tokenizer_latin/latin.subword.encoder'
bert_path = 'ashleygong03/bamman-burns-latin-bert'
bert = LatinBERT(tokenizerPath=tokenizer_path, bertPath=bert_path)


@app.route("/api/home", methods=['GET'])
def return_home():
  return jsonify({
    'message': "Hello world!"
  })

# def get_target_embedding(sentence, target_word):
#     bert_sents = bert.get_berts([sentence])[0]
#     for tok, embedding in bert_sents:
#       if tok == target_word:
#         return embedding / LA.norm(embedding)
#     return None

@app.route('/api/query', methods=['POST'])
def query_similarity():
    data = request.json
    query_text = data.get("queryText")
    target_word = data.get("targetWord")
    num_results = int(data.get("numberResults")) if data.get("numberResults") != "" else 5

    # target_embedding = get_target_embedding(query_text, target_word)
    bert_sents = bert.get_berts([query_text])[0]
    for tok, embedding in bert_sents:
      if tok == target_word:
        target_embedding = embedding / LA.norm(embedding)
        break

    target_embedding = target_embedding.tolist()
    if target_embedding is None:
        return jsonify({"error": "Target word not found in the sentence."}), 400
    
    if num_results > 30:
        return jsonify({"error": "Num results exceeds 30 (is too large)."}), 400
        
    results = index.query(vector=target_embedding, top_k=num_results, include_metadata=True)
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
  app.run(host="0.0.0.0", debug=True, port=int(os.environ.get("PORT", 8080)))

