import pandas as pd
import sys
import traceback

from datasets import Dataset, Features, ClassLabel, Value
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments

def train_model():
    # --- Configuration ---
    TEXT_COLUMN = 'Example'
    LABEL_COLUMN = 'Distortion'
    CSV_PATH = 'ml_cbt_service/distortions.csv' # Correct path from project root
    
    # --- 1. Load and Prepare Dataset ---
    try:
        df = pd.read_csv(CSV_PATH)
    except FileNotFoundError:
        print(f"FATAL ERROR: The data file was not found at '{CSV_PATH}'.")
        print("Please make sure your 'distortions.csv' file is inside the 'ml_c_service' folder.")
        sys.exit()
        
    df = df.dropna(subset=[TEXT_COLUMN, LABEL_COLUMN])

    if df.empty:
        print("FATAL ERROR: The CSV file is empty after removing rows with missing values.")
        sys.exit()

    if not {TEXT_COLUMN, LABEL_COLUMN}.issubset(df.columns):
        print(f"FATAL ERROR: Your CSV file must contain '{TEXT_COLUMN}' and '{LABEL_COLUMN}' columns.")
        sys.exit()

    # --- Data Validation ---
    labels = sorted(df[LABEL_COLUMN].unique().tolist())
    print(f"Found {len(labels)} unique labels for training.")

    if len(labels) < 2:
        print(f"FATAL ERROR: The label column '{LABEL_COLUMN}' only has {len(labels)} unique category.")
        print("A classification model needs at least two different categories to learn from.")
        sys.exit()
    
    label2id = {label: i for i, label in enumerate(labels)}
    id2label = {i: label for i, label in enumerate(labels)}
    df['label'] = df[LABEL_COLUMN].map(label2id)

    # Define the dataset features, casting 'label' as a ClassLabel
    class_label_feature = ClassLabel(names=labels)
    dataset_features = Features({
        TEXT_COLUMN: Value('string'),
        LABEL_COLUMN: class_label_feature, # Can also be ClassLabel if needed elsewhere
        'label': class_label_feature,
    })
    
    # Create the dataset using the defined features
    dataset = Dataset.from_pandas(df, features=dataset_features)
    
    # Perform the train/test split
    train_test_split_dataset = dataset.train_test_split(test_size=0.2, stratify_by_column="label")
    train_dataset = train_test_split_dataset['train']
    test_dataset = train_test_split_dataset['test']
    
    # --- 2. Load Tokenizer and Model ---
    model_name = "distilbert-base-uncased"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForSequenceClassification.from_pretrained(
        model_name, 
        num_labels=len(labels),
        id2label=id2label,
        label2id=label2id
    )
    
    # --- 3. Tokenize the Data ---
    def tokenize(batch):
        return tokenizer(batch[TEXT_COLUMN], padding=True, truncation=True)

    train_dataset = train_dataset.map(tokenize, batched=True)
    test_dataset = test_dataset.map(tokenize, batched=True)
    train_dataset.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])
    test_dataset.set_format('torch', columns=['input_ids', 'attention_mask', 'label'])

    # --- 4. Set up Trainer ---
    training_args = TrainingArguments(
        output_dir='./results',
        num_train_epochs=3,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        warmup_steps=50,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        # The 'evaluation_strategy' argument is removed for compatibility
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=test_dataset,
    )
    
    # --- 5. Train and Save the Model ---
    print("\n🚀 Starting model training...")
    try:
        trainer.train()
        print("\n✅ Training complete.")
        
        model_save_path = "./cbt_model"
        trainer.save_model(model_save_path)
        tokenizer.save_pretrained(model_save_path)
        print(f"\nModel successfully saved to {model_save_path}")

    except Exception as e:
        print("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print("    AN UNEXPECTED ERROR OCCURRED DURING TRAINING")
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n")
        traceback.print_exc()

if __name__ == "__main__":
    train_model()