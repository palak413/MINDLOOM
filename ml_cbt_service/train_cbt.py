import pandas as pd
from sklearn.model_selection import train_test_split
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments

def train_model():
    # 1. Load and prepare dataset
    try:
        df = pd.read_csv("distortions.csv")
    except FileNotFoundError:
        print("Error: distortions.csv not found. Please run generate_dataset.py first.")
        return
        
    df = df.dropna()
    
    labels = df['label'].unique().tolist()
    label2id = {label: i for i, label in enumerate(labels)}
    id2label = {i: label for i, label in enumerate(labels)}
    df['label'] = df['label'].map(label2id)

    dataset = Dataset.from_pandas(df)
    train_test_split_dataset = dataset.train_test_split(test_size=0.2)
    train_dataset = train_test_split_dataset['train']
    test_dataset = train_test_split_dataset['test']

    # 2. Load Tokenizer and Model
    model_name = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name, 
        num_labels=len(labels),
        id2label=id2label,
        label2id=label2id
    )

    # 3. Tokenize the data
    def tokenize(batch):
        return tokenizer(batch['text'], padding=True, truncation=True)

    train_dataset = train_dataset.map(tokenize, batched=True)
    test_dataset = test_dataset.map(tokenize, batched=True)
    train_dataset.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])
    test_dataset.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])

    # 4. Set up Trainer
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        warmup_steps=50,
        weight_decay=0.01,
        logging_dir='./logs',
        evaluation_strategy="epoch", # Evaluate at the end of each epoch
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
    )

    # 5. Train and Save the model
    print("Starting model training...")
    trainer.train()
    print("Training complete.")
    
    model_save_path = "./cbt_model"
    trainer.save_model(model_save_path)
    tokenizer.save_pretrained(model_save_path)
    print(f"Model saved to {model_save_path}")

if __name__ == "__main__":
    train_model()