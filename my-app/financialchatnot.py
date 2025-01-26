from fastapi import FastAPI
from pydantic import BaseModel
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# Load your model and tokenizer from the 'model' directory
model_directory = "my-app/model/financialchatbox"  # Path to the model directory

model = AutoModelForCausalLM.from_pretrained(model_directory)
tokenizer = AutoTokenizer.from_pretrained(model_directory)

# Initialize FastAPI app
app = FastAPI()

# Define the input schema
class InputData(BaseModel):
    question: str
    context: str

# Define the inference endpoint
@app.post("/predict")
async def predict(input_data: InputData):
    question = input_data.question
    context = input_data.context
    # Tokenize input
    inputs = tokenizer(f"### Question: {question}\n### Context: {context}", return_tensors="pt").to("cuda")
    # Generate a response from the model
    outputs = model.generate(inputs["input_ids"], max_length=256, num_return_sequences=1)
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
