from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DECIMAL, ARRAY
from sqlalchemy.orm import relationship, backref
from database import Base

class User(Base):
    __tablename__ = "User"
    id = Column(Integer, primary_key=True, index=True)
    lastName = Column(String(255), index=True)
    firstName = Column(String(255), index=True)
    tel = Column(String(20), index=True)
    age = Column(Integer, index=True)
    email = Column(String(255), index=True)
    password = Column(String(255), index=True)
    admin = Column(Boolean, default=False, index=True)
    blocked = Column(Boolean, default=False, index=True)
    token = Column(String(255), index=True)
    offices = Column(ARRAY(Integer), index=True)
    applications = relationship("App", backref="user", cascade="all, delete", passive_deletes=True)

class Office(Base):
    __tablename__ = "Office"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    address = Column(String(255), index=True)
    options = Column(Text, index=True)
    description = Column(Text, index=True)
    area = Column(DECIMAL, index=True)
    price = Column(DECIMAL, index=True)
    active = Column(Boolean, default=True, index=True)
    photos = Column(ARRAY(Text), index=True)
    applications = relationship("App", backref="office", cascade="all, delete", passive_deletes=True)

class App(Base):
    __tablename__ = "Application"
    id = Column(Integer, primary_key=True, index=True)
    id_user = Column(Integer, ForeignKey("User.id", ondelete="CASCADE"), index=True)
    id_office = Column(Integer, ForeignKey("Office.id", ondelete="CASCADE"), index=True)
    status = Column(Integer, index=True)
