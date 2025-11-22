# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI()

# CORS middleware for React Native
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple file-based storage (replace with proper DB later)
CHIPS_FILE = "chips.json"

class Chip(BaseModel):
    id: Optional[int] = None
    title: str
    description: str
    category: str
    tags: List[str]
    created_at: str
    updated_at: str

def load_chips():
    if os.path.exists(CHIPS_FILE):
        with open(CHIPS_FILE, 'r') as f:
            return json.load(f)
    return []

def save_chips(chips):
    with open(CHIPS_FILE, 'w') as f:
        json.dump(chips, f)

@app.get("/title")
def get_title():
    return {"title": "Remember chips"}

@app.get("/chips")
def get_chips():
    return load_chips()

@app.post("/chips")
def create_chip(chip: Chip):
    chips = load_chips()
    chip.id = len(chips) + 1
    chips.append(chip.dict())
    save_chips(chips)
    return chip

@app.delete("/chips/{chip_id}")
def delete_chip(chip_id: int):
    chips = load_chips()
    chips = [c for c in chips if c['id'] != chip_id]
    save_chips(chips)
    return {"message": "Chip deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
