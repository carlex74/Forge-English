from sqlalchemy import Column, Integer, String
from database import Base

class Sentence(Base):
    __tablename__ = "sentences"

    id_sentence = Column(Integer, primary_key=True, index=True)
    original_sentence = Column(String, nullable=False)
    id_traduction = Column(Integer, index=True)
    traduced_sentence = Column(String, nullable=False)
