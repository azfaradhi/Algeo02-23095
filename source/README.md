# Image Retrieval dan Music Information Retrieval

<!-- ![OS](https://img.shields.io/badge/OS-Linux%20%7C%20MacBook%20%7C%20Windows%20%7C%20Windows%20WSL-blue?logo=linux)  
![Language](https://img.shields.io/badge/Language-Python%20%7C%20Typescript%20%7C%20HTML%20%7C%20CSS-brightgreen?logo=python&logoColor=white)  
![Build Tool](https://img.shields.io/badge/Tools-FastAPI%20%7C%20Axios-orange?logo=flask)  
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)  
![CLI](https://img.shields.io/badge/CLI-Electron-yellow?logo=electron)   -->

<p align="center">
    <h3 align="center">FOTO KELAS</h3> <br> 
    <img src="homepage.png">
  </a>
</p>

<br/>

## Introduction

Humans interact with the world through key senses like hearing and vision, processing sounds, colors, and images. While humans naturally interpret these sensory inputs through their brain, technology has evolved to mirror these capabilities. Modern computing can detect and analyze both audio and visual information, sometimes surpassing human abilities. For sound, this is done through audio retrieval systems (used in apps like Shazam), while for images, technology can represent visual data as numerical features using algorithms like Eigenvalue, Cosine Similarity, and Euclidean Distance. These systems effectively convert sensory information into computational data that machines can process and analyze.


## Dependencies

### Backend Dependencies (Python):

- FastAPI (0.115.5): Web framework for building APIs with Python.
- NumPy (2.1.3): Library for numerical computations.
- Pillow (11.0.0): Python Imaging Library for image processing.
- Uvicorn (0.32.1): ASGI server for running FastAPI applications.
- Mido (1.3.3): Library for working with MIDI files.
- RarFile (4.2): Library for working with RAR archives.
- Librosa: Library for analyzing and manipulating audio and music.

### Frontend Dependencies (JavaScript/Node):

- **Next.js:** React framework for building web applications.
- **Tailwind CSS:** Utility-first CSS framework for styling.
- **Typesript:** JavaScript with syntax for types.
- **React:** JavaScript library for building user interfaces.


## Prerequisites

Before starting the development process, make sure you have the following software installed on your machine:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Python](https://www.python.org/) (3.6 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) (for managing JavaScript dependencies)
- [Virtualenv](https://virtualenv.pypa.io/) (for creating Python virtual environments)

### 1. Clone the Repository

```bash
git clone https://github.com/azfaradhi/Algeo02-23095.git
cd Algeo02-23095
```

### 2. Navigate to the Source (src) Directory

```
cd source
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Activate Backend

```bash
cd source
cd python_modules
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 5. Run Next.js Development Server

```
npm run dev
```

### 6: Open your browser and navigate to

Client-side is running on [localhost:3000](http://localhost:3000), and the server is on [localhost:8000](http://localhost:8000).

## Project Status

Project is complete


## Maintainers : FOTOKELAS


| NIM      | Nama                   |
| -------- | -----------------------|
| 13523095 | Rafif Farras           |
| 13522101 | Barru Adi Utomo        |
| 13522115 | Azfa Radhiyya Hakim    |