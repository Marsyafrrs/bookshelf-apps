// navbar session
const menu = document.querySelector('nav ul');
const garis = document.querySelector('.garis');

garis.addEventListener('click', function () {
   menu.classList.toggle('active');
});

// main session
const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener("DOMContentLoaded", function () {
    const submitdata = document.getElementById("inputBook");
    submitdata.addEventListener("submit", function (event) {
      event.preventDefault();
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Buku anda telah tersimpan',
        showConfirmButton: false,
        timer: 1500
      })
      addBook();
      setTimeout(function () {
        window.location.href = "index.html"; 
     }, 1600);
    });

    if (isStorageExist()) {  
      loadDataFromStorage();
    }
  });

  function addBook() {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;
  
    const generateBookID = generateBookId();
    const bookObject = generateBookObject(generateBookID, title, author, year, isComplete);
    books.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
  
  function generateBookId() {
    return +new Date();
  }

  function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete,
    };
  }

document.addEventListener(RENDER_EVENT, function () {
    console.log(books);
  });

const checkbox = document.getElementById("inputBookIsComplete");
  checkbox.addEventListener("click", function () {
  button = document.querySelector("#bookSubmit span");
  if (checkbox.checked) {
    button.innerText = "selesai dibaca";
  } else {
    button.innerText = "Belum selesai dibaca";
  }
});


  function makeBook(bookObject) {
    const title = document.createElement("h3");
    title.innerText = bookObject.title;
  
    const author = document.createElement("p");
    author.innerText = "Penulis : " + bookObject.author;
  
    const year = document.createElement("p");
    year.innerText = "Tahun : " + bookObject.year;
  
    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(title, author, year);
    container.setAttribute("id", `book-${bookObject.id}`);
  
    if (bookObject.isComplete) {
      const undoButton = document.createElement("button");
      undoButton.classList.add("green");
      undoButton.innerText = "Belum selesai dibaca";
  
      undoButton.addEventListener("click", function () {
        addBookToUncompleted(bookObject.id);
      });
      const deleteButton = document.createElement("button");
      const actionContainer = document.createElement("div");
      deleteButton.classList.add("red");
      deleteButton.innerText = "Hapus Buku";

      deleteButton.addEventListener("click", function () {
        Swal.fire({
          title: "BUKU AKAN TERHAPUS!!!",
          text: "Anda yakin ingin menghapunya?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#E51706",
          cancelButtonColor: "#07A4D3",
          confirmButtonText: "HAPUS",
          cancelButtonText: "Tidak Sekarang",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("success", "Buku anda telah terhapus pada rak.", "success");
            removeBook(bookObject.id);
          }
        });
      });
  
    actionContainer.classList.add("action");
    actionContainer.append(undoButton, deleteButton);

    container.append(actionContainer)
} else {
      const readButton = document.createElement("button");
      readButton.classList.add("green");
      readButton.innerText = "Selesai dibaca";
    
      readButton.addEventListener("click", function () {
          addBookToCompleted(bookObject.id);
        });


      const deleteButton = document.createElement("button");
      const action = document.createElement("div");
      deleteButton.classList.add("red");
      deleteButton.innerText = "Hapus Buku";
    
      deleteButton.addEventListener("click", function () {
        Swal.fire({
          title: "BUKU AKAN TERHAPUS!!!",
          text: "Anda yakin ingin menghapunya?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#E51706",
          cancelButtonColor: "#07A4D3",
          confirmButtonText: "HAPUS",
          cancelButtonText: "Tidak Sekarang",
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire("success", "Buku anda telah terhapus pada rak.", "success");
            removeBook(bookObject.id);
          }
        });
      });
    
    action.classList.add("action");
    action.append(readButton, deleteButton);
    container.append(action);
}

return container;
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedbookList = document.getElementById('incompleteBookshelfList');
    uncompletedbookList.innerHTML = '';
   
    const completedbookList = document.getElementById('completeBookshelfList');
    completedbookList.innerHTML = '';
   
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (bookItem.isComplete)
        completedbookList.append(bookElement);
      else
        uncompletedbookList.append(bookElement);
    }
  });

  function addBookToUncompleted(bookID) {
    const bookTarget = findBook(bookID);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function addBookToCompleted(bookID) {
    const bookTarget = findBook(bookID);
  
    if (bookTarget == null) return;
  
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookID) {
    for (const bookItem of books) {
      if (bookItem.id == bookID) {
        return bookItem;
      }
    }
    return null;
  }

  function removeBook(bookID) {
    const bookTarget = findBookIndex(bookID);
  
    if (bookTarget === -1) {
      return;
    }
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookID) {
    for (const index in books) {
      if (books[index].id === bookID) {
        return index;
      }
    }
  
    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(books);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  const STORAGE_KEY = "BOOKS";
  const SAVED_EVENT = "book-saved";

  function isStorageExist() {
    if (typeof Storage === undefined) {
      alert("Browser kamu tidak mendukung local storage");
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });  
   
  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
  
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
  
    document.dispatchEvent(new Event(RENDER_EVENT));
  }


const searchBook = document.getElementById("searchBook");
searchBook.addEventListener("submit", function (event) {
  event.preventDefault();
  filterBuku();
});

const filterBuku = () => {
  const key = document.getElementById("searchBookTitle").value.toLowerCase();
  const hasil = books.filter(function (book) {
    return book.title.toLowerCase().includes(key);
  });
  showFilteringBooks(hasil);
};

document.addEventListener(RENDER_EVENT, function () {
  filterBuku();
});

function showFilteringBooks(books) {
  const hasilcari = document.getElementById("hasil-cari");
  hasilcari.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    hasilcari.append(bookElement);
  }
}