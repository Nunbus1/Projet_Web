import mysql.connector
import csv

# Configurer la connexion à la base de données
config = {
    'user': 'etu0112',
    'password': 'odqmttgm',
    'host': 'localhost',
    'database': 'etu0112',
}

# Connexion à la base de données
conn = mysql.connector.connect(**config)
cursor = conn.cursor()
cursor.execute('ALTER TABLE arbre AUTO_INCREMENT = 1')
# Ouvrir le fichier CSV
try:
    with open('Data_Arbre.csv', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Extraire les données pertinentes du fichier CSV
            longitude = row['longitude']
            latitude = row['latitude']
            haut_tot = row['haut_tot']
            haut_tronc = row['haut_tronc']
            tronc_diam = row['tronc_diam']
            remarquable = 1 if row['remarquable'] == 'oui' else 0
            nom = row['fk_nomtech']
            etat = row['fk_arb_etat']
            stade_dev = row['fk_stadedev']
            port = row['fk_port']
            pied = row['fk_pied']
            
            # Insérer les données dans la table 'arbre'
            cursor.execute('''
                INSERT INTO arbre (longitude, latitude, haut_tot, haut_tronc, tronc_diam, remarquable)
                VALUES (%s, %s, %s, %s, %s, %s)
            ''', (longitude, latitude, haut_tot, haut_tronc, tronc_diam, remarquable))
            
            id_arbre = cursor.lastrowid
            
            # Insérer les données dans les autres tables
            cursor.execute('INSERT INTO nom (id_arbre, id_nom, nom) VALUES (%s, %s, %s)', (id_arbre, id_arbre, nom))
            cursor.execute('INSERT INTO etat (id_arbre, id_etat, description) VALUES (%s, %s, %s)', (id_arbre, id_arbre, etat))
            cursor.execute('INSERT INTO stade_dev (id_arbre, id_stadeDev, description) VALUES (%s, %s, %s)', (id_arbre, id_arbre, stade_dev))
            cursor.execute('INSERT INTO port (id_arbre, id_port, description) VALUES (%s, %s, %s)', (id_arbre, id_arbre, port))
            cursor.execute('INSERT INTO pied (id_arbre, id_pied, description) VALUES (%s, %s, %s)', (id_arbre, id_arbre, pied))
except IOError as e:
    print(f"Erreur d'ouverture du fichier CSV: {e}")

# Valider les transactions et fermer la connexion
conn.commit()
cursor.close()
conn.close()
