![stardewdleTitle](https://github.com/user-attachments/assets/e5f6d8b5-4d5d-4983-bd61-f13012272ed9)

# 🌾 Stardewdle

Stardewdle is a Wordle-style guessing game based on crops from the popular game Stardew Valley.  
Players have 6 attempts to guess the correct crop based on feedback about 5 key attributes:  
**Growth Time**, **Price**, **Regrowth**, **Crop Type**, and **Season**.

Built with **React** on the frontend and an **AWS-supported** backend, the game compares user guesses against a secret crop and provides color-coded feedback — similar to Wordle but for Stardew Valley!

<br />

## 🧠 Gameplay Overview

- 🔍 Guess a crop from Stardew Valley in 6 tries or less.
- 📊 After each guess, see feedback:
  - ✅ Green: exact match
  - 🟡 Yellow: partial match
  - ❌ Red: incorrect
- 🌱 Attributes compared include:
  - Growth Time (days)
  - Sell Price (at Normal quality)
  - Regrows (Yes/No)
  - Crop Type (Fruit/Vegetable/Mushroom/Forage)
  - Season (Spring, Summer, Fall, Winter)

<br />

## 🔧 Tech Stack

- **Frontend**: React, JavaScript, TailwindCSS  
- **Backend**: AWS Lambda (Node.js), API Gateway, DynamoDB  
- **Deployment**: AWS Amplify (Frontend), AWS API Gateway + Lambda (Backend)  
- **Data**: Stardew Valley Wiki (scraped and cleaned using Python scripts - BeautifulSoup + Requests)

<br />

## 🚀 Live Demo

👉 [Play Stardewdle Here](https://main.d1drmb6trexkqn.amplifyapp.com/)

<br />

## 🖼️ Screenshots

![Game Screenshot 1](https://github.com/user-attachments/assets/9f63cf4f-87c8-41b7-89f1-e3a317899fe8)

![Game Screenshot 2](https://github.com/user-attachments/assets/74e6a4d8-02c1-4ea0-a012-5b9e5a8c30ff)
<br />


## 🛠️ Running Locally

```bash
# Clone the repo
git clone https://github.com/chrismarquezz/stardewdle.git
cd stardewdle/stardewdle

# Install frontend dependencies
npm install
npm start
```

> Make sure you have Node.js installed.

<br />

## 👥 Authors

- [Chris Marquez](https://github.com/chrismarquezz)
- [Omar Siddiqui](https://github.com/osid54)
  
<br />

## 📌 Features To Come

Collections - a page to display all crop data.
Statistics - see how many people have guessed a crop already, how much time until the next crop, etc
Sharing - show off how many guesses it took you

<br />

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
