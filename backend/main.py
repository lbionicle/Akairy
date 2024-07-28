import os
import base64
import uuid
import uvicorn
import shutil

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, FileResponse

from pydantic import BaseModel, Field
from typing import Annotated, List, Optional

from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

from datetime import datetime
from io import BytesIO

from sqlalchemy import or_, func
from fastapi.staticfiles import StaticFiles

import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()

photos_path = "photos"
if not os.path.exists(photos_path):
    os.makedirs(photos_path)

app.mount("/photos", StaticFiles(directory=photos_path), name="photos")


models.Base.metadata.create_all(bind=engine)

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

admin_token = None


def verify_admin_token(x_admin_token: Optional[str] = Header(None)):
    if x_admin_token != str(admin_token):
        raise HTTPException(status_code=403, detail="Недействительный токен администратора")


class Office(BaseModel):
    name: str
    address: str
    options: str
    description: str
    area: float
    price: float
    photos: List[str]


class Login(BaseModel):
    email: str
    password: str


class RegUser(BaseModel):
    lastName: str
    firstName: str
    tel: str
    age: int
    email: str
    password: str


class UpdateUser(BaseModel):
    lastName: str
    firstName: str
    tel: str
    age: int
    email: str
    password: str
    blocked: bool = Field(default=False)


class SearchOffice(BaseModel):
    minArea: float
    maxArea: float
    minPrice: float
    maxPrice: float


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


