from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="bd_des_livres"
    )

@app.route('/api/search', methods=['GET'])
def search():
    keyword = request.args.get('q', '').lower()
    db = get_db()
    cursor = db.cursor(dictionary=True)
    query = """
    SELECT l.id, l.titre, i.tfidf_final, IFNULL(s.nb_clics, 0) as clics
    FROM index_inverse i
    JOIN Livres l ON i.livre_id = l.id
    LEFT JOIN stats_clicks s ON l.id = s.livre_id
    WHERE i.mot = %s
    ORDER BY (i.tfidf_final * 0.7 + IFNULL(s.nb_clics, 0) * 0.3) DESC
    LIMIT 1700
    """
    cursor.execute(query, (keyword,))
    results = cursor.fetchall()
    db.close()
    return jsonify(results)

# --- NOUVELLE ROUTE : RECHERCHE REGEX ---
@app.route('/api/search_regex', methods=['GET'])
def search_regex():
    pattern = request.args.get('q', '')
    db = get_db()
    cursor = db.cursor(dictionary=True)
    
    # On cherche les mots de l'index qui correspondent à la RegEx
    # On trie par la somme des TF-IDF pour rester pertinent
    query = """
    SELECT l.id, l.titre, SUM(i.tfidf_final) as score_total, IFNULL(s.nb_clics, 0) as clics
    FROM index_inverse i
    JOIN Livres l ON i.livre_id = l.id
    LEFT JOIN stats_clicks s ON l.id = s.livre_id
    WHERE i.mot REGEXP %s
    GROUP BY l.id
    ORDER BY score_total DESC
    LIMIT 1700
    """
    try:
        cursor.execute(query, (pattern,))
        results = cursor.fetchall()
    except:
        results = [] # En cas de RegEx invalide tapée par l'utilisateur
    
    db.close()
    return jsonify(results)

@app.route('/api/similar/<int:book_id>', methods=['GET'])
def get_similar(book_id):
    db = get_db()
    cursor = db.cursor(dictionary=True)
    query = """
    SELECT l.titre, g.indice_similarite
    FROM graphe_jaccard g
    JOIN Livres l ON g.livre_2_id = l.id
    WHERE g.livre_1_id = %s
    ORDER BY g.indice_similarite DESC
    LIMIT 10
    """
    cursor.execute(query, (book_id,))
    recommendations = cursor.fetchall()
    db.close()
    return jsonify(recommendations)

if __name__ == '__main__':
    app.run(port=5000, debug=True)  