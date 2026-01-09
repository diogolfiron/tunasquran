from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import aiofiles
import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

print("MONGO_URL =", os.environ.get("MONGO_URL"))
print("DB_NAME =", os.environ.get("DB_NAME"))


# Images directory used for uploads and static mounting
IMAGES_DIR = ROOT_DIR.parent / "frontend" / "public" / "images"

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# =========================
# STRUKTUR ORGANISASI MODELS
# =========================

class StrukturItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    jabatan: str
    nama: str
    deskripsi: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StrukturCreate(BaseModel):
    jabatan: str
    nama: str
    deskripsi: Optional[str] = None


class StrukturUpdate(BaseModel):
    jabatan: Optional[str] = None
    nama: Optional[str] = None
    deskripsi: Optional[str] = None

# =========================
# PENGAJAR MODELS
# =========================

class PengajarItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    nama: str
    mapel: str
    deskripsi: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PengajarCreate(BaseModel):
    nama: str
    mapel: str
    deskripsi: Optional[str] = None


class PengajarUpdate(BaseModel):
    nama: Optional[str] = None
    mapel: Optional[str] = None
    deskripsi: Optional[str] = None


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckCreate(BaseModel):
    client_name: str


# Gallery models
class GalleryItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: str
    category: str
    title: str


class GalleryCreate(BaseModel):
    url: str
    category: str
    title: str


class GalleryUpdate(BaseModel):
    url: Optional[str] = None
    category: Optional[str] = None
    title: Optional[str] = None


# Inspirasi models
class InspirasiItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    url: Optional[str] = None
    title: str
    category: Optional[str] = None
    author: Optional[str] = None
    content: Optional[str] = None


class InspirasiCreate(BaseModel):
    url: Optional[str] = None
    title: str
    category: Optional[str] = None
    author: Optional[str] = None
    content: Optional[str] = None


class InspirasiUpdate(BaseModel):
    url: Optional[str] = None
    title: Optional[str] = None
    category: Optional[str] = None
    author: Optional[str] = None
    content: Optional[str] = None

# Visi Misi models
class VisiMisiItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    visi: List[str]
    misi: List[str]
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


class VisiMisiCreate(BaseModel):
    visi: List[str]
    misi: List[str]


class VisiMisiUpdate(BaseModel):
    visi: Optional[List[str]] = None
    misi: Optional[List[str]] = None

class KurikulumItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class KurikulumCreate(BaseModel):
    title: str
    description: Optional[str] = None


class KurikulumUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class FormLinkItem(BaseModel):
    id: str
    link: str

class FormLinkCreate(BaseModel):
    link: str

class FormLinkUpdate(BaseModel):
    link: Optional[str] = None


class JalurItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    biaya: str
    description: Optional[str] = None


class JalurCreate(BaseModel):
    name: str
    biaya: str
    description: Optional[str] = None


class JalurUpdate(BaseModel):
    name: Optional[str] = None
    biaya: Optional[str] = None
    description: Optional[str] = None


class KelasItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: Optional[str] = None


class KelasCreate(BaseModel):
    name: str
    description: Optional[str] = None


class KelasUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class UsahaItem(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class UsahaCreate(BaseModel):
    title: str
    description: Optional[str] = None


class UsahaUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

# Add your routes to the router instead of directly to app


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


# Default gallery data (used to seed DB if empty)
# Default gallery data is intentionally left empty so admin controls what appears
gallery_images = []

form_link_router = APIRouter(prefix="/form-link")

@form_link_router.get("/", response_model=List[FormLinkItem])
async def get_form_links():
    items = await db.form_link.find({}, {"_id": 0}).to_list(1000)
    return items

@form_link_router.post("/", response_model=FormLinkItem)
async def create_form_link(input: FormLinkCreate):
    new_item = FormLinkItem(id=str(uuid.uuid4()), link=input.link)
    await db.form_link.insert_one(new_item.model_dump())
    return new_item

@form_link_router.put("/{item_id}", response_model=FormLinkItem)
async def update_form_link(item_id: str, update: FormLinkUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="Tidak ada data untuk diperbarui")
    
    result = await db.form_link.update_one({"id": item_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Form link tidak ditemukan")
    
    doc = await db.form_link.find_one({"id": item_id}, {"_id": 0})
    return doc

@form_link_router.delete("/{item_id}")
async def delete_form_link(item_id: str):
    res = await db.form_link.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Form link tidak ditemukan")
    return {"deleted": True}

# Include router di api_router
api_router.include_router(form_link_router)


# DELETE link berdasarkan id
@api_router.delete("/{item_id}")
async def delete_form_link(item_id: str):
    res = await db.form_link.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Form link tidak ditemukan")
    return {"deleted": True}


@api_router.get("/pmb/jalur", response_model=List[JalurItem])
async def get_jalur():
    items = await db.pmb_jalur.find({}, {"_id": 0}).to_list(1000)
    return items


@api_router.post("/pmb/jalur", response_model=JalurItem)
async def create_jalur(input: JalurCreate):
    obj = JalurItem(**input.model_dump())
    await db.pmb_jalur.insert_one(obj.model_dump())
    return obj


@api_router.put("/pmb/jalur/{item_id}", response_model=JalurItem)
async def update_jalur(item_id: str, update: JalurUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="Tidak ada data untuk diperbarui")
    result = await db.pmb_jalur.update_one({"id": item_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Jalur tidak ditemukan")
    doc = await db.pmb_jalur.find_one({"id": item_id}, {"_id": 0})
    return doc


@api_router.delete("/pmb/jalur/{item_id}")
async def delete_jalur(item_id: str):
    res = await db.pmb_jalur.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Jalur tidak ditemukan")
    return {"deleted": True}

@api_router.get("/pmb/kelas", response_model=List[KelasItem])
async def get_kelas():
    items = await db.pmb_kelas.find({}, {"_id": 0}).to_list(1000)
    return items


@api_router.post("/pmb/kelas", response_model=KelasItem)
async def create_kelas(input: KelasCreate):
    obj = KelasItem(**input.model_dump())
    await db.pmb_kelas.insert_one(obj.model_dump())
    return obj


@api_router.put("/pmb/kelas/{item_id}", response_model=KelasItem)
async def update_kelas(item_id: str, update: KelasUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="Tidak ada data untuk diperbarui")
    result = await db.pmb_kelas.update_one({"id": item_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kelas tidak ditemukan")
    doc = await db.pmb_kelas.find_one({"id": item_id}, {"_id": 0})
    return doc


@api_router.delete("/pmb/kelas/{item_id}")
async def delete_kelas(item_id: str):
    res = await db.pmb_kelas.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kelas tidak ditemukan")
    return {"deleted": True}

@api_router.get("/gallery", response_model=List[GalleryItem])
async def get_gallery():
    # Try DB first; fallback to default list
    try:
        items = await db.gallery.find({}, {"_id": 0}).to_list(1000)
        if items:
            return items
    except Exception:
        pass
    # ensure each default item has an id when returned
    result = []
    for item in gallery_images:
        copy = item.copy()
        copy.setdefault("id", str(uuid.uuid4()))
        result.append(copy)
    return result


@api_router.post("/gallery", response_model=GalleryItem)
async def create_gallery(input: GalleryCreate):
    obj = GalleryItem(**input.model_dump())
    doc = obj.model_dump()
    try:
        await db.gallery.insert_one(doc)
    except Exception as e:
        logger.exception("Failed to insert gallery item")
        raise HTTPException(status_code=500, detail=str(e))
    return obj


@api_router.post("/gallery/upload")
async def upload_gallery_image(file: UploadFile = File(...)):
    # save uploaded file to frontend/public/images
    if not IMAGES_DIR.exists():
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    dest = IMAGES_DIR / file.filename
    async with aiofiles.open(dest, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)
    return {"url": f"/images/{file.filename}"}


@api_router.get("/inspirasi", response_model=List[InspirasiItem])
async def get_inspirasi():
    try:
        items = await db.inspirasi.find({}, {"_id": 0}).to_list(1000)
        if items:
            return items
    except Exception:
        pass
    return []


@api_router.post("/inspirasi", response_model=InspirasiItem)
async def create_inspirasi(input: InspirasiCreate):
    obj = InspirasiItem(**input.model_dump())
    doc = obj.model_dump()
    try:
        await db.inspirasi.insert_one(doc)
    except Exception as e:
        logger.exception("Failed to insert inspirasi item")
        raise HTTPException(status_code=500, detail=str(e))
    return obj


@api_router.post("/inspirasi/upload")
async def upload_inspirasi_image(file: UploadFile = File(...)):
    if not IMAGES_DIR.exists():
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    dest = IMAGES_DIR / file.filename
    async with aiofiles.open(dest, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)
    return {"url": f"/images/{file.filename}"}

@api_router.post("/visi-misi", response_model=VisiMisiItem)
async def create_or_update_visi_misi(input: VisiMisiCreate):
    data = VisiMisiItem(
        visi=input.visi,
        misi=input.misi,
        updated_at=datetime.now(timezone.utc)
    ).model_dump()

    await db.visi_misi.update_one(
        {},
        {"$set": data},
        upsert=True
    )

    doc = await db.visi_misi.find_one({}, {"_id": 0})
    return doc



@api_router.put("/inspirasi/{item_id}", response_model=InspirasiItem)
async def update_inspirasi(item_id: str, update: InspirasiUpdate):
    update_dict = {k: v for k, v in update.model_dump().items()
                   if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    await db.inspirasi.update_one({"id": item_id}, {"$set": update_dict})
    doc = await db.inspirasi.find_one({"id": item_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Inspirasi item not found")
    return doc


@api_router.delete("/inspirasi/{item_id}")
async def delete_inspirasi(item_id: str):
    res = await db.inspirasi.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inspirasi item not found")
    return {"deleted": True}

@api_router.delete("/visi-misi")
async def delete_visi_misi():
    res = await db.visi_misi.delete_many({})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Visi Misi not found")
    return {"deleted": True}

@api_router.put("/visi-misi/{id}")
async def update_visi_misi(id: str, data: VisiMisiUpdate):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}

    if not update_data:
        raise HTTPException(
            status_code=400,
            detail="Tidak ada data yang dikirim untuk diperbarui"
        )

    result = await db.visi_misi.update_one(
        {"_id": id},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Visi Misi tidak ditemukan"
        )

    updated = await db.visi_misi.find_one({"_id": id})

    return {
        "status": True,
        "message": "Visi Misi berhasil diperbarui",
        "data": updated
    }



@api_router.put("/gallery/{item_id}", response_model=GalleryItem)
async def update_gallery(item_id: str, update: GalleryUpdate):
    update_dict = {k: v for k, v in update.model_dump().items()
                   if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="No fields to update")
    await db.gallery.update_one({"id": item_id}, {"$set": update_dict})
    doc = await db.gallery.find_one({"id": item_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return doc


@api_router.delete("/gallery/{item_id}")
async def delete_gallery(item_id: str):
    res = await db.gallery.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return {"deleted": True}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)

    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/visi-misi", response_model=Optional[VisiMisiItem])
async def get_visi_misi():
    doc = await db.visi_misi.find_one({}, {"_id": 0})
    return doc



@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks

@api_router.get("/kurikulum", response_model=List[KurikulumItem])
async def get_kurikulum():
    """Ambil semua data kurikulum"""
    try:
        items = await db.kurikulum.find({}, {"_id": 0}).to_list(1000)
        return items
    except Exception as e:
        logger.exception("Fetch kurikulum error")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/kurikulum", response_model=KurikulumItem)
async def create_kurikulum(input: KurikulumCreate):
    """Tambah kurikulum baru"""
    obj = KurikulumItem(**input.model_dump())
    doc = obj.model_dump()
    try:
        await db.kurikulum.insert_one(doc)
    except Exception as e:
        logger.exception("Failed to insert kurikulum")
        raise HTTPException(status_code=500, detail=str(e))
    return obj


@api_router.put("/kurikulum/{item_id}", response_model=KurikulumItem)
async def update_kurikulum(item_id: str, update: KurikulumUpdate):
    """Update kurikulum berdasarkan id"""
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}
    if not update_dict:
        raise HTTPException(status_code=400, detail="Tidak ada data untuk diperbarui")
    result = await db.kurikulum.update_one({"id": item_id}, {"$set": update_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Kurikulum tidak ditemukan")
    doc = await db.kurikulum.find_one({"id": item_id}, {"_id": 0})
    return doc


@api_router.delete("/kurikulum/{item_id}")
async def delete_kurikulum(item_id: str):
    """Hapus kurikulum berdasarkan id"""
    res = await db.kurikulum.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Kurikulum tidak ditemukan")
    return {"deleted": True}

# =========================
# TUNAS USAHA ROUTES
# =========================

@api_router.get("/usaha", response_model=List[UsahaItem])
async def get_usaha():
    items = await db.usaha.find({}, {"_id": 0}).to_list(1000)
    return items


@api_router.post("/usaha", response_model=UsahaItem)
async def create_usaha(input: UsahaCreate):
    obj = UsahaItem(**input.model_dump())
    await db.usaha.insert_one(obj.model_dump())
    return obj


@api_router.put("/usaha/{item_id}", response_model=UsahaItem)
async def update_usaha(item_id: str, update: UsahaUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}

    if not update_dict:
        raise HTTPException(status_code=400, detail="Tidak ada data untuk diperbarui")

    result = await db.usaha.update_one(
        {"id": item_id},
        {"$set": update_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Usaha tidak ditemukan")

    doc = await db.usaha.find_one({"id": item_id}, {"_id": 0})
    return doc


@api_router.delete("/usaha/{item_id}")
async def delete_usaha(item_id: str):
    res = await db.usaha.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Usaha tidak ditemukan")
    return {"deleted": True}

# =========================
# STRUKTUR ORGANISASI ROUTES
# =========================

@api_router.get("/struktur", response_model=List[StrukturItem])
async def get_struktur():
    items = await db.struktur.find({}, {"_id": 0}).to_list(1000)
    return items


@api_router.post("/struktur", response_model=StrukturItem)
async def create_struktur(input: StrukturCreate):
    obj = StrukturItem(**input.model_dump())
    await db.struktur.insert_one(obj.model_dump())
    return obj


@api_router.put("/struktur/{item_id}", response_model=StrukturItem)
async def update_struktur(item_id: str, update: StrukturUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}

    if not update_dict:
        raise HTTPException(
            status_code=400,
            detail="Tidak ada data untuk diperbarui"
        )

    result = await db.struktur.update_one(
        {"id": item_id},
        {"$set": update_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Struktur organisasi tidak ditemukan"
        )

    doc = await db.struktur.find_one({"id": item_id}, {"_id": 0})
    return doc


@api_router.delete("/struktur/{item_id}")
async def delete_struktur(item_id: str):
    res = await db.struktur.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Struktur organisasi tidak ditemukan"
        )
    return {"deleted": True}

# =========================
# PENGAJAR ROUTES
# =========================

@api_router.get("/pengajar", response_model=List[PengajarItem])
async def get_pengajar():
    items = await db.pengajar.find({}, {"_id": 0}).to_list(1000)
    return items


@api_router.post("/pengajar", response_model=PengajarItem)
async def create_pengajar(input: PengajarCreate):
    obj = PengajarItem(**input.model_dump())
    await db.pengajar.insert_one(obj.model_dump())
    return obj


@api_router.put("/pengajar/{item_id}", response_model=PengajarItem)
async def update_pengajar(item_id: str, update: PengajarUpdate):
    update_dict = {k: v for k, v in update.model_dump().items() if v is not None}

    if not update_dict:
        raise HTTPException(
            status_code=400,
            detail="Tidak ada data untuk diperbarui"
        )

    result = await db.pengajar.update_one(
        {"id": item_id},
        {"$set": update_dict}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Pengajar tidak ditemukan"
        )

    doc = await db.pengajar.find_one({"id": item_id}, {"_id": 0})
    return doc


@api_router.delete("/pengajar/{item_id}")
async def delete_pengajar(item_id: str):
    res = await db.pengajar.delete_one({"id": item_id})
    if res.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="Pengajar tidak ditemukan"
        )
    return {"deleted": True}

# Include the router in the main app
app.include_router(api_router)

# Mount images static directory if present
if IMAGES_DIR.exists():
    app.mount("/images", StaticFiles(directory=str(IMAGES_DIR)), name="images")
else:
    logging.getLogger(__name__).warning(
        f"Images directory not found: {IMAGES_DIR} — static '/images' not mounted"
    )


@app.on_event("startup")
async def seed_gallery():
    try:
        count = await db.gallery.count_documents({})
        if count == 0:
            docs = []
            for it in gallery_images:
                copy = it.copy()
                copy.setdefault("id", str(uuid.uuid4()))
                docs.append(copy)
            if docs:
                await db.gallery.insert_many(docs)
                logging.getLogger(__name__).info(
                    "Seeded gallery collection with default images")
    except Exception as e:
        logging.getLogger(__name__).warning(
            f"Could not seed gallery collection: {e}")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
