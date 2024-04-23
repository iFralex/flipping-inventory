import os
import zipfile

# Percorso della cartella contenente i file ZIP
cartella_zip = '/Users/alessioantonucci/Downloads/nes-romset-ultra-us'

# Funzione per estrarre i file ZIP e rimuovere i file ZIP dopo l'estrazione
def estrai_e_rimuovi_zip(cartella_zip):
    # Loop attraverso tutti i file nella cartella
    for nome_file in os.listdir(cartella_zip):
        percorso_file = os.path.join(cartella_zip, nome_file)
        
        # Controlla se il file è un file ZIP
        if nome_file.endswith('.zip'):
            # Estrai il file ZIP
            with zipfile.ZipFile(percorso_file, 'r') as zip_ref:
                zip_ref.extractall(cartella_zip)
            
            # Rimuovi il file ZIP dopo l'estrazione
            os.remove(percorso_file)

# Esegui la funzione per estrarre i file ZIP e rimuovere i file ZIP dopo l'estrazione
estrai_e_rimuovi_zip(cartella_zip)
