import mysql.connector
import requests
import re
import time

# Configuration avec timeout et reconnexion
config = {
    'host': "localhost",
    'user': "root",
    'password': "",
    'database': "bd_des_livres",
    'raise_on_warnings': True,
    'connect_timeout': 60  # On laisse 60 secondes pour répondre
}

try:
    db = mysql.connector.connect(**config)
    cursor = db.cursor()
except mysql.connector.Error as err:
    print(f"Erreur de connexion : {err}")
    exit()

def get_book_data(book_id):
    url = f"https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}.txt"
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            # Forcer l'encodage utf-8 pour éviter les bugs de caractères
            text = response.content.decode('utf-8', errors='ignore')
            words = re.findall(r'\w+', text)
            nb_words = len(words)
            
            title_match = re.search(r"Title: (.*)", text)
            title = title_match.group(1).strip() if title_match else f"Livre {book_id}"
            
            return title, text, nb_words
    except Exception as e:
        print(f"Erreur réseau pour ID {book_id}: {e}")
    return None

count = 0
book_id = 10 

print("Début du remplissage (Objectif: 1664 livres de >10k mots)...")

while count < 1664:
    # Vérifier si la connexion est toujours active
    if not db.is_connected():
        db.reconnect(attempts=3, delay=2)
    
    data = get_book_data(book_id)
    if data:
        title, content, nb_words = data
        
        if nb_words >= 10000:
            try:
                sql = "INSERT INTO Livres (gutenberg_id, titre, contenu, nb_mots) VALUES (%s, %s, %s, %s)"
                cursor.execute(sql, (book_id, title[:255], content, nb_words))
                db.commit()
                count += 1
                print(f"[{count}/1664] ID {book_id} : '{title[:40]}...' ajouté ({nb_words} mots)")
            except mysql.connector.Error as err:
                print(f"Erreur SQL sur ID {book_id} : {err}")
                db.rollback() # Annule en cas de bug sur ce livre
    
    book_id += 1
    # Petite pause pour ne pas se faire bannir par Gutenberg
    if count % 10 == 0:
        time.sleep(1)

print("Bravo ! Ta base est remplie.")