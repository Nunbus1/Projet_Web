import mysql.connector
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import json
import sys

def main():
    try:
        # if len(sys.argv) != 2:
        #     raise ValueError("L'ID de l'arbre doit être fourni comme argument")

        # arbre_id = int(sys.argv[1])
        arbre_id = 1
        # Connexion à la base de données
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="bddstquentin"
        )

        # Requête pour récupérer les données de l'arbre
        query = f"SELECT haut_tot, tronc_diam, remarquable FROM arbre WHERE id_arbre = {arbre_id}"
        df = pd.read_sql(query, conn)

        # Requête pour récupérer les données d'entraînement (à adapter à vos données réelles)
        train_query = "SELECT haut_tot, tronc_diam, remarquable, age_estim FROM arbre"
        train_df = pd.read_sql(train_query, conn)

        # Fermer la connexion
        conn.close()

        # Entraînement du modèle
        X_train = train_df[['haut_tot', 'tronc_diam', 'remarquable']]
        y_train = train_df['age_estim']
        model = RandomForestRegressor()
        model.fit(X_train, y_train)

        # Prédiction de l'âge pour l'arbre spécifié
        X_test = df[['haut_tot', 'tronc_diam', 'remarquable']]
        predicted_age = model.predict(X_test)[0]

        # Résultat
        result = {
            'predicted_age': predicted_age
        }

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({'error': str(e)}))

if __name__ == "__main__":
    main()
