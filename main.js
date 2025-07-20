const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

function generateId() {
    return +new Date();
}

/**
 * Fungsi ini digunakan untuk membuat objek buku baru
 * @param {number} id - ID buku
 * @param {string} title - Judul
 * @param {string} author - Penulis
 * @param {number} year - Tahun terbit
 * @param {boolean} isComplete - Status apakah buku sudah selesai dibaca atau belum
*/
function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
};



// fungsi untuk menambahkan buku baru ke dalam daftar
function addBook() {
    const id = generateId();
    const title = document.getElementById('bookFormTitle').value;
    const author = document.getElementById('bookFormAuthor').value;
    const year = parseInt(document.getElementById('bookFormYear').value);
    const isComplete = document.getElementById('bookFormIsComplete').checked;

    const bookObject = generateBookObject(id, title, author, year, isComplete);
    books.push(bookObject);

    // reset form 
    document.getElementById('bookFormTitle').value = '';
    document.getElementById('bookFormAuthor').value = '';
    document.getElementById('bookFormYear').value = '';    
    document.getElementById('bookFormIsComplete').checked = false;
    
    // Reset text pada tombol submit
    const submitButton = document.getElementById('bookFormSubmit');
    const span = submitButton.querySelector('span');
    span.innerText = 'Belum selesai dibaca';

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// fungsi untuk mencari buku berdasarkan ID atau judul
function findBook(id) {
    for (const book of books) {
        if (book.id === id) {
            return book;
        }
    };
    return null;
};

// fungsi untuk mencari indeks buku berdasarkan ID atau judul namun mengembalikan -1 jika tidak ditemukan
function findBookIndex(id) {
    for (let index = 0; index < books.length; index++) {
        if (books[index].id === id) {
            return index;
        }
    }
    return -1;
}

// fungsi untuk menghapus buku dari daftar
function removeBook(id) {
    const bookIndex = findBookIndex(id);
    if(bookIndex === -1) return;
    books.splice(bookIndex, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// fungsi untuk mengubah status buku menjadi selesai dibaca
function completeBookFromUncompleted(id) {
    const book = findBook(id); 
    if (book == null) return;
    book.isComplete = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// fungsi untuk mengubah status buku menjadi belum selesai dibaca
function undoBookFromCompleted(id) {
    const book = findBook(id);
    if(book == null) return;
    book.isComplete = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// fungsi untuk mengedit identitas buku
function editBook(id, title, author, year, isComplete) {
    const bookIndex = findBookIndex(id);
    if (bookIndex === -1) return;

    books[bookIndex].title = title;
    books[bookIndex].author = author;
    books[bookIndex].year = year;
    books[bookIndex].isComplete = isComplete;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// fungsi untuk pencarin buku berdasarkan judul, author, atau tahun
function searchBooks(query) {
    return books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase()) ||
        book.year.toString().includes(query)   
    );
};

// fungsi untuk menyimpan data buku ke localStorage
function saveData() {
    if(isStorageExist()) {
        const serializedData = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, serializedData);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
};

// fungsi untuk memeriksa apakah localStorage didukung oleh browser atau tidak
function isStorageExist() {
    if (typeof(Storage) === 'undefined') {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
};

// fungsi untuk memuat data buku dari localStorage
function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if(data !== null) {
        for(const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

// menambahkan event listener untuk DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    const submitForm = document.getElementById('bookForm');
    submitForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById('searchBook');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        searchBook();
    });

    // Event listener untuk input pencarian (pencarian real-time)
    const searchInput = document.getElementById('searchBookTitle');
    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            renderBooks(); // Tampilkan semua buku jika input kosong
        } else {
            searchBook();
        }
    });

    // Event listener untuk checkbox form
    const checkboxComplete = document.getElementById('bookFormIsComplete');
    const submitButton = document.getElementById('bookFormSubmit');
    checkboxComplete.addEventListener('change', () => {
        const span = submitButton.querySelector('span');
        if (checkboxComplete.checked) {
            span.innerText = 'Selesai dibaca';
        } else {
            span.innerText = 'Belum selesai dibaca';
        }
    });

    // Event listener untuk modal edit
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editBookForm');
    const closeButton = document.querySelector('#editModal .close');
    const cancelButton = document.getElementById('cancelEdit');

    // Event listener untuk form edit
    editForm.addEventListener('submit', handleEditSubmit);

    // Event listener untuk tombol close (X)
    closeButton.addEventListener('click', hideEditModal);

    // Event listener untuk tombol cancel
    cancelButton.addEventListener('click', hideEditModal);

    // Event listener untuk klik di luar modal
    window.addEventListener('click', (event) => {
        if (event.target === editModal) {
            hideEditModal();
        }
    });

    // Event listener untuk tombol ESC
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && editModal.style.display === 'block') {
            hideEditModal();
        }
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

    // Event listener untuk modal hapus buku
    const deleteModal = document.getElementById('deleteModal');
    const deleteForm = document.getElementById('deleteBookForm');
    const closeDeleteButton = document.querySelector('#deleteModal .close');
    const cancelDeleteButton = document.getElementById('cancelDelete');

    // Event listener untuk form hapus
    deleteForm.addEventListener('submit', handleDeleteSubmit);

    // Event listener untuk tombol close (X) pada modal hapus
    closeDeleteButton.addEventListener('click', hideDeleteModal);

    // Event listener untuk tombol cancel pada modal hapus
    cancelDeleteButton.addEventListener('click', hideDeleteModal);

    // Event listener untuk klik di luar modal hapus
    window.addEventListener('click', (event) => {
        if(event.target === deleteModal) {
            hideDeleteModal();
        }
    });

    // Event listener untuk tombol ESC modal hapus
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && deleteModal.style.display === 'block') {
            hideEditModal();
        }
    });

    
});

