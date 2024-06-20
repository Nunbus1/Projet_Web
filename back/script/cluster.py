# import subprocess
# import sys

# # Fonction pour installer un package
# def install(package):
#     subprocess.check_call([sys.executable, "-m", "pip", "install", package])

# # Liste des packages nécessaires
# required_packages = ["mysql-connector-python", "pandas", "scikit-learn"]

# # Installation des packages
# for package in required_packages:
#     try:
#         __import__(package)
#     except ImportError:
#         install(package)

import mysql.connector
import pandas as pd
from sklearn.cluster import KMeans
import json
import sys

def main():
    try:
        if len(sys.argv) != 2:
            raise ValueError("Le nombre de clusters doit être fourni comme argument")

        if sys.argv[1] == 0:
            raise ValueError("Le nombre de clusters doit être fourni comme argument")
        num_clusters = int(sys.argv[1])
        # num_clusters = 3

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
        json_file_path = '../script/clusters.json'
        with open(json_file_path, 'w') as f:
            json.dump(results, f)

        print("Clustering réussi")

    except Exception as e:
        print(f"Erreur: {e}")

if __name__ == "__main__":
    main()
