import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.optimizers import SGD, Adam
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Generate synthetic dataset
X, y = make_classification(n_samples=1000, n_features=20, n_informative=15, 
                           n_redundant=5, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale the features
scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)

# Build a simple neural network model
def create_model():
    model = Sequential([
        Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
        Dense(32, activation='relu'),
        Dense(1, activation='sigmoid')
    ])
    return model

# Train and evaluate the model with different optimizers
def train_with_optimizer(optimizer, name):
    model = create_model()
    model.compile(optimizer=optimizer, loss='binary_crossentropy', metrics=['accuracy'])
    history = model.fit(X_train, y_train, validation_data=(X_test, y_test), 
                        epochs=20, batch_size=32, verbose=0)
    return history

# Initialize optimizers
gd_optimizer = SGD(learning_rate=0.01)
sgd_optimizer = SGD(learning_rate=0.01)
adam_optimizer = Adam(learning_rate=0.01)

# Train models
history_gd = train_with_optimizer(gd_optimizer, "Gradient Descent")
history_sgd = train_with_optimizer(sgd_optimizer, "Stochastic Gradient Descent")
history_adam = train_with_optimizer(adam_optimizer, "Adam")

# Plotting results
def plot_results(histories, metric):
    plt.figure(figsize=(12, 6))
    for name, history in histories.items():
        plt.plot(history.history[metric], label=f'{name} ({metric})')
    plt.xlabel('Epochs')
    plt.ylabel(metric.capitalize())
    plt.title(f'Model {metric.capitalize()} Comparison')
    plt.legend()
    plt.grid()
    plt.show()

histories = {
    'Gradient Descent': history_gd,
    'Stochastic Gradient Descent': history_sgd,
    'Adam': history_adam
}

# Visualize Loss and Accuracy
plot_results(histories, 'loss')
plot_results(histories, 'accuracy')