// Fungsi untuk membuat elemen buku
function makeBookItem(bookObject) {
    const bookItem = document.createElement('div');
    bookItem.setAttribute('data-bookid', bookObject.id);
    bookItem.setAttribute('data-testid', 'bookItem');

    const bookTitle = document.createElement('h3');
    bookTitle.setAttribute('data-testid', 'bookItemTitle');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
    bookAuthor.innerText = `Penulis: ${bookObject.author}`;

    const bookYear = document.createElement('p');
    bookYear.setAttribute('data-testid', 'bookItemYear');
    bookYear.innerText = `Tahun: ${bookObject.year}`;

    const buttonContainer = document.createElement('div');

    const completeButton = document.createElement('button');
    completeButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    
    if (bookObject.isComplete) {
        completeButton.innerText = 'Belum selesai dibaca';
        completeButton.classList.add('complete');
        completeButton.addEventListener('click', () => {
            undoBookFromCompleted(bookObject.id);
        });
    } else {
        completeButton.innerText = 'Selesai dibaca';
        completeButton.classList.add('incomplete');
        completeButton.addEventListener('click', () => {
            completeBookFromUncompleted(bookObject.id);
        });
    }

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.innerText = 'Hapus buku';
    deleteButton.addEventListener('click', () => {
        showDeleteModal(bookObject.id);
    });

    const editButton = document.createElement('button');
    editButton.setAttribute('data-testid', 'bookItemEditButton');
    editButton.innerText = 'Edit buku';
    editButton.addEventListener('click', () => {
        showEditModal(bookObject.id);
    });

    buttonContainer.append(completeButton, deleteButton, editButton);
    bookItem.append(bookTitle, bookAuthor, bookYear, buttonContainer);

    return bookItem;
}

// Variabel untuk menyimpan ID buku yang sedang diedit
let currentEditingBookId = null;

// Variabel untuk menyimpan ID buku yang sedang dihapus
let currentDeletingBookId = null;