def create_admin(db: Session):
    global admin_token
    email = "admin@example.com"
    existing_admin = db.query(models.User).filter(models.User.email == email).first()
    if not existing_admin:
        admin_user = models.User(
            lastName="Admin",
            firstName="User",
            tel="000-000-0000",
            age=30,
            email=email,
            password="Pppp2005",
            admin=True,
            blocked=False,
            offices=[],
            token=uuid.uuid4()
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        admin_token = admin_user.token
    else:
        admin_token = existing_admin.token


def save_photos(photos: List[str], office_id: int) -> List[str]:
    photo_paths = []
    photo_directory = f'photos/{office_id}'

    if not os.path.exists(photo_directory):
        os.makedirs(photo_directory)

    for photo_base64 in photos:
        try:
            if photo_base64.startswith("data:image/"):
                header, photo_data = photo_base64.split(",", 1)
                if "jpeg" in header or "jpg" in header:
                    photo_extension = "jpg"
                elif "png" in header:
                    photo_extension = "png"
                elif "gif" in header:
                    photo_extension = "gif"
                else:
                    photo_extension = "jpg"

                photo_data = base64.b64decode(photo_data)

                unique_filename = f"{uuid.uuid4()}.{photo_extension}"
                photo_path = os.path.join(photo_directory, unique_filename).replace('\\', "/")
                with open(photo_path, "wb") as photo_file:
                    photo_file.write(photo_data)

                photo_paths.append(photo_path)
            else:
                raise HTTPException(status_code=400, detail="Invalid photo format")
        except Exception as e:
            print(f"Error saving photo: {e}")
            raise HTTPException(status_code=500, detail="Error saving photo")

    return photo_paths

@app.get("/photos/{office_id}/{photo_filename}")
async def get_photo(office_id: int, photo_filename: str):
    return FileResponse(f"photos/{office_id}/{photo_filename}")

@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    create_admin(db)
    db.close()

@app.post("/reg")
async def register(user: RegUser, db: db_dependency):
    existing_user_email = db.query(models.User).filter(models.User.email == user.email).first()
    existing_user_tel = db.query(models.User).filter(models.User.tel == user.tel).first()

    if existing_user_email:
        return { "detail": "Пользователь с данной электронной почтой уже зарегистрирован"}

    if existing_user_tel:
        return { "detail": "Пользователь с данным номером телефона уже зарегистрирован"}

    db_user = models.User(
    lastName=user.lastName,
    firstName=user.firstName,
    tel=user.tel,
    age=user.age,
    email=user.email,
    password=user.password,
    admin=False,
    blocked=False,
    offices=[],
    token=uuid.uuid4())

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@app.post("/login")
async def login(login: Login, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.email == login.email).first()
    if existing_user:
        if not existing_user.blocked:
            if existing_user.password == login.password:
                role = "Admin" if existing_user.token == admin_token else "User"
                return {"token": existing_user.token, "role": role}
            else:
                return {"detail": "Неверный пароль"}
        else:
            return {"detail": "Пользователь заблокирован"}
    else:
        return {"detail": "Пользователь не найден"}


@app.get("/users/{token}")
async def send_info(token: str, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.token == token).first()
    if existing_user:
        return existing_user
    else:
        return {"detail": "Пользователь не найден"}


@app.put("/users/{token}")
async def update_user(token: str, user: UpdateUser, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.token == token).first()
    if not existing_user:
        return {"detail": "Пользователь не найден"}

    for key, value in user.dict(exclude_unset=True).items():
        setattr(existing_user, key, value)

    db.commit()
    db.refresh(existing_user)
    return {"message": "Данные обновлены"}


@app.delete("/users/{token}", dependencies=[Depends(verify_admin_token)])
async def delete_user(token: str, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.token == token).first()
    if not existing_user:
        return {"detail": "Пользователь не найден"}
    db.delete(existing_user)
    db.commit()
    return {"message": "Пользователь удалён"}


@app.get("/office")
async def get_offices(db: db_dependency):
    offices = db.query(models.Office).all()
    if len(offices) != 0:
        return offices
    else:
        return {"message": "Офисов нет"}


@app.get("/office/{office_id}")
async def get_office(office_id: int, db: db_dependency):
    existing_office = db.query(models.Office).filter(models.Office.id == office_id).first()
    if existing_office:
        return existing_office
    else:
        raise HTTPException(status_code=404, detail="Офис не найден")


@app.post("/office", dependencies=[Depends(verify_admin_token)])
async def create_office(office: Office, db: Session = Depends(get_db)):
    try:
        new_office = models.Office(
            name=office.name,
            address=office.address,
            options=office.options,
            description=office.description,
            area=office.area,
            price=office.price,
            active=True,
            photos=[]
        )
        db.add(new_office)
        db.commit()
        db.refresh(new_office)

        try:
            photo_paths = save_photos(office.photos, new_office.id)
            new_office.photos = photo_paths
            db.commit()
            db.refresh(new_office)
        except Exception as e:
            db.delete(new_office)
            db.commit()
            raise HTTPException(status_code=500, detail="Error saving photos")

        return new_office
    except Exception as e:
        print(f"Error creating office: {e}")
        raise HTTPException(status_code=500, detail="Error creating office")


@app.delete("/office/{office_id}", dependencies=[Depends(verify_admin_token)])
async def delete_office(office_id: int, db: db_dependency):
    existing_office = db.query(models.Office).filter(models.Office.id == office_id).first()
    if not existing_office:
        raise HTTPException(status_code=404, detail="Офис не найден")

    photos_directory = os.path.join("photos", str(office_id))

    db.delete(existing_office)
    db.commit()

    if os.path.exists(photos_directory):
        try:
            shutil.rmtree(photos_directory)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Ошибка при удалении папки с фото: {e}")

    return {"message": "Офис и связанные фото удалены"}


@app.put("/office/{office_id}", dependencies=[Depends(verify_admin_token)])
async def update_office(office_id: int, office: Office, db: db_dependency):
    existing_office = db.query(models.Office).filter(models.Office.id == office_id).first()
    if not existing_office:
        raise HTTPException(status_code=404, detail="Офис не найден")

    photo_directory = f'photos/{office_id}'
    if os.path.exists(photo_directory):
        shutil.rmtree(photo_directory)

    try:
        photo_paths = save_photos(office.photos, office_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating photos: {e}")

    for key, value in office.dict(exclude_unset=True).items():
        if key != 'photos':
            setattr(existing_office, key, value)

    existing_office.photos = photo_paths

    db.commit()
    db.refresh(existing_office)
    return {"message": "Данные обновлены"}


@app.post("/user/{token}/favorite/{office_id}")
async def add_favorite(office_id: int, token: str, db: db_dependency):

    if token == admin_token:
        return {"message": "Администратор не может добавить офис в понравившиеся"}

    existing_user = db.query(models.User).filter(models.User.token == token).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    existing_office = db.query(models.Office).filter(models.Office.id == office_id).first()
    if not existing_office:
        raise HTTPException(status_code=404, detail="Офис не найден")

    if office_id not in existing_user.offices:
        existing_user.offices = existing_user.offices + [office_id]
        db.commit()
        db.refresh(existing_user)

        return {"message": "Офис добавлен в понравившиеся"}
    else:
        return {"message": "Офис уже находится в понравившихся"}


@app.delete("/user/{token}/favorite/{office_id}")
async def delete_favorite(token: str, office_id: int, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.token == token).first()

    if not existing_user:
        return {"message": "Пользователь не найден"}
    else:
        if office_id in existing_user.offices:
            existing_user.offices = list(filter(lambda x: x != office_id, existing_user.offices))

            db.commit()
            db.refresh(existing_user)

            return {"message": "Офис удалён"}
        else:
            return {"message": "Офиса нет в добавленных"}


@app.get("/user/{token}/favorite")
async def get_favorite(token: str, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.token == token).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    else:
        if len(existing_user.offices) != 0:
            return existing_user.offices
        else:
            return {"message": "Офисов нет"}


@app.get("/applications", dependencies=[Depends(verify_admin_token)])
async def get_applications(db: db_dependency):
    applications = db.query(models.App).all()
    if len(applications) != 0:
        return applications
    else:
        return {"message": "Заявок нет"}


@app.get("/user/{token}/applications")
async def get_user_applications(token: str, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.token == token).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    applications = db.query(models.App).filter(models.App.id_user == existing_user.id).all()
    if not applications:
        return {"message": "Заявок нет"}
    return applications


@app.post("/applications/{token}/{office_id}")
async def create_application(token: str, office_id: int, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.token == token).first()

    if not existing_user:
        return {"detail": "Пользователь не найден"}

    if token == admin_token:
        return {"detail": "Администратор не может отправить заявку"}

    existing_application = db.query(models.App).filter(
        models.App.id_user == existing_user.id,
        models.App.id_office == office_id
    ).first()

    if existing_application:
        return {"detail": "Заявка уже отправлена"}

    new_application = models.App(
        id_user=existing_user.id,
        id_office=office_id,
        status=1
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    return {"detail": "Заявка отправлена"}


@app.put("/applications/{app_id}/{status_id}")
async def update_application(app_id: int, status_id: int, db: db_dependency):
    exsisting_application = db.query(models.App).filter(models.App.id == app_id).first()
    if not exsisting_application:
        raise HTTPException(status_code=404, detail="Заявка не найдена")

    setattr(exsisting_application, "status", status_id)

    db.commit()
    db.refresh(exsisting_application)

    if status_id == 0:
        return {"message": "Заявка отменена"}
    else:
        return {"message": "Заявка принята"}


@app.delete("/applications/{app_id}", dependencies=[Depends(verify_admin_token)])
async def delete_application(app_id: int, db: db_dependency):
    existing_application = db.query(models.App).filter(models.App.id == app_id).first()
    if existing_application:
        db.delete(existing_application)
        db.commit()
        db.refresh(existing_application)

        return {"message": "Заявка удалена"}
    else:
        return {"message": "Заявка не найдена"}


@app.get("/users", dependencies=[Depends(verify_admin_token)])
async def get_users(db: db_dependency):
    users = db.query(models.User).filter(models.User.admin == False).order_by(models.User.id).all()
    if len(users) == 0:
        return {"message": "Пользователь нет"}
    else:
        return users


@app.get("/users/id/{user_id}", dependencies=[Depends(verify_admin_token)])
async def get_user(user_id: int, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.id == user_id).first()

    if not existing_user:
        return {"message": "Пользователь не найден"}
    else:
        return existing_user


@app.delete("/users/id/{user_id}", dependencies=[Depends(verify_admin_token)])
async def delete_user(user_id: int, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.id == user_id).first()

    if not existing_user:
        return {"message": "Пользователь не найден"}

    db.delete(existing_user)
    db.commit()

    return {"message": "Пользователь удалён"}


@app.put("/users/id/{user_id}", dependencies=[Depends(verify_admin_token)])
async def update_user(user_id: int, user: UpdateUser, db: db_dependency):
    existing_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not existing_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    for key, value in user.dict(exclude_unset=True).items():
        setattr(existing_user, key, value)

    db.commit()
    db.refresh(existing_user)
    return {"message": "Данные обновлены"}


@app.post("/office/search")
async def search_office(search: SearchOffice, db: db_dependency):
    search_office = db.query(models.Office).filter(models.Office.area >= search.minArea).filter(
        models.Office.area <= search.maxArea).filter(models.Office.price >= search.minPrice).filter(
        models.Office.price <= search.maxPrice).all()

    if search_office:
        return search_office
    else:
        return {"message": "По данным критериям офисов нет"}

@app.get("/users/search/{phone}")
async def search_users(phone: str, db: db_dependency):
    normalized_phone = phone.replace("-", "").replace(" ", "")
    users = db.query(models.User).filter(models.User.admin == False).filter(
        or_(
            func.replace(func.replace(models.User.tel, '-', ''), ' ', '').like(f"%{normalized_phone}%")
        )
    ).all()
    return users

@app.get("/offices/search/{query}")
async def search_offices(query: str, db: db_dependency):
    normalized_query = query.replace("-", "").replace(" ", "").lower()
    offices = db.query(models.Office).filter(
        or_(
            func.lower(func.replace(func.replace(models.Office.name, '-', ''), ' ', '')).like(f"%{normalized_query}%"),
        )
    ).all()
    return offices

@app.get("/export/report/pdf", dependencies=[Depends(verify_admin_token)])
async def export_report_pdf(db: Session = Depends(get_db)):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    timestamp = datetime.now().strftime("%Y-%m-%d-%H:%M:%S")

    pdfmetrics.registerFont(TTFont('TimesNewRoman', 'TimesNewRomanRegular.ttf'))
    pdfmetrics.registerFont(TTFont('TimesNewRoman-Bold', 'TimesNewRomanBold.ttf'))

    c.setFont("TimesNewRoman-Bold", 18)
    c.drawString(30, height - 30, f"Отчёт о системе {timestamp}")

    c.setFont("TimesNewRoman-Bold", 14)
    c.drawString(30, height - 60, "Общая информация о системе")

    users = db.query(models.User).filter(models.User.admin == False).all()
    offices = db.query(models.Office).all()
    applications = db.query(models.App).all()

    c.setFont("TimesNewRoman", 12)
    c.drawString(30, height - 80, f"Количество зарегистрированных пользователей: {len(users)}")
    c.drawString(30, height - 100, f"Количество офисов: {len(offices)}")
    c.drawString(30, height - 120, f"Количество заявок: {len(applications)}")

    c.setFont("TimesNewRoman-Bold", 14)
    c.drawString(30, height - 160, "Информация о пользователях")

    y = height - 180
    c.setFont("TimesNewRoman", 12)
    for user in users:
        text = f"ID: {user.id}, Имя: {user.firstName}, Фамилия: {user.lastName}, Телефон: +{user.tel.replace('-', '')}, Email: {user.email}, Статус: {'Разблокирован' if not user.blocked else 'Заблокирован'}"
        lines = simpleSplit(text, "TimesNewRoman", 12, width - 60)
        for line in lines:
            c.drawString(30, y, line)
            y -= 20
            if y < 50:
                c.showPage()
                y = height - 30
                c.setFont("TimesNewRoman", 12)

    c.setFont("TimesNewRoman-Bold", 14)
    c.drawString(30, y - 40, "Информация об офисах")

    y -= 60
    c.setFont("TimesNewRoman", 12)
    for office in offices:
        text = f"ID: {office.id}, Название: {office.name}, Адрес: {office.address}, Цена: {office.price} BYN, Площадь: {office.area} м2, Статус: {'Активен' if office.active else 'Неактивен'}"
        lines = simpleSplit(text, "TimesNewRoman", 12, width - 60)
        for line in lines:
            c.drawString(30, y, line)
            y -= 20
            if y < 50:
                c.showPage()
                y = height - 30
                c.setFont("TimesNewRoman", 12)

    c.setFont("TimesNewRoman-Bold", 14)
    c.drawString(30, y - 40, "Информация о заявках")

    y -= 60
    c.setFont("TimesNewRoman", 12)
    for app in applications:
        text = f"ID: {app.id}, ID пользователя: {app.id_user}, ID офиса: {app.id_office}, Статус: {'В процессе' if app.status == 1 else 'Отменена' if app.status == 0 else 'Одобрена'}"
        lines = simpleSplit(text, "TimesNewRoman", 12, width - 60)
        for line in lines:
            c.drawString(30, y, line)
            y -= 20
            if y < 50:
                c.showPage()
                y = height - 30
                c.setFont("TimesNewRoman", 12)

    c.save()
    buffer.seek(0)
    filename = f"report_{timestamp}.pdf"
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={filename}"})

if __name__ == '__main__':
    uvicorn.run("main:app", port=1480, host="0.0.0.0", reload=True)
