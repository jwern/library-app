// Book Constructor
function Book([title, author, pages, read]) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = readStatus(read);
  this.bookID = bookID++;
}

Book.prototype.toggleRead = function() {
  this.read = readStatus(!this.read);
}

function toggleReadStatus(book) {
  let bookDiv = findBookDiv(book);
  let bookObject = myLibrary.find(obj => obj.bookID == findBookID(bookDiv));
  
  bookObject.toggleRead(); // Update the Book object with new read status
  // bookDiv.querySelector('.read').innerHTML = bookObject.read; // Update the DOM with new read status
  bookDiv.querySelector('.read').classList.toggle('have-read-icon');
  bookDiv.querySelector('.read').classList.toggle('have-not-read-icon');
}

function findBookDiv(button) {
  return button.closest('.book-info');
}

function findBookID(div) {
  return div.getAttribute('data-id');
}

// Add the book object to the persistent library array
function addBookToLibrary(book) {
  myLibrary.push(book);
}

function readStatus(read) {
  return (read ? "Have read" : "");
}

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

  // Create a toggle read button for the book
  // let toggleButton = createButton("toggle", "Change Read Status");
  // bookDiv.append(toggleButton);
  // toggleButton.addEventListener('click', function(e) {
  //   toggleReadStatus(e.target);
  // });

  // Add the container to the library
  libraryBlock.append(bookDiv);
}

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

function sortBooks() {
  myLibrary = myLibrary.sort(function(a, b) {
    let aName = a.title.replace(/^The |^A |^An /i, "");
    let bName = b.title.replace(/^The |^A |^An /i, "");
    return aName.localeCompare(bName);
  });
  
  let libraryContainer = document.getElementById('library-set');

  libraryContainer.innerHTML = '';
  initializeBookDisplay();
}

// Translate form input to Book Object input
function formatBookInput(input) {
  // let defaultValue = "N/A";
  let title = input['book-title'];
  let author = input['book-author'];
  let pages = input['book-pages'];
  let read = input['book-have-read'];

  return [title, author, pages, read];
}

// Create a new book from form input, and add to library array and DOM
function addNewBook(input) {
  let bookDetails = formatBookInput(input);
  let bookToAdd = new Book(bookDetails);
  addBookToLibrary(bookToAdd);
  displayNewBook(bookToAdd);
}

function deleteBook(book) {
  let bookToDelete = findBookDiv(book);
  let bookIDToDelete = findBookID(bookToDelete);

  bookToDelete.remove(); // Remove the book div from the DOM
  myLibrary = myLibrary.filter(book => book.bookID != bookIDToDelete);
}

// Add eventListeners to form buttons
function initializeForm() {
  let addBookButton = document.getElementById('add-book-button');
  let form = document.getElementById('add-book-form');
  let sortBooksButton = document.getElementById('sort-books-button');

  addBookButton.addEventListener('click', revealForm); // Display the add book form when button is clicked

  form.addEventListener('submit', event => { // Listener to add book that is submitted via form
    event.preventDefault(); // We don't want the form to actually submit its data
    const bookInput = Object.fromEntries(new FormData(event.target).entries()); // FormData translation via https://stackoverflow.com/a/56857084/12183520
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

// Static book objects for testing purposes
function addTestBooks() {
  addBookToLibrary(new Book(["Catch-22", "Joseph Heller", 208, "Have read"]));
  addBookToLibrary(new Book(["The Old Man and the Sea", "Ernest Hemingway", 75]));
  addBookToLibrary(new Book(["In Cold Blood", "Truman Capote", 250, "Have read"]));
  addBookToLibrary(new Book(["Middlesex", "Jeffrey Eugenides", 450, "Have read"]));
  addBookToLibrary(new Book(["The Handmaid's Tale", "Margaret Atwood", 180, "Have read"]));
  addBookToLibrary(new Book(["Alice in Wonderland", "Lewis Carroll", 220, "Have read"]));
  addBookToLibrary(new Book(["The Year of the Death of Ricardo Reis", "José Saramago", 145]));
}

function startupLibrary() {
  addTestBooks();
  initializeBookDisplay();
  initializeForm();
}

let myLibrary = [];
let bookID = 1;
startupLibrary();