// Fungsi untuk menampilkan modal edit buku
function showEditModal(id) {
    const book = findBook(id);
    if (!book) return;

    currentEditingBookId = id;
    
    // Isi form dengan data buku yang akan diedit
    document.getElementById('editBookTitle').value = book.title;
    document.getElementById('editBookAuthor').value = book.author;
    document.getElementById('editBookYear').value = book.year;
    document.getElementById('editBookIsComplete').checked = book.isComplete;
    
    // Tampilkan modal
    document.getElementById('editModal').style.display = 'block';
}

// Fungsi untuk menyembunyikan modal edit
function hideEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditingBookId = null;
}

// Fungsi untuk menangani submit form edit
function handleEditSubmit(event) {
    event.preventDefault();
    
    if (!currentEditingBookId) return;
    
    const newTitle = document.getElementById('editBookTitle').value;
    const newAuthor = document.getElementById('editBookAuthor').value;
    const newYear = parseInt(document.getElementById('editBookYear').value);
    const newIsComplete = document.getElementById('editBookIsComplete').checked;
    
    if (newTitle && newAuthor && newYear) {
        editBook(currentEditingBookId, newTitle, newAuthor, newYear, newIsComplete);
        hideEditModal();
    }
}

// Fungsi untuk menampilkan modal hapus buku
function showDeleteModal(id) {
    const book = findBook(id);
    if (!book) return;

    // Simpan ID buku yang akan dihapus
    currentDeletingBookId = id;

    // Tampilkan modal
    document.getElementById('deleteModal').style.display = 'block';

    // Isi pesan konfirmasi dengan judul buku
    const deleteMessage = document.getElementById('deleteMessage');
    deleteMessage.innerText = `Yakin ingin menghapus buku "${book.title}"?`;
}

// Fungsi untuk menyembunyikan modal hapus
function hideDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    currentDeletingBookId = null;
}

// Fungsi untuk menangani submit form hapus
function handleDeleteSubmit(event) {
    event.preventDefault();

    if(!currentDeletingBookId) return;

    // Hapus buku berdasarkan ID yang disimpan
    removeBook(currentDeletingBookId);
    hideDeleteModal();
    currentDeletingBookId = null;
}

// Fungsi untuk merender semua buku
function renderBooks() {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    // Bersihkan daftar yang ada
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    // hitung jumlah buku untuk setiap kategori
    const incompleteBooksCount = books.filter(book => !book.isComplete).length;
    const completeBooksCount = books.filter(book => book.isComplete).length;

    // menerapkan layout grid jika buku >= 3
    incompleteBookList.classList.toggle('grid-layout', incompleteBooksCount > 3);
    completeBookList.classList.toggle('grid-layout', completeBooksCount > 3);
    
    for (const book of books) {
        const bookElement = makeBookItem(book);
        
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    }
}

// Fungsi untuk pencarian buku
function searchBook() {
    const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const searchResults = searchBooks(searchTitle);

    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    // Bersihkan daftar yang ada
    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    // hitung jumlah buku untuk setiap kategori
    const incompleteBooksCount = searchResults.filter(book => !book.isComplete).length;
    const completeBooksCount = searchResults.filter(book => book.isComplete).length;

    // terapkan layout grid jika buku >= 3
    incompleteBookList.classList.toggle('grid-layout', incompleteBookList.childElementCount > 3);
    completeBookList.classList.toggle('grid-layout', completeBookList.childElementCount > 3);

    for (const book of searchResults) {
        const bookElement = makeBookItem(book);
        
        if (book.isComplete) {
            completeBookList.appendChild(bookElement);
        } else {
            incompleteBookList.appendChild(bookElement);
        }
    }

    // Jika tidak ada hasil pencarian, tampilkan pesan
    if (searchResults.length === 0) {
        const noResultMessage = document.createElement('p');
        noResultMessage.innerText = 'Tidak ada buku yang ditemukan';
        incompleteBookList.appendChild(noResultMessage);
        

        // hapus grid layout untuk pesan no result
        incompleteBookList.classList.remove('grid-layout');
    }
}



// Event listener untuk render
document.addEventListener(RENDER_EVENT, () => {
    console.log('Rendering books...');
    renderBooks();
});

// Event listener untuk saved
document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil disimpan ke localStorage');
});

