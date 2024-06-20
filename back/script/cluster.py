import mysql.connector
import pandas as pd
from sklearn.cluster import KMeans
import json
import sys

# Récupérer le nombre de clusters à partir des arguments
num_clusters = int(sys.argv[1]) if len(sys.argv) > 1 else 3

# Connexion à la base de données
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="bddstquentin"
)

# Requête pour récupérer les données des arbres
query = "SELECT id_arbre, longitude, latitude FROM arbre"
df = pd.read_sql(query, conn)

# Fermer la connexion
conn.close()

# Clustering
kmeans = KMeans(n_clusters=num_clusters)
df['cluster'] = kmeans.fit_predict(df[['longitude', 'latitude']])

# Convertir les résultats en JSON
results = df.to_dict(orient='records')

# Écrire les résultats dans un fichier JSON
with open('./clusters.json', 'w') as f:
    json.dump(results, f)
