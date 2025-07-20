# 📚 Bookshelf App

Modern and elegant bookshelf application with glassmorphism design. Built with vanilla HTML, CSS, and JavaScript for managing your personal book collection.

## ✨ Features

- **📖 Book Management**: Add, edit, delete, and organize your books
- **🔍 Search Functionality**: Find books quickly by title
- **📊 Reading Status**: Track books as "Read" or "Unread"
- **💾 Local Storage**: Data persists between browser sessions
- **🎨 Glassmorphism UI**: Modern glass-effect design with beautiful animations
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **🔗 Social Links**: Connect via LinkedIn, GitHub, and Instagram

## 🚀 Live Demo

Visit the live application: [Bookshelf App on Netlify](https://your-bookshelf-app.netlify.app)

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and accessibility
- **CSS3**: 
  - Glassmorphism effects with backdrop-filter
  - CSS Grid and Flexbox for layouts
  - CSS Variables for consistent theming
  - Smooth animations and transitions
  - Responsive design with media queries
- **Vanilla JavaScript**:
  - ES6+ features
  - Local Storage API
  - DOM manipulation
  - Event handling

## 📂 Project Structure

```
bookshelf-app/
├── index.html          # Main HTML file
├── styles.css          # Main stylesheet with glassmorphism design
├── glass.css           # Additional glass effects (if exists)
├── main.js             # JavaScript functionality
└── README.md           # Project documentation
```

## 🎨 Design Features

### Glassmorphism Theme
- Semi-transparent elements with backdrop blur
- Subtle borders and shadows
- Modern gradient backgrounds
- Interactive hover effects

### Responsive Layout
- Mobile-first approach
- Adaptive grid system
- Touch-friendly controls
- Optimized for all screen sizes

## 🔧 Installation & Setup

### Local Development
1. **Clone the repository**
   ```bash
   git clone https://github.com/Wissasono11/Bookshelf-App.git
   cd Bookshelf-App
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or use a local server (recommended)
   npx serve .
   # or
   python -m http.server 8000
   ```

3. **Access the app**
   ```
   http://localhost:8000
   ```

## 📱 Usage Guide

### Adding a Book
1. Fill in the book details (Title, Author, Year)
2. Check "Selesai dibaca" if you've finished reading
3. Click "Masukkan Buku ke rak"

### Managing Books
- **Edit**: Click the blue "Edit buku" button
- **Delete**: Click the red "Hapus buku" button  
- **Toggle Status**: Click the status button to mark as read/unread

### Searching Books
- Use the search form to find books by title
- Results update dynamically

## 🎯 Key Components

### Book Item Structure
```html
<div data-bookid="unique-id" data-testid="bookItem">
  <h3 data-testid="bookItemTitle">Book Title</h3>
  <p data-testid="bookItemAuthor">Author: Book Author</p>
  <p data-testid="bookItemYear">Year: 2024</p>
  <div>
    <button data-testid="bookItemIsCompleteButton">Status Button</button>
    <button data-testid="bookItemDeleteButton">Hapus buku</button>
    <button data-testid="bookItemEditButton">Edit buku</button>
  </div>
</div>
```

## 🌐 Deployment

### Netlify Deployment
This app is deployed on Netlify with automatic deployments from GitHub.

**Deployment Steps:**
1. Connect GitHub repository to Netlify
2. Configure build settings (static site)
3. Deploy from `main` branch
4. Access via generated Netlify URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development Guidelines
- Maintain glassmorphism design consistency
- Ensure responsive design works on all devices
- Test functionality thoroughly
- Follow existing code style

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by modern glassmorphism design trends
- Built as part of front-end development learning journey
- Special thanks to the web development community

---

Made with ❤️ and modern web technologies | 2025 Bookshelf App
https://github.com/Wissasono11/Bookshelf-App.git