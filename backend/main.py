from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
import os
import shutil
import uuid

from database import SessionLocal, engine, Base
from models import Gallery
from schemas import GalleryResponse

# =========================
# INIT APP
# =========================

app = FastAPI(title="API Galeri Tunas Quran")

Base.metadata.create_all(bind=engine)

# =========================
# ROOT
# =========================


@app.get("/")
def root():
    return {"status": "API berjalan 🚀"}

# =========================
# FOLDER UPLOAD
# =========================


UPLOAD_DIR = "uploads/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/images", StaticFiles(directory=UPLOAD_DIR), name="images")

# =========================
# DEPENDENCY DB
# =========================


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================
# GET SEMUA GALERI
# =========================


@app.get("/gallery", response_model=list[GalleryResponse])
def get_gallery(db: Session = Depends(get_db)):
    return db.query(Gallery).all()

# =========================
# GET GALERI BY KATEGORI
# =========================


@app.get("/gallery/category/{category}", response_model=list[GalleryResponse])
def get_by_category(category: str, db: Session = Depends(get_db)):
    return db.query(Gallery).filter(Gallery.category == category).all()

# =========================
# POST GALERI + UPLOAD GAMBAR
# =========================


@app.post("/gallery", response_model=GalleryResponse)
def create_gallery(
    category: str = Form(...),
    title: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    ext = image.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    gallery = Gallery(
        url=f"/images/{filename}",
        category=category,
        title=title
    )

    db.add(gallery)
    db.commit()
    db.refresh(gallery)
    return gallery

# =========================
# DELETE GALERI
# =========================


@app.delete("/gallery/{gallery_id}")
def delete_gallery(gallery_id: int, db: Session = Depends(get_db)):
    gallery = db.query(Gallery).filter(Gallery.id == gallery_id).first()
    if not gallery:
        raise HTTPException(status_code=404, detail="Data tidak ditemukan")

    file_name = gallery.url.replace("/images/", "")
    file_path = os.path.join(UPLOAD_DIR, file_name)

    if os.path.exists(file_path):
        os.remove(file_path)

    db.delete(gallery)
    db.commit()
    return {"message": "Gallery berhasil dihapus"}
