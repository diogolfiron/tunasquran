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

# Add your routes to the router instead of directly to app


@api_router.get("/")
async def root():
    return {"message": "Hello World"}


# Default gallery data (used to seed DB if empty)
# Default gallery data is intentionally left empty so admin controls what appears
gallery_images = []


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


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)

    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])

    return status_checks

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
