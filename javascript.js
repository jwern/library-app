// Book Constructor
function Book(obj) {
  this.title = obj.title;
  this.author = obj.author;
  this.pages = obj.pages;
  this.read = readStatus(obj.read);
  this.bookID = bookID++;
}

Book.prototype.toggleRead = function() {
  this.read = readStatus(!this.read);
  updateLocalStorageLibrary()
}

// Change the book's read status upon clicking icon
function toggleReadStatus(book) {
  let bookDiv = findBookDiv(book);
  let bookObject = myLibrary.find(obj => obj.bookID == findBookID(bookDiv));
  
  bookObject.toggleRead(); // Update the Book object with new read status
  bookDiv.querySelector('.read').classList.toggle('have-read-icon'); // Update the DOM with new read status
  bookDiv.querySelector('.read').classList.toggle('have-not-read-icon'); // Update the DOM with new read status
}

// Get the parent container for book
function findBookDiv(button) {
  return button.closest('.book-info');
}

// Get the specific book by ID
function findBookID(div) {
  return div.getAttribute('data-id');
}

// Add the book object to the persistent library array
function addBookToLibrary(book) {
  myLibrary.push(book);
  updateLocalStorageLibrary()
  localStorage.setItem('bookIDLocal', bookID);
}

// Return read status based on input
function readStatus(read) {
  return (read ? "Have read" : "");
}

// Return read status based on icon
function setReadStatusClass(read) {
  return (read ? "have-read-icon" : "have-not-read-icon");
}

// Add book to display after it's been added to library
function displayNewBook(book) {
  let libraryBlock = document.getElementById('library-set');
  // Create a container for the book that matches the bookID
  let bookDiv = document.createElement('div');
  bookDiv.classList.add("book-info");
  bookDiv.setAttribute('data-id', `${book.bookID}`);

  // Add each property value of the book except the ID and toggle
  for (info in book) {
    if (info !== 'bookID' && info !== 'toggleRead') {
      let infoPara = document.createElement('p');
      infoPara.classList.add(`${info}`);
      let heading = document.createElement('span');
      heading.append(`${info}:`)
      heading.classList.add(`heading-${info}`);
      if (info === 'read') {
        infoPara.classList.add(setReadStatusClass(book[info]));
        infoPara.addEventListener('click', function(e) {
          toggleReadStatus(e.target);
        });
      } else {
        infoPara.append(book[info]);
      };
      bookDiv.append(heading);
      bookDiv.append(infoPara);
    }
  }

  // Create a delete button for the book
  let deleteButton = createButton("delete", "Remove Book");
  bookDiv.append(deleteButton);
  deleteButton.addEventListener('click', function(e) {
    deleteBook(e.target);
  });

  // Add the book container to the library
  libraryBlock.append(bookDiv);
}

// Create a button in the DOM
function createButton(type, text) {
  let button = document.createElement('button');
  button.classList.add(`${type}-button`);
  button.innerHTML = `${text}`;
  return button;
}

// Toggle the add book form visiblity when hitting the button
function revealForm() {
  let addBookform = document.getElementById('add-book-section');
  addBookform.classList.toggle('hidden');

  if (addBookform.classList.contains('hidden')) {
    this.innerHTML = "Add Book";
  } else {
    this.innerHTML = "Hide Form";
  };
}

// Sort books alphabetically by title when sort button pressed
function sortBooks() {
  let preSortedLibrary = myLibrary.slice();
  myLibrary.sort(function(a, b) {
    let aName = a.title.replace(/^The |^A |^An /i, "");
    let bName = b.title.replace(/^The |^A |^An /i, "");
    return aName.localeCompare(bName);
  });
  
  let arrayChanged = preSortedLibrary.find(obj => obj !== myLibrary[preSortedLibrary.indexOf(obj)]);

  // Refresh book list if the order changed
  if (arrayChanged) {
    updateLocalStorageLibrary()
    refreshBookDisplay();
  };
}

// Clear all book divs from DOM and then display current library
function refreshBookDisplay() {
  let libraryContainer = document.getElementById('library-set');

  while (libraryContainer.lastChild) {
    libraryContainer.removeChild(libraryContainer.lastChild);
  }
  initializeBookDisplay();
}

// Create a new book from form input, and add to library array and DOM
function addNewBook(input) {
  // let bookDetails = formatBookInput(input);
  let bookToAdd = new Book(input);
  addBookToLibrary(bookToAdd);
  displayNewBook(bookToAdd);
}

// Remove a book when "remove book" button pressed
function deleteBook(book) {
  let bookToDelete = findBookDiv(book);
  let bookIDToDelete = findBookID(bookToDelete);

  bookToDelete.remove(); // Remove the book div from the DOM
  myLibrary = myLibrary.filter(book => book.bookID != bookIDToDelete); // Remove the book from library array
  updateLocalStorageLibrary()
}

// Add eventListeners to form buttons
function initializeForm() {
  let addBookButton = document.getElementById('add-book-button'); // Button that displays add book form
  let form = document.getElementById('add-book-form');
  let sortBooksButton = document.getElementById('sort-books-button'); // Button that sorts books

  addBookButton.addEventListener('click', revealForm); // Display the add book form when button is clicked

  form.addEventListener('submit', event => { // Listener to add book that is submitted via form
    event.preventDefault(); // We don't want the form to actually submit its data
    let bookInput = Object.fromEntries(new FormData(event.target).entries()); // FormData translation via https://stackoverflow.com/a/56857084/12183520
    addNewBook(bookInput); // Add the submitted book to our library
    event.target.reset(); // Empty the form inputs after creating the new book
  });

  sortBooksButton.addEventListener('click', sortBooks);
}

// Initial display of books already in library
function initializeBookDisplay() {
  for (book of myLibrary) {
    displayNewBook(book);
  };
}

// Called throughout our script, anytime the library array changes
function updateLocalStorageLibrary() {
  localStorage.setItem("myLibraryLocal", JSON.stringify(myLibrary));
}

// Static book objects for sample purposes
function addTestBooks() {
  addBookToLibrary(new Book({title: "Sample Book", author: "Writey McWriterson", pages: 250, read: "Have read"}));
  addBookToLibrary(new Book({title: "Another Sample Book", author: "A. U. Thor", pages: 510}));
}

// Testing for LocalStorage, function taken from MDN:
function storageAvailable(type) {
  var storage;
  try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
  }
  catch(e) {
      return e instanceof DOMException && (
          // everything except Firefox
          e.code === 22 ||
          // Firefox
          e.code === 1014 ||
          // test name field too, because code might not be present
          // everything except Firefox
          e.name === 'QuotaExceededError' ||
          // Firefox
          e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
          // acknowledge QuotaExceededError only if there's something already stored
          (storage && storage.length !== 0);
  }
}

// Initial setup: get localStorage, add sample books if needed, display library, and add eventListeners to buttons
function startupLibrary() {
  if (storageAvailable('localStorage')) {
    let newLibrary = localStorage.getItem('myLibraryLocal');
    if (newLibrary) {
      bookID = Number(localStorage.getItem('bookIDLocal'));
      myLibrary = JSON.parse(newLibrary).map(function(obj) {
        return Object.assign({}, obj, Book.prototype);
      });

    } else {
      addTestBooks();
    }
  }
  else {
    addTestBooks();
  }
  initializeBookDisplay();
  initializeForm();
}

let myLibrary = [];
let bookID = 1;
startupLibrary();