from typing import Union
from fastapi import FastAPI,UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PyPDF2 import PdfReader
import google.generativeai as genai

GEMEINI_API_KEY = "AIzaSyDs9FxmpjVrxBprcu0ninclhwRwg8TfxLw"
genai.configure(api_key=GEMEINI_API_KEY)

generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-pro",
  generation_config=generation_config
)

chat_session = model.start_chat(
  history=[
  ]
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/report")
async def upload_report(file: UploadFile = File(...)):

    reader = PdfReader(file.file)
    text = ""
    for page in reader.pages:
        text += page.extract_text()

    if text.strip() == "":
        raise HTTPException(status_code=400, detail="No text found in the PDF or the text is not extractable.")

    prompt = "\n -----------------------------------------------------------------------\nthe given data is extracted from the report pdf so first understand the data and then explain the test in simplest terms to an uneducated person then in the new line, the test is in range or not, and then in new life if the test does not range the give the advice like what to eat what is exercise, etc. This is the format for each test. Do not miss any test. Take your time to understand the data."

    response = chat_session.send_message(text + prompt)

    return {"response": "done", "data": response.text}
