from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from database import Base

class Sentence(Base):
    __tablename__ = "sentences"

    id_sentence = Column(Integer, primary_key=True, index=True)
    original_sentence = Column(String, nullable=False)
    traduced_sentence = Column(String, nullable=False)


# --- FASE 1.5: DOMINIO ESTÁTICO (DICCIONARIO) ---

class WordTag(Base):
    __tablename__ = "word_tag"
    
    id_word = Column(Integer, ForeignKey("word.id"), primary_key=True)
    id_tag = Column(Integer, ForeignKey("tags.id"), primary_key=True)

class Word(Base):
    __tablename__ = "word"
    
    id = Column(Integer, primary_key=True, index=True)
    word = Column(String, nullable=False, unique=True, index=True)
    
    # Relación 1:1 con Explanation
    explanation = relationship("Explanation", back_populates="word", uselist=False)
    # Relación N:M con Tag
    tags = relationship("Tag", secondary="word_tag", back_populates="words")

class Explanation(Base):
    __tablename__ = "explanation"
    
    id_word = Column(Integer, ForeignKey("word.id"), primary_key=True) 
    traduction = Column(String, nullable=False)
    examples = Column(String, nullable=True) # JSON o texto largo separado por saltos de línea
    
    word = relationship("Word", back_populates="explanation")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False, index=True) # Ej: 'Level', 'Syntax', 'Topic', 'Tense'
    description = Column(String, nullable=False) # Ej: 'B1', 'Verbo', 'Mecánica'
    
    words = relationship("Word", secondary="word_tag", back_populates="tags")
