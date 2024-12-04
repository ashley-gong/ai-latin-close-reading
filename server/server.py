from flask import Flask, jsonify, request
from flask_cors import CORS
from numpy import linalg as LA
from scripts.gen_berts import LatinBERT
import json
import os
from pinecone import Pinecone

# app instance
app = Flask(__name__)
CORS(app)

# with open(f"/etc/config_server.json") as config_file:
#     config = json.load(config_file)

pinecone_api_key = os.getenv("PINECONE_API_KEY") # config["PINECONE_API_KEY"]
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

def get_target_embedding(sentence, target_word):
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
  num_results = int(data.get("numberResults")) if data.get("numberResults") != "" else 5
  target_texts = data.get("targetTexts")

  target_embedding = None
  bert_sents = bert.get_berts([query_text])[0]
  for tok, embedding in bert_sents:
    if tok == target_word:
      target_embedding = embedding / LA.norm(embedding)
      break

  if target_embedding is None:
    return jsonify({"error": "Target word not found in the sentence."}), 400

  target_embedding = target_embedding.tolist()
  
  if num_results > 30:
    return jsonify({"error": "Num results exceeds 30 (is too large)."}), 400

  if len(target_texts) > 0 and target_texts[0] != "":  
    results = index.query(
      vector=target_embedding, 
      top_k=num_results, 
      include_metadata=True, 
      filter={"document": {"$in": target_texts}}
    )
  else:
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
  app.run(host="0.0.0.0", debug=True, port=int(os.environ.get("PORT", 8000)))

