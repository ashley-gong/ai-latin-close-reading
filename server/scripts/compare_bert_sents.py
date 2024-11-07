import joblib
import numpy as np
from numpy import linalg as LA
from joblib import Parallel, delayed
from tqdm import tqdm

# From LatinBERT: https://github.com/dbamman/latin-bert 


PINK = '\033[95m'
ENDC = '\033[0m'

def proc(filenames):
	matrix_all=[]
	sents_all=[]
	sent_ids_all=[]
	toks_all=[]
	position_in_sent_all=[]
	doc_ids=[]

	num_parallel_processes = 10
	vals=Parallel(n_jobs=num_parallel_processes)(
			delayed(proc_doc)(f) for f in tqdm(filenames))

	for matrix, sents, sent_ids, toks, position_in_sent, filename in vals:
		matrix_all.append(matrix)
		sents_all.append(sents)
		sent_ids_all.append(sent_ids)
		toks_all.append(toks)
		position_in_sent_all.append(position_in_sent)
		doc_ids.append(filename)

	# matrix_all contains all bert arrays
	return matrix_all, sents_all, sent_ids_all, toks_all, position_in_sent_all, doc_ids

def proc_doc(filename):
	berts=[]
	toks=[]
	sent_ids=[]
	sentid=0
	position_in_sent=[]
	p=0
	with open(filename) as file:
		for line in file:
			cols=line.rstrip().split("\t")
			if len(cols) == 2:
				word=cols[0]
				bert=np.array([float(x) for x in cols[1].split(" ")])
				bert=bert/LA.norm(bert)
				toks.append(word)
				berts.append(bert)
				sent_ids.append(sentid)
				position_in_sent.append(p)
				p+=1
			else:
				sentid+=1
				p=0

	sents=[]
	lastid=0
	current_sent=[]
	for s, t in zip(sent_ids, toks):
		if s != lastid:
			sents.append(current_sent)
			current_sent=[]
		lastid=s
		current_sent.append(t)

	matrix=np.asarray(berts)
	
	# matrix is berts
	return matrix, sents, sent_ids, toks, position_in_sent, filename

# increasing window means more words around
def get_window(pos, sentence, window):
	start=pos - window if pos - window >= 0 else 0
	end=pos + window + 1 if pos + window + 1 < len(sentence) else len(sentence)
	return "%s %s%s%s %s" % (' '.join(sentence[start:pos]), PINK, sentence[pos], ENDC, ' '.join(sentence[pos+1:end]))

def get_window_no_color(pos, sentence, window):
	start=pos - window if pos - window >= 0 else 0
	end=pos + window + 1 if pos + window + 1 < len(sentence) else len(sentence)
	return "%s" % (' '.join(sentence[start:end]))

def compare(berts, target_bert):

	vals=[]
	# matrix_all, sents_all, sent_ids_all, toks_all, position_in_sent_all, doc_ids=berts
	matrix_all = berts["matrix_all"]
	sents_all = berts["sents_all"]
	sent_ids_all = berts["sent_ids_all"]
	toks_all = berts["toks_all"]
	position_in_sent_all = berts["position_in_sent_all"]
	doc_ids = berts["doc_ids"]

	for idx in range(len(doc_ids)):
		c_matrix=matrix_all[idx]
		c_sents=sents_all[idx]
		c_sent_ids=sent_ids_all[idx]
		c_toks=toks_all[idx]
		c_pos=position_in_sent_all[idx]
		doc_id=doc_ids[idx]

		similarity=np.dot(c_matrix,target_bert)
		argsort=np.argsort(-similarity)
		len_s,=similarity.shape
		for i in range(min(100,len_s)):
			tid=argsort[i]
			if tid < len(c_sent_ids) and tid < len(c_pos) and c_sent_ids[tid] < len(c_sents):
				wind5=get_window(c_pos[tid], c_sents[c_sent_ids[tid]], 5)
				vals.append((similarity[tid], wind5, doc_id))

	vals=sorted(vals, key=lambda x: x[0])
	return vals[-10:]