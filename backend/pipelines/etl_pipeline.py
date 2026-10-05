import os
import sys
import nltk

# Configurar path para importar desde models y database (subiendo un nivel desde pipelines)
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Word, Tag, WordTag

def run_pipeline(clean_db=True):
    print("Descargando WordNet...")
    nltk.download('wordnet')
    from nltk.corpus import wordnet as wn
    from wordfreq import zipf_frequency

    db: Session = SessionLocal()
    
    if clean_db:
        print("Limpiando tablas (WordTag, Word, Tag)...")
        db.query(WordTag).delete()
        db.query(Word).delete()
        db.query(Tag).delete()
        db.commit()
    
    print("Iniciando ETL de WordNet...")
    
    # 1. Crear Tags si no existen
    
    # GRAMMAR Tags
    grammar_tags = {
        'n': 'noun',
        'v': 'verb',
        'a': 'adjective',
        'r': 'adverb',
        's': 'adjective satellite',
        'pron': 'pronoun',
        'prep': 'preposition',
        'conj': 'conjunction',
        'det': 'determiner'
    }
    
    tag_objects = {}
    for pos_key, pos_name in grammar_tags.items():
        tag = db.query(Tag).filter(Tag.type == "GRAMMAR", Tag.description == pos_name).first()
        if not tag:
            tag = Tag(type="GRAMMAR", description=pos_name)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        tag_objects[pos_key] = tag
        
    # LEVEL Tags (CEFR)
    level_tags_names = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
    level_tag_objects = {}
    for lvl in level_tags_names:
        tag = db.query(Tag).filter(Tag.type == "LEVEL", Tag.description == lvl).first()
        if not tag:
            tag = Tag(type="LEVEL", description=lvl)
            db.add(tag)
            db.commit()
            db.refresh(tag)
        level_tag_objects[lvl] = tag
        
    print("Tags de gramática y de nivel (CEFR) cargados/verificados.")
    
    # Obtener todas las palabras de WordNet
    all_words = list(wn.words())
    total = len(all_words)
    print(f"Total palabras disponibles en WordNet: {total}")
    
    # Preparar data existente
    existing_words = {w[0] for w in db.query(Word.word).all()}
    
    words_to_insert = []
    
    batch_size = 5000
    added = 0
    
    print("Insertando nuevas palabras...")
    for i, word_str in enumerate(all_words):
        # Filtrar números y caracteres especiales (solo letras)
        if not word_str.isalpha():
            continue
            
        # WordNet devuelve las palabras compuestas con '_'
        clean_word = word_str.replace('_', ' ')
        if clean_word in existing_words:
            continue
            
        words_to_insert.append({"word": clean_word})
        existing_words.add(clean_word)
        added += 1
        
        if len(words_to_insert) >= batch_size:
            db.bulk_insert_mappings(Word, words_to_insert)
            db.commit()
            words_to_insert = []
            print(f"Procesando WordNet {i}/{total}...")
            
    # ------ Inserción de Palabras "Closed-class" ------
    closed_classes = {
        'pronoun': ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'its', 'our', 'their', 'mine', 'yours', 'hers', 'ours', 'theirs', 'this', 'that', 'these', 'those', 'who', 'whom', 'whose', 'which', 'what'],
        'preposition': ['in', 'on', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'of', 'over', 'under'],
        'conjunction': ['and', 'but', 'or', 'nor', 'for', 'yet', 'so', 'although', 'because', 'since', 'unless', 'if'],
        'determiner': ['the', 'a', 'an', 'this', 'that', 'these', 'those', 'some', 'any', 'every', 'all', 'both', 'either', 'neither', 'much', 'many', 'few', 'little']
    }
    
    extra_word_tags_buffer = []
    
    for tag_name, words in closed_classes.items():
        tag_id = next((t.id for t in tag_objects.values() if t.description == tag_name), None)
        if not tag_id:
            continue
            
        for w in words:
            if w not in existing_words:
                words_to_insert.append({"word": w})
                existing_words.add(w)
                added += 1
            # Para relacionar despues
            extra_word_tags_buffer.append((w, tag_id))

    # Insertar el resto
    if words_to_insert:
        db.bulk_insert_mappings(Word, words_to_insert)
        db.commit()
        
    print(f"Palabras totales insertadas: {added}. Ahora generando relaciones Word-Tag...")
    
    # Función auxiliar para determinar nivel CEFR según frecuencia Zipf
    def get_cefr_level(word):
        z = zipf_frequency(word, 'en')
        if z == 0: return 'C2' # Rara / No encontrada
        if z > 5.5: return 'A1'
        if z > 4.5: return 'A2'
        if z > 3.5: return 'B1'
        if z > 2.5: return 'B2'
        if z > 1.5: return 'C1'
        return 'C2'
    
    # Relaciones WordTag
    # Hacemos fetch de toda la DB para hacer match
    words_db = db.query(Word).all()
    
    existing_word_tags = set((wt.id_word, wt.id_tag) for wt in db.query(WordTag).all())
    
    wts_to_insert = []
    total_db = len(words_db)
    
    for i, w_db in enumerate(words_db):
        word_str = w_db.word.replace(' ', '_') # Convertir de nuevo para buscar en wn
        synsets = wn.synsets(word_str)
        poses = set(s.pos() for s in synsets)
        
        # 1. Tags gramaticales de WordNet
        for p in poses:
            if p in tag_objects:
                tag_id = tag_objects[p].id
                if (w_db.id, tag_id) not in existing_word_tags:
                    wts_to_insert.append({"id_word": w_db.id, "id_tag": tag_id})
                    existing_word_tags.add((w_db.id, tag_id))
                    
        # 2. Agregar relaciones cerradas mapeadas manualmente
        for (ew_word, ew_tag_id) in extra_word_tags_buffer:
            if w_db.word == ew_word and (w_db.id, ew_tag_id) not in existing_word_tags:
                wts_to_insert.append({"id_word": w_db.id, "id_tag": ew_tag_id})
                existing_word_tags.add((w_db.id, ew_tag_id))
                
        # 3. Nivel CEFR (basado en heurística de wordfreq)
        level = get_cefr_level(w_db.word)
        lvl_tag_id = level_tag_objects[level].id
        if (w_db.id, lvl_tag_id) not in existing_word_tags:
            wts_to_insert.append({"id_word": w_db.id, "id_tag": lvl_tag_id})
            existing_word_tags.add((w_db.id, lvl_tag_id))
                    
        if len(wts_to_insert) >= batch_size:
            db.bulk_insert_mappings(WordTag, wts_to_insert)
            db.commit()
            wts_to_insert = []
            print(f"Generando relaciones {i}/{total_db}...")
            
    if wts_to_insert:
        db.bulk_insert_mappings(WordTag, wts_to_insert)
        db.commit()
        
    print(f"ETL completado exitosamente.")
    db.close()

if __name__ == "__main__":
    run_pipeline()
