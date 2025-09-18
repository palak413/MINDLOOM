import google.generativeai as genai
import csv
import os
from dotenv import load_dotenv

# Load API key from .env (make sure .env is in your root folder)
load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# List of distortions you want data for
distortions = [
    "All-or-Nothing Thinking",
    "Overgeneralization",
    "Mental Filter",
    "Disqualifying the Positive",
    "Jumping to Conclusions",
    "Magnification and Minimization",
    "Emotional Reasoning",
    "Should Statements",
    "Labeling and Mislabeling",
    "Personalization",
]

# Prompt template
prompt_template = """
You are helping create examples of cognitive distortions for a mental health journaling app.
Focus on the distortion: "{distortion}".

Task:
- Generate 50 short, realistic examples of negative self-talk or journal entries.
- Each example should sound like a real person writing in their journal.
- Keep each example between 1–2 sentences.
- Vary the topics: work, school, relationships, self-worth, health, and daily life.
- Do NOT number or label them; just return them as plain text, one per line.

Output format:
One example per line, no extra commentary.

"""
from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


# Create model
model = genai.GenerativeModel("gemini-2.5-flash")

# Write to CSV
with open("distortions.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Distortion", "Example"])

    for distortion in distortions:
        print(f"Generating 50 examples for '{distortion}'...")
        prompt = prompt_template.format(distortion=distortion)
        response = model.generate_content(prompt)

        if not response or not response.text:
            print(f"⚠️ No response for {distortion}")
            continue

        examples = response.text.strip().split("\n")
        for ex in examples:
            if ex.strip():
                writer.writerow([distortion, ex.strip()])

print("✅ distortions.csv generated successfully!")
