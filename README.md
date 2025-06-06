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
  - Crop Type (Fruit/Vegetable/Mushroom/Forage/Flower)
  - Season (Spring, Summer, Fall, Winter)

<br />

## 🔧 Tech Stack

- **Frontend**: React, JavaScript, TailwindCSS  
- **Backend**: AWS Lambda (Node.js), API Gateway, DynamoDB  
- **Deployment**: AWS Amplify (Frontend), AWS API Gateway + Lambda (Backend)  
- **Data**: Stardew Valley Wiki (scraped and cleaned using Python scripts - BeautifulSoup + Requests)

<br />

## 🚀 Live Demo

👉 [Play Stardewdle Here](https://stardewdle.com/)

<br />

## 🖼️ Screenshots

![Game Screenshot 1](https://github.com/user-attachments/assets/b2aaffd4-cb23-4fb7-b491-64afa6862eee)

![Game Screenshot 2](https://github.com/user-attachments/assets/b4578f36-07a0-4c78-b470-d55ce3f90a5f)

![Game Screenshot 3](https://github.com/user-attachments/assets/ebf53c50-5e0e-4f04-834e-05a972501bde)



<br />

## 🛠️ Running Locally

```bash
# Clone the repo
git clone https://github.com/chrismarquezz/stardewdle.git
cd frontend/stardewdle

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

- Nothing new for now

<br />

## 📄 Credits

All images and sound assets used in this game are created by **ConcernedApe** for *Stardew Valley*.  
This project is a fan-made game and is not affiliated with or endorsed by **ConcernedApe**.

<br />

## Disclaimer

This project is for educational and personal use only.  
No copyright infringement is intended.
