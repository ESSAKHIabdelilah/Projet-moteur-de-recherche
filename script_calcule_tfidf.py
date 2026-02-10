import mysql.connector
from sklearn.feature_extraction.text import TfidfVectorizer

# 1. Connexion
db = mysql.connector.connect(
    host="localhost", 
    user="root", 
    password="", 
    database="bd_des_livres"
)
cursor = db.cursor()

# 2. Chargement
print("Chargement des textes...")
cursor.execute("SELECT id, contenu FROM Livres")
data = cursor.fetchall()
ids = [row[0] for row in data]
corpus = [row[1] for row in data]

# 3. Configuration TF-IDF avec filtres stricts
# token_pattern=r"(?u)\b[a-zA-Z]{4,}\b" : Uniquement lettres, min 4 caractères
vectorizer = TfidfVectorizer(
    stop_words='english', 
    max_features=15000, 
    min_df=2,
    token_pattern=r"(?u)\b[a-zA-Z]{4,}\b" 
)

print("Calcul du TF-IDF (Filtre : mots de 4+ lettres, sans chiffres)...")
tfidf_matrix = vectorizer.fit_transform(corpus)
feature_names = vectorizer.get_feature_names_out()

# 4. Insertion
print("Insertion dans Index_Inverse...")

# Utilisation de INSERT IGNORE pour éviter les crashs en cas de doublons imprévus
sql = "INSERT IGNORE INTO Index_Inverse (mot, livre_id, nb_occurrences, tfidf_final) VALUES (%s, %s, %s, %s)"

for doc_idx, livre_id in enumerate(ids):
    row = tfidf_matrix.getrow(doc_idx)
    words_indices = row.indices
    scores = row.data
    
    batch_data = []
    for word_idx, score in zip(words_indices, scores):
        word = feature_names[word_idx]
        # On insère : mot (texte), id, 1, et le score
        batch_data.append((word, livre_id, 1, float(score)))
    
    if batch_data:
        cursor.executemany(sql, batch_data)
        db.commit()
    
    if (doc_idx + 1) % 100 == 0:
        print(f"Progression : {doc_idx + 1}/{len(ids)} livres traités")

print("\nC'est terminé ! Ta table est propre et ne contient plus de chiffres.")
db.close()