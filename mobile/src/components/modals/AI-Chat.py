from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_pinecone import Pinecone
from dotenv import load_dotenv
import json

load_dotenv()

app = FastAPI(title="RayBand Medical AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

index_name = "medicalchatbot"

docsearch = Pinecone.from_existing_index(
    index_name=index_name,
    embedding=embeddings
)

retriever = docsearch.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 3}
)

# -------------------- LLM --------------------
llm = Ollama(
    model="llama3:8b",
    temperature=0.1
)

qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)
# -------------------- LLM --------------------

class Question(BaseModel):
    question: str

MEDICAL_KEYWORDS = [
    "pain", "symptom", "disease", "health", "medicine", "diagnosis",
    "treatment", "fever", "heart", "oxygen", "temperature", "blood",
    "infection", "illness", "fracture", "broken", "broke", "break",
    "injury", "sprain", "bpm", "pressure", "saturation",
    "leg", "arm", "bone", "head", "chest", "stomach", "hurt", "emergency", "help"
]

def is_medical_question(query: str) -> bool:
    q = query.lower()
    return any(word in q for word in MEDICAL_KEYWORDS)


def is_ungrounded_answer(answer: str) -> bool:
    triggers = [
        "i don't know",
        "unable to answer",
        "not mentioned",
        "does not mention",
        "no information",
        "not provided",
        "cannot find",
        "unclear"
    ]
    a = answer.lower()
    return any(t in a for t in triggers)


MEDICAL_RECORD_PATH = "/HealthRecordTest_week_2018-10-15.json"

def load_record():
    with open(MEDICAL_RECORD_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def create_health_summary(record: dict) -> str:
    records = record.get("HealthData", {}).get("Record", [])

    def values(t):
        return [float(r["@value"]) for r in records if r.get("@type") == t]

    hr = values("HKQuantityTypeIdentifierHeartRate")
    ox = values("HKQuantityTypeIdentifierOxygenSaturation")
    temp = values("HKQuantityTypeIdentifierBodyTemperature")

    summary = "Patient summary (last 7 days):\n"

    if hr:
        summary += f"- Avg heart rate: {sum(hr)/len(hr):.1f} bpm\n"
    if ox:
        summary += f"- Avg oxygen saturation: {sum(ox)/len(ox):.1f}%\n"
    if temp:
        summary += f"- Avg body temperature: {sum(temp)/len(temp):.1f}°C\n"

    return summary

def diagnose(record: dict) -> str:
    prompt = f"""
You are a medical assistant.
ONLY use the provided data.
Do not invent anything.

Return:
- Possible issues
- Risks
- Recommended next step

DATA:
{create_health_summary(record)}
"""
    return llm(prompt)



@app.post("/ask")
def ask(q: Question):


    if is_medical_question(q.question):
        # Use Pinecone + QA 
        res = qa({"query": q.question})
        answer = res["result"]


        if is_ungrounded_answer(answer):
            return {
                "answer": "Sorry, I couldn’t find reliable medical information about this in my knowledge base.",
                "sources": []
            }


        sources = []
        for doc in res["source_documents"]:
            sources.append({
                "book": doc.metadata.get("source", "Unknown"),
                "page": doc.metadata.get("page", "N/A")
            })

        return {
            "answer": answer,
            "sources": sources
        }

    else:
        # Non-medical question = answer freely with LLM
        prompt = f"Answer this question: {q.question}"
        answer = llm(prompt)
        return {
            "answer": answer,
            "sources": []
        }

@app.get("/diagnose")
def diagnose_endpoint():
    record = load_record()
    return {
        "diagnosis": diagnose(record)
    }