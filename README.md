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
  - Crop Type (Fruit/Vegetable/Mushroom)
  - Season (Spring, Summer, Fall, Winter)

<br />

## 🔧 Tech Stack

- **Frontend**: React, TailwindCSS
- **Backend**: (Insert Backend Here)
- **Deployment**: AWS Amplify (Frontend), (Insert Backend Here)
- **Data**: Stardew Valley Wiki (scraped and cleaned)

<br />

## 🚀 Live Demo

👉 [Play Stardewdle Here]([https://your-deployed-site-link.com](https://main.d1drmb6trexkqn.amplifyapp.com/))

<br />

## 🖼️ Screenshots

| Guess Board | Attribute Feedback |
|-------------|--------------------|
| ![Game Screenshot 1](<img width="1728" alt="Screenshot 2025-05-25 at 1 26 38 PM" src="https://github.com/user-attachments/assets/d1f417a6-9316-47d1-ac64-6251626024fb" />)
 | ![Game Screenshot 2](<img width="1728" alt="Screenshot 2025-05-25 at 1 27 01 PM" src="https://github.com/user-attachments/assets/91a87852-2d5a-4a39-a6d0-dcc50def145a" />)
 |
<br />


## 🛠️ Running Locally

```bash
# Clone the repo
git clone https://github.com/chrismarquezz/stardewdle.git
cd stardewdle

# Install frontend dependencies
cd frontend
npm install
npm start

# In another terminal, start backend
cd backend
pip install -r requirements.txt
flask run
```

> Make sure you have Node.js installed.

<br />

## 👥 Authors

- [Chris Marquez](https://github.com/chrismarquezz)
- [Omar Siddiqui](https://github.com/osid54)
  
<br />

## 📌 Features To Come

<br />

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
