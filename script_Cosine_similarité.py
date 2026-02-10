import mysql.connector

# Connexion à ta base
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="bd_des_livres"
)
cursor = db.cursor()

# 1. On récupère tous les IDs de livres
cursor.execute("SELECT id FROM Livres")
liste_ids = [row[0] for row in cursor.fetchall()]

print(f"Début du calcul pour {len(liste_ids)} livres...")

# 2. On boucle sur chaque livre
for i, id_actuel in enumerate(liste_ids):
    # Cette requête calcule le produit scalaire uniquement pour LE livre actuel
    # C'est BEAUCOUP plus rapide pour MySQL
    query = """
    INSERT INTO graphe_jaccard (livre_1_id, livre_2_id, indice_similarite)
    SELECT %s, B.livre_id, SUM(A.tfidf_final * B.tfidf_final) as score
    FROM index_inverse A
    JOIN index_inverse B ON A.mot = B.mot
    WHERE A.livre_id = %s AND B.livre_id > %s
    GROUP BY B.livre_id
    HAVING score > 0.05
    """
    
    cursor.execute(query, (id_actuel, id_actuel, id_actuel))
    
    # On valide toutes les 10 étapes pour ne pas perdre le travail
    if i % 10 == 0:
        db.commit()
        print(f"Progression : {i}/{len(liste_ids)} livres traités...")

db.commit()
db.close()
print("Bravo ! Ta table de similarités est remplie.")