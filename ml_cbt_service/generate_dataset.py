import os
import openai
import pandas as pd
from dotenv import load_dotenv

# Load the OPENAI_API_KEY from your main project's .env file
# This path assumes ml_cbt_service is in the project root alongside src
load_dotenv('../.env') 
openai.api_key = os.getenv("OPENAI_API_KEY")

DISTORTIONS = [
    "All-or-Nothing Thinking",
    "Overgeneralization",
    "Mental Filter",
    "Catastrophizing",
    "Personalization"
]

def generate_examples(distortion_name, n_examples=50):
    """Generates synthetic journal entries for a given distortion."""
    print(f"Generating {n_examples} examples for '{distortion_name}'...")
    prompt = f"""
    You are an expert in Cognitive Behavioral Therapy.
    Generate {n_examples} distinct examples of a person writing in their journal who is using the '{distortion_name}' cognitive distortion.
    The examples should be realistic, varied in topic (work, relationships, health), and 1-2 sentences long.
    Output a python list of strings, where each string is a single example.
    Example output: ["example 1", "example 2", "example 3"]
    """
    
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        content = response.choices[0].message.content
        example_list = eval(content) # Use eval to parse the string representation of a list
        return [{"text": text, "label": distortion_name} for text in example_list]
    except Exception as e:
        print(f"Error parsing response for {distortion_name}: {e}")
        return []

if __name__ == "__main__":
    all_data = []
    for distortion in DISTORTIONS:
        all_data.extend(generate_examples(distortion))
    
    if all_data:
        df = pd.DataFrame(all_data)
        df.to_csv("distortions.csv", index=False)
        print(f"\nDataset created successfully at distortions.csv with {len(df)} records.")
    else:
        print("\nCould not generate dataset. Please check your API key and try again.